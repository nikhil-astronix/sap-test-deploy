// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Read the token cookie
  const token = request.cookies.get("token")?.value;

  // If no token and not accessing /auth/login, redirect to /auth/login
  if (!token && !request.nextUrl.pathname.startsWith("/auth/login")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Allow navigation
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - static files (_next/, images, etc.)
     * - /auth/login route itself
     */
    "/((?!_next/static|_next/image|favicon.ico|auth/login).*)",
  ],
};
