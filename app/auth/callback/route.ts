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

  const supabase = await createSupabaseRouteHandlerClient();

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      if (searchParams.get("welcome") === "1") {
        await sendWelcomeEmailOnce(data.session?.user);
      }

      // Redirige sur le même host que celui qui a reçu les cookies
      return NextResponse.redirect(new URL(next, origin));
    }

    console.error("exchangeCodeForSession:", error.message);
  } else {
    console.error("auth callback: missing code");
  }

  // Code déjà consommé (prefetch, double appel) mais session valide :
  // on ne montre pas d'erreur
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return NextResponse.redirect(new URL(next, origin));
  }

  return NextResponse.redirect(
    new URL("/login?error=auth_callback_error", origin),
  );
}