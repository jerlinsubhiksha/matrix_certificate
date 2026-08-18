import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "jose";

const SESSION_COOKIE_NAME = "__session";

export function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const url = request.nextUrl.clone();
  const { pathname } = request.nextUrl;

  // Allow everyone to see the beautiful landing page!
  if (pathname === "/") {
    return NextResponse.next();
  }

  if (!session) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If session exists, enforce role boundaries
  try {
    const decoded = decodeJwt(session);
    const role = decoded.role as string | undefined;

    const isCoordinatorRoute = pathname.startsWith("/coordinator");
    const isAdminRoute = !isCoordinatorRoute; // Everything else (e.g. /dashboard, /events, /certificates) is Admin

    if (isCoordinatorRoute && role !== "COORDINATOR") {
      // Admin trying to access Coordinator area -> kick back to Admin dashboard
      if (role === "ADMIN") {
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    if (isAdminRoute && role !== "ADMIN") {
      // Coordinator trying to access Admin area -> kick back to Coordinator dashboard
      if (role === "COORDINATOR") {
        url.pathname = "/coordinator/dashboard";
        return NextResponse.redirect(url);
      }
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

  } catch (error) {
    console.error("Error decoding JWT in middleware", error);
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (the login page itself)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png|login).*)',
  ],
};
