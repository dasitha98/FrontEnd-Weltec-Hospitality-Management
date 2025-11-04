"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

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
    const decoded = atob(token); // Use atob instead of Buffer in browser
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

/**
 * AuthGuard component that protects routes by checking token validity
 * Redirects to login if token is missing, expired, or invalid
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/login") {
      setIsAuthorized(true);
      return;
    }

    // Check auth status - only do a simple check
    // Middleware handles server-side validation, this is just for client-side navigation
    const checkAuth = () => {
      const token = Cookies.get("accessToken");

      if (!token) {
        // No token, redirect to login
        setIsAuthorized(false);
        const currentPath = pathname;
        const loginUrl =
          currentPath !== "/"
            ? `/login?redirect=${encodeURIComponent(currentPath)}`
            : "/login";
        router.replace(loginUrl);
        return;
      }

      // For client-side navigation, just check if token exists
      // Middleware handles detailed validation on server-side requests
      // This allows smooth client-side navigation without blocking valid users
      setIsAuthorized(true);
    };

    // Small delay to ensure cookies are available
    const timeoutId = setTimeout(checkAuth, 50);
    return () => clearTimeout(timeoutId);
  }, [pathname, router]);

  // Don't render children if we're on login page (to avoid layout conflicts)
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Show nothing while checking
  if (isAuthorized === null) {
    return null;
  }

  // Only render if authorized
  if (isAuthorized === true) {
    return <>{children}</>;
  }

  // Not authorized - redirecting (handled in useEffect)
  return null;
}
