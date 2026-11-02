import { NextResponse } from "next/server";
import {
  createSupabaseRouteHandlerClient,
  createSupabaseServiceRoleClient,
} from "@/lib/supabase/server";

export async function GET() {
  const authClient = await createSupabaseRouteHandlerClient();
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serviceClient = await createSupabaseServiceRoleClient();
  const { data, error } = await serviceClient
    .from("notification_preferences")
    .select("product_updates_enabled")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Could not read notification preferences", error.code);
    return NextResponse.json(
      { error: "Unable to load notification preferences" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { productUpdatesEnabled: data?.product_updates_enabled ?? false },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function PUT(request: Request) {
  const authClient = await createSupabaseRouteHandlerClient();
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("productUpdatesEnabled" in body) ||
    typeof body.productUpdatesEnabled !== "boolean"
  ) {
    return NextResponse.json(
      { error: "productUpdatesEnabled must be a boolean" },
      { status: 400 },
    );
  }

  const serviceClient = await createSupabaseServiceRoleClient();
  const { error } = await serviceClient.rpc("set_notification_preference", {
    p_user_id: user.id,
    p_enabled: body.productUpdatesEnabled,
  });

  if (error) {
    console.error("Could not update notification preferences", error.code);
    return NextResponse.json(
      { error: "Unable to update notification preferences" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { productUpdatesEnabled: body.productUpdatesEnabled },
    { headers: { "Cache-Control": "no-store" } },
  );
}
