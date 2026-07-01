import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/account"];

export function middleware(request: NextRequest) {
  const requestedPath = request.nextUrl.pathname;

  if (!protectedRoutes.some((route) => requestedPath.startsWith(route))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("sb-access-token");
  const refreshToken = request.cookies.get("sb-refresh-token");
  const isAuthenticated = Boolean(token && refreshToken);

  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", requestedPath);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*"],
};
