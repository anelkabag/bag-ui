import { randomUUID } from "node:crypto";
import { getResendClient } from "@/lib/email";
import {
  assertNotificationTokenSecret,
  createUnsubscribeToken,
} from "@/lib/notification-security";
import {
  isRetryableResendError,
  PRODUCTION_SITE_URL,
} from "@/lib/release-notifications";
import { buildReleaseNotificationEmail } from "@/lib/release-notification-email";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { Resend } from "resend";

interface ClaimedDelivery {
  id: string;
  release_id: string;
  user_id: string;
  email: string;
  attempts: number;
  resource_name: string;
  description: string;
  resource_type: string;
  category: string;
  resource_url: string;
  image_url: string | null;
}

let domainVerifiedUntil = 0;
let nextResendRequestAt = 0;

async function sendAtResendRateLimit<T>(send: () => Promise<T>) {
  const now = Date.now();
  const scheduledAt = Math.max(now, nextResendRequestAt);
  nextResendRequestAt = scheduledAt + 500;
  if (scheduledAt > now) {
    await new Promise((resolve) => setTimeout(resolve, scheduledAt - now));
  }
  return send();
}

async function assertSenderDomainVerified(resend: Resend) {
  if (Date.now() < domainVerifiedUntil) return;

  const { data, error } = await resend.domains.list({ limit: 100 });
  if (error) {
    throw new Error(`Unable to verify Resend sender domain: ${error.name}`);
  }

  const domain = data.data.find(
    (candidate) => candidate.name.toLowerCase() === "news.bagui.pro",
  );
  if (
    domain?.status !== "verified" ||
    domain.capabilities.sending !== "enabled"
  ) {
    throw new Error("Resend sender domain news.bagui.pro is not verified for sending");
  }

  domainVerifiedUntil = Date.now() + 10 * 60 * 1000;
}

function getErrorDetails(error: unknown) {
  if (typeof error === "object" && error !== null) {
    const candidate = error as {
      name?: unknown;
      statusCode?: unknown;
    };
    return {
      code:
        typeof candidate.name === "string"
          ? candidate.name.slice(0, 80)
          : "resend_request_failed",
      statusCode:
        typeof candidate.statusCode === "number"
          ? candidate.statusCode
          : null,
    };
  }

  return { code: "resend_request_failed", statusCode: null };
}

async function sendDelivery(
  resend: Resend,
  supabase: Awaited<ReturnType<typeof createSupabaseServiceRoleClient>>,
  delivery: ClaimedDelivery,
) {
  const token = createUnsubscribeToken(delivery.user_id);
  const unsubscribeUrl = `${PRODUCTION_SITE_URL}/api/notifications/unsubscribe?token=${encodeURIComponent(token)}`;
  const preferencesUrl = `${PRODUCTION_SITE_URL}/account#notifications`;
  const email = buildReleaseNotificationEmail({
    resource_key: delivery.release_id,
    resource_type: delivery.resource_type,
    resource_name: delivery.resource_name,
    description: delivery.description,
    category: delivery.category,
    resource_url: delivery.resource_url,
    image_url: delivery.image_url,
    unsubscribeUrl,
    preferencesUrl,
  });

  try {
    const result = await sendAtResendRateLimit(() =>
      resend.emails.send(
        {
          ...email,
          to: [delivery.email],
          tags: [{ name: "delivery_id", value: delivery.id }],
        },
        { idempotencyKey: `release-email:${delivery.id}` },
      ),
    );

    if (result.error) {
      const details = getErrorDetails(result.error);
      const { error } = await supabase.rpc("fail_release_email_delivery", {
        p_delivery_id: delivery.id,
        p_error_code: details.code,
        p_retryable: isRetryableResendError(details.statusCode),
      });
      if (error) console.error("Could not record Resend failure", error.code);
      return false;
    }

    const { error } = await supabase.rpc("complete_release_email_delivery", {
      p_delivery_id: delivery.id,
      p_resend_email_id: result.data.id,
    });
    if (error) {
      console.error("Could not record accepted Resend email", error.code);
      return false;
    }
    return true;
  } catch (error) {
    const details = getErrorDetails(error);
    const { error: updateError } = await supabase.rpc(
      "fail_release_email_delivery",
      {
        p_delivery_id: delivery.id,
        p_error_code: details.code,
        p_retryable: isRetryableResendError(details.statusCode),
      },
    );
    if (updateError) {
      console.error("Could not record Resend failure", updateError.code);
    }
    return false;
  }
}

