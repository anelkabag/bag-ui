import { NextResponse } from "next/server";
import { createSupabaseRouteHandlerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = createSupabaseRouteHandlerClient();

  if (!body?.password) {
    return NextResponse.json({ error: "Missing password" }, { status: 400 });
  }

  const { error } = await supabase.auth.updateUser({
    password: body.password,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message ?? "Unable to reset password." },
      { status: 400 },
    );
  }

  return NextResponse.json({ success: true });
}
