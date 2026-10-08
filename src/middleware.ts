import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "jose";

const SESSION_COOKIE_NAME = "__session";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  const url = request.nextUrl.clone();
  const { pathname } = request.nextUrl;

  const protectedRoutes = [
    "/dashboard", 
    "/events", 
    "/coordinators", 
    "/participants", 
    "/certificates", 
    "/email-queue", 
    "/analytics", 
    "/logs", 
    "/settings", 
    "/profile",
    "/coordinator"
  ];

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtected && !session) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (session) {
    try {
      const payload = decodeJwt(session);
      
      const role = payload.role;

      // Enforce strict boundaries
      if (role === "COORDINATOR" && !pathname.startsWith("/coordinator/") && isProtected) {
        url.pathname = "/coordinator/dashboard";
        return NextResponse.redirect(url);
      }

      if (role === "ADMIN" && (pathname === "/coordinator" || pathname.startsWith("/coordinator/"))) {
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    } catch (e) {
      console.error("Middleware failed to decode session token", e);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/events/:path*",
    "/coordinators/:path*",
    "/participants/:path*",
    "/certificates/:path*",
    "/email-queue/:path*",
    "/analytics/:path*",
    "/logs/:path*",
    "/settings/:path*",
    "/profile/:path*",
    "/coordinator/:path*",
    "/login",
  ],
};
