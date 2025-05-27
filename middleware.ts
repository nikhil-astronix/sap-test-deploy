// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const loginStatus = request.cookies.get("loginStatus")?.value;
  const userId = request.cookies.get("userId")?.value;
  const session = request.cookies.get("session")?.value;

  // If no token and not on /auth/login, redirect to login
  if (!token && !request.nextUrl.pathname.startsWith("/auth/login")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If NEW_PASSWORD_REQUIRED, redirect to /auth/reset-password with proper query
  if (
    loginStatus === "NEW_PASSWORD_REQUIRED" &&
    !request.nextUrl.pathname.startsWith("/auth/reset-password")
  ) {
    const flow = "SET_NEW_PASSWORD";
    const resetUrl = new URL("/auth/reset-password", request.url);
    resetUrl.searchParams.set("flow", flow);
    resetUrl.searchParams.set("userId", userId ?? "");
    resetUrl.searchParams.set("session", session ?? "");

    return NextResponse.redirect(resetUrl);
  }

  // Otherwise, allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|auth/login).*)"],
};
