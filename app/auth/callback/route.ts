// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { sendWelcomeEmailOnce } from "@/lib/welcome-email";
import { createSupabaseRouteHandlerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");

  // Évite l'open redirect : on n'accepte que des chemins relatifs internes
  const rawNext = searchParams.get("next") ?? "/blocks";
  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/blocks";

  const baseUrl =
    process.env.NODE_ENV === "development"
      ? origin
      : process.env.NEXT_PUBLIC_APP_URL || "https://bagui.pro";

  const supabase = await createSupabaseRouteHandlerClient();

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      if (searchParams.get("welcome") === "1") {
        await sendWelcomeEmailOnce(data.session?.user);
      }

      return NextResponse.redirect(new URL(next, baseUrl));
    }

    console.error("exchangeCodeForSession:", error.message);
  } else {
    console.error("auth callback: missing code");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return NextResponse.redirect(new URL(next, baseUrl));
  }

  return NextResponse.redirect(
    new URL("/login?error=auth_callback_error", baseUrl),
  );
}