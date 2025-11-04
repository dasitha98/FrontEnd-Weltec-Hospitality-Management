import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require auth
const PUBLIC_PATHS = ["/login"];
const PUBLIC_API_PATHS = ["/api/auth/login"];

// Token expiration time: 24 hours in milliseconds
const TOKEN_EXPIRATION_TIME = 24 * 60 * 60 * 1000;

/**
 * Validates if a token is expired or invalid
 * @param token - The access token to validate
 * @returns true if token is valid, false if expired or invalid
 */
function isTokenValid(token: string): boolean {
  try {
    // Decode the base64 token
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const tokenData = JSON.parse(decoded);

    // Check if token has timestamp
    if (!tokenData.ts || typeof tokenData.ts !== "number") {
      return false;
    }

    // Check if token is expired (24 hours from creation)
    const now = Date.now();
    const tokenAge = now - tokenData.ts;

    // Allow some small negative age (clock skew tolerance)
    if (tokenAge < -60000) {
      // Token is more than 1 minute in the future, likely invalid
      return false;
    }

    if (tokenAge > TOKEN_EXPIRATION_TIME) {
      return false;
    }

    return true;
  } catch (error) {
    // Token is invalid if it can't be decoded or parsed
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public page routes
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow public API routes
  if (PUBLIC_API_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Skip Next.js internal routes
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Check for access token
  const token = request.cookies.get("accessToken")?.value;

  if (!token) {
    // Redirect to login with the intended destination
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/" && !pathname.startsWith("/api/")) {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Validate token expiration
  try {
    if (!isTokenValid(token)) {
      // Token is expired or invalid, redirect to login
      const loginUrl = new URL("/login", request.url);
      if (pathname !== "/" && !pathname.startsWith("/api/")) {
        loginUrl.searchParams.set("redirect", pathname);
      }
      // Clear the invalid token cookie
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("accessToken");
      return response;
    }
  } catch (error) {
    // If validation throws an error, don't remove cookie - just redirect
    // This handles edge cases where token format might be unexpected
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/" && !pathname.startsWith("/api/")) {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except static files and Next.js internals
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
