import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "__session";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  const url = request.nextUrl.clone();
  const { pathname } = request.nextUrl;

  // Protect Admin Workspace
  if (pathname.startsWith("/admin") && !pathname.includes("/login")) {
    if (!session) {
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    // Deep authorization will happen via Server Actions and data fetching
  }

  // Protect Coordinator Workspace
  if (pathname.startsWith("/coordinator") && !pathname.includes("/login")) {
    if (!session) {
      url.pathname = "/coordinator/login";
      return NextResponse.redirect(url);
    }
    // Deep authorization will happen via Server Actions and data fetching
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/coordinator/:path*",
  ],
};
