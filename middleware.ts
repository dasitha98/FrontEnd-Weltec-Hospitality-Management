import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require auth
const PUBLIC_PATHS = ["/login"];
const PUBLIC_API_PATHS = ["/api/auth/login"];

// Token expiration time: 24 hours in milliseconds
const TOKEN_EXPIRATION_TIME = 24 * 60 * 60 * 1000;

/**
 * Validates if a JWT token is expired or invalid
 * @param token - The JWT access token to validate
 * @returns true if token is valid, false if expired or invalid
 */
function isTokenValid(token: string): boolean {
  try {
    // JWT tokens have 3 parts: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      return false;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    // Add padding if needed for base64 decoding
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    // JWT uses base64url, convert to base64
    const base64Payload = paddedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = Buffer.from(base64Payload, "base64").toString("utf-8");
    const tokenData = JSON.parse(decoded);

    // Check if token has expiration (exp field)
    // exp is Unix timestamp in seconds, not milliseconds
    if (!tokenData.exp || typeof tokenData.exp !== "number") {
      return false;
    }

    // Check if token is expired
    // exp is Unix timestamp in seconds, Date.now() is in milliseconds
    const now = Math.floor(Date.now() / 1000);
    if (tokenData.exp < now) {
      return false; // Token is expired
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
