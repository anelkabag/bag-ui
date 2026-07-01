import { NextResponse } from "next/server";
import { createSupabaseRouteHandlerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseRouteHandlerClient();
  const body = await request.json();

  if (!body?.email || !body?.password || !body?.action) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  if (body.action === "sign_in") {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ session: data.session });
  }

  if (body.action === "sign_up") {
    const { data, error } = await supabase.auth.signUp({
      email: body.email,
      password: body.password,
      options: {
        data: { username: body.username, plan: "free" },
      },
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ session: data.session });
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}
