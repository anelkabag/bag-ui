import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { withPostHogProxy } from "@posthog/next";

export const proxy = withPostHogProxy(
  async (request: NextRequest) => {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // Rafraîchit la session et réécrit les cookies. La page /account décide du redirect.
    await supabase.auth.getUser();

    return response;
  },
  {
    apiKey:
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ??
      process.env.NEXT_PUBLIC_POSTHOG_KEY,
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
  },
);

export const config = {
  matcher: ["/account/:path*"],
};