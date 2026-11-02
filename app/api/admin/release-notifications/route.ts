import { NextResponse } from "next/server";
import {
  createSupabaseRouteHandlerClient,
  createSupabaseServiceRoleClient,
} from "@/lib/supabase/server";
import { isReleaseNotificationAdmin } from "@/lib/release-notifications";

async function getAdminClient() {
  const authClient = await createSupabaseRouteHandlerClient();
  const {
    data: { user },
    error,
  } = await authClient.auth.getUser();

  if (error || !user || !isReleaseNotificationAdmin(user.email)) {
    return null;
  }
  return createSupabaseServiceRoleClient();
}

export async function GET() {
  const supabase = await getAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("release_notification_stats")
    .select(
      "id, resource_key, resource_type, resource_name, category, created_at, total_recipients, emails_sent, delivered, failed, retryable_failed, bounced, complained, pending",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Could not read release notification campaigns", error.code);
    return NextResponse.json(
      { error: "Unable to load campaign history" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { campaigns: data ?? [] },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const supabase = await getAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const releaseId =
    typeof body === "object" &&
    body !== null &&
    "releaseId" in body &&
    typeof body.releaseId === "string"
      ? body.releaseId
      : "";
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      releaseId,
    )
  ) {
    return NextResponse.json({ error: "Invalid release id" }, { status: 400 });
  }

  const { data, error } = await supabase.rpc("retry_release_notification", {
    p_release_id: releaseId,
  });
  if (error) {
    console.error("Could not retry release deliveries", error.code);
    return NextResponse.json(
      { error: "Unable to retry failed deliveries" },
      { status: 500 },
    );
  }

  return NextResponse.json({ retried: data ?? 0 });
}
