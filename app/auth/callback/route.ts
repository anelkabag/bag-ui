// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { sendWelcomeEmailOnce } from "@/lib/welcome-email";
import { createSupabaseRouteHandlerClient } from "@/lib/supabase/server";

const FALLBACK_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.bagui.pro";

function getBaseUrl(request: Request) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";

  // Host public transmis par le proxy, sauf si c'est une adresse locale
  if (forwardedHost && !/^(localhost|127\.0\.0\.1)/.test(forwardedHost)) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  // Sinon : domaine du projet, jamais localhost
  return FALLBACK_URL;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");

  // Évite l'open redirect : on n'accepte que des chemins relatifs internes
  const rawNext = searchParams.get("next") ?? "/blocks";
  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/blocks";

  const baseUrl = getBaseUrl(request);

  const supabase = await createSupabaseRouteHandlerClient();

  let reason = "missing_code";

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      if (searchParams.get("welcome") === "1") {
        await sendWelcomeEmailOnce(data.session?.user);
      }

      return NextResponse.redirect(new URL(next, baseUrl));
    }

    console.error("exchangeCodeForSession:", error.message);
    reason = error.message;
  } else {
    console.error("auth callback: missing code");
  }

  // Code déjà consommé (prefetch, double appel) mais session valide :
  // on ne montre pas d'erreur
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return NextResponse.redirect(new URL(next, baseUrl));
  }

  // TEMPORAIRE : `reason` sert au debug, à retirer une fois l'erreur résolue
  return NextResponse.redirect(
    new URL(
      `/login?error=auth_callback_error&reason=${encodeURIComponent(reason)}`,
      baseUrl,
    ),
  );
}