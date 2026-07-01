import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
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
    .maybeSingle<{
      id: string;
      email: string;
      username: string;
      avatar_url: string | null;
      created_at: string;
      updated_at: string;
    }>();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ profile: null }, { status: 500 });
  }

  const username =
    typeof session.user.user_metadata?.username === "string" &&
    session.user.user_metadata.username.trim().length > 0
      ? session.user.user_metadata.username
      : (profile?.username ?? session.user.email?.split("@")[0] ?? "user");

  const plan = (session.user.user_metadata?.plan ??
    session.user.user_metadata?.subscription_plan ??
    session.user.app_metadata?.plan ??
    session.user.app_metadata?.subscription_plan ??
    "free") as string;

  const fallbackProfile = {
    id: session.user.id,
    email: session.user.email ?? "",
    username,
    avatar_url: profile?.avatar_url ?? null,
    created_at:
      profile?.created_at ??
      session.user.created_at ??
      new Date().toISOString(),
    updated_at:
      profile?.updated_at ??
      session.user.updated_at ??
      new Date().toISOString(),
    plan,
    subscription_plan: plan,
  };

  return NextResponse.json({ profile: profile ?? fallbackProfile });
}
