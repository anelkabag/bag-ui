import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getResendEventStatus } from "@/lib/release-notifications";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("RESEND_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook is not configured" },
      { status: 503 },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 1_000_000) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  const eventId = request.headers.get("svix-id");
  const timestamp = request.headers.get("svix-timestamp");
  const signature = request.headers.get("svix-signature");
  if (!eventId || !timestamp || !signature) {
    return NextResponse.json({ error: "Missing webhook signature" }, { status: 400 });
  }

  const payload = await request.text();
  if (Buffer.byteLength(payload) > 1_000_000) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let event;
  try {
    event = new Resend().webhooks.verify({
      payload,
      webhookSecret,
      headers: { id: eventId, timestamp, signature },
    });
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (!event.type.startsWith("email.")) {
    return NextResponse.json({ received: true, ignored: true });
  }

  const emailId =
    "email_id" in event.data && typeof event.data.email_id === "string"
      ? event.data.email_id
      : null;
  if (!emailId) {
    return NextResponse.json({ error: "Missing email event identifier" }, { status: 400 });
  }

  const tags =
    "tags" in event.data &&
    typeof event.data.tags === "object" &&
    event.data.tags !== null
      ? event.data.tags
      : null;
  const deliveryIdTag =
    tags && "delivery_id" in tags && typeof tags.delivery_id === "string"
      ? tags.delivery_id
      : null;
  const deliveryId =
    deliveryIdTag &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      deliveryIdTag,
    )
      ? deliveryIdTag
      : null;

  const status = getResendEventStatus(event.type);
  const supabase = await createSupabaseServiceRoleClient();
  const { error } = await supabase.rpc("apply_resend_email_event", {
    p_event_id: eventId,
    p_event_type: event.type,
    p_resend_email_id: emailId,
    p_status: status,
    p_delivery_id: deliveryId,
  });
  if (error) {
    console.error("Could not persist Resend webhook", error.code);
    return NextResponse.json(
      { error: "Could not process webhook" },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
