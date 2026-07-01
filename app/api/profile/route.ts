import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    return NextResponse.json({ profile: null }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, username, avatar_url, created_at, updated_at")
    .eq("id", session.user.id)
    .single();

  if (error) {
    return NextResponse.json({ profile: null }, { status: 500 });
  }

  return NextResponse.json({ profile });
}