export async function runReleaseNotificationWorker() {
  const supabase = await createSupabaseServiceRoleClient();
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  assertNotificationTokenSecret();

  const resend = getResendClient();
  if (!resend) {
    throw new Error("Resend client could not be initialized");
  }
  await assertSenderDomainVerified(resend);

  const workerId = randomUUID();
  const { data: workerClaimed, error: workerClaimError } = await supabase.rpc(
    "try_claim_release_notification_worker",
    { p_worker_id: workerId },
  );
  if (workerClaimError) {
    throw new Error(`Could not claim notification worker: ${workerClaimError.code}`);
  }
  if (!workerClaimed) {
    return { sent: 0, skipped: "worker_busy" };
  }

  try {
    const { data: deliveries, error: claimError } = await supabase.rpc(
      "claim_release_email_deliveries",
      { p_limit: 50 },
    );
    if (claimError) {
      throw new Error(`Could not claim notification deliveries: ${claimError.code}`);
    }

    const claimed = (deliveries ?? []) as ClaimedDelivery[];
    if (claimed.length === 0) {
      return { sent: 0, pending: 0 };
    }

    const userIds = Array.from(
      new Set(claimed.map((delivery) => delivery.user_id)),
    );
    const { data: optedInUsers, error: preferenceError } = await supabase
      .from("notification_preferences")
      .select("user_id")
      .in("user_id", userIds)
      .eq("product_updates_enabled", true);
    if (preferenceError) {
      throw new Error(
        `Could not confirm notification preferences: ${preferenceError.code}`,
      );
    }

    const optedIn = new Set((optedInUsers ?? []).map((user) => user.user_id));
    const cancelledIds = claimed
      .filter((delivery) => !optedIn.has(delivery.user_id))
      .map((delivery) => delivery.id);
    if (cancelledIds.length > 0) {
      const { error } = await supabase
        .from("release_email_deliveries")
        .update({
          status: "cancelled",
          locked_until: null,
          updated_at: new Date().toISOString(),
        })
        .in("id", cancelledIds)
        .eq("status", "sending");
      if (error) {
        throw new Error(`Could not cancel opted-out deliveries: ${error.code}`);
      }
    }

    const eligible = claimed.filter((delivery) => optedIn.has(delivery.user_id));
    let sent = 0;
    let cancelledBeforeSend = cancelledIds.length;
    for (let offset = 0; offset < eligible.length; offset += 5) {
      const batch = eligible.slice(offset, offset + 5);
      const { data: activeDeliveries, error: activeDeliveryError } = await supabase
        .from("release_email_deliveries")
        .select("id")
        .in(
          "id",
          batch.map((delivery) => delivery.id),
        )
        .eq("status", "sending");
      if (activeDeliveryError) {
        throw new Error(
          `Could not confirm delivery status: ${activeDeliveryError.code}`,
        );
      }

      const activeIds = new Set(
        (activeDeliveries ?? []).map((delivery) => delivery.id),
      );
      cancelledBeforeSend += batch.length - activeIds.size;
      const results = await Promise.all(
        batch
          .filter((delivery) => activeIds.has(delivery.id))
          .map((delivery) => sendDelivery(resend, supabase, delivery)),
      );
      sent += results.filter(Boolean).length;
    }

    console.info("Release notification batch processed", {
      claimed: claimed.length,
      sent,
      cancelled: cancelledBeforeSend,
    });

    return {
      sent,
      pending: Math.max(0, claimed.length - sent),
    };
  } finally {
    const { error } = await supabase.rpc(
      "release_release_notification_worker",
      { p_worker_id: workerId },
    );
    if (error) {
      console.error("Could not release notification worker lock", error.code);
    }
  }
}
