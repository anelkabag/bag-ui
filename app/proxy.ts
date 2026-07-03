import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/account"];

export function middleware(request: NextRequest) {
  const requestedPath = request.nextUrl.pathname;

  if (!protectedRoutes.some((route) => requestedPath.startsWith(route))) {
    return NextResponse.next();
  }

  // Vérifier les cookies de session Supabase
  const token = request.cookies.get("sb-access-token")?.value;
  const refreshToken = request.cookies.get("sb-refresh-token")?.value;

  // Si les deux tokens existent, continuer
  if (token && refreshToken) {
    return NextResponse.next();
  }

  // Sinon, laisser la page serveur gérer la redirection
  // car elle peut vérifier la session via getSession()
  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*"],
};
