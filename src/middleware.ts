import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "jose";

const SESSION_COOKIE_NAME = "__session";

export function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const url = request.nextUrl.clone();
  const { pathname } = request.nextUrl;

  // 🛑 TEMPORARY BYPASS FOR LOCAL UI TESTING 🛑
  // Remove this when you are ready to strictly enforce roles locally!
  if (process.env.NODE_ENV === "development" && pathname.startsWith("/coordinator")) {
    return NextResponse.next();
  }

  // Protect Admin Workspace
  if (pathname.startsWith("/admin")) {
    if (!session && !pathname.includes("/login")) {
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  // Protect Coordinator Workspace
  if (pathname.startsWith("/coordinator")) {
    if (!session && !pathname.includes("/login")) {
      url.pathname = "/coordinator/login";
      return NextResponse.redirect(url);
    }
  }

  // If a session exists, enforce the role wall
  if (session) {
    try {
      const decoded = decodeJwt(session);
      const role = decoded.role as string | undefined;

      // Wall for Admin routes
      if (pathname.startsWith("/admin")) {
        if (role !== "ADMIN" && !pathname.includes("/login")) {
          // If they aren't admin, kick them out to their correct dashboard
          url.pathname = role === "COORDINATOR" ? "/coordinator" : "/";
          return NextResponse.redirect(url);
        }
        // If they are on the login page but already logged in as ADMIN
        if (role === "ADMIN" && pathname.includes("/login")) {
          url.pathname = "/admin";
          return NextResponse.redirect(url);
        }
      }

      // Wall for Coordinator routes
      if (pathname.startsWith("/coordinator")) {
        if (role !== "COORDINATOR" && !pathname.includes("/login")) {
          // If they aren't coordinator, kick them out (to their actual dashboard)
          url.pathname = role === "ADMIN" ? "/dashboard" : "/";
          return NextResponse.redirect(url);
        }
        // If they are on the login page but already logged in as COORDINATOR
        if (role === "COORDINATOR" && pathname.includes("/login")) {
          url.pathname = "/coordinator/dashboard";
          return NextResponse.redirect(url);
        }
      }
    } catch (error) {
      console.error("Error decoding JWT in middleware", error);
      // If token is invalid, let them proceed (it will be caught by deeper checks, or we can just redirect to login)
      // We don't want to infinite loop, so if they aren't on login, redirect to root
      if (!pathname.includes("/login")) {
         url.pathname = "/";
         return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/coordinator/:path*",
  ],
};
