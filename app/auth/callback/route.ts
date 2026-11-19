import { NextResponse } from "next/server";
import { sendWelcomeEmailOnce } from "@/lib/welcome-email";
import { createSupabaseRouteHandlerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/blocks";

  if (code) {
    const supabase = await createSupabaseRouteHandlerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (searchParams.get("welcome") === "1") {
        await sendWelcomeEmailOnce(data.session?.user);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}