import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withPostHogProxy } from "@posthog/next";

const protectedRoutes = ["/account"];

export const proxy = withPostHogProxy(
  async (request: NextRequest) => {
    const requestedPath = request.nextUrl.pathname;

    if (!protectedRoutes.some((route) => requestedPath.startsWith(route))) {
      return NextResponse.next();
    }

    const token = request.cookies.get("sb-access-token")?.value;
    const refreshToken = request.cookies.get("sb-refresh-token")?.value;

    if (token && refreshToken) {
      return NextResponse.next();
    }

    // The account page checks the session itself and decides whether to redirect.
    return NextResponse.next();
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
