"use client";

import { useEffect, useState, useLayoutEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { decodeJWT, isTokenExpired } from "@/utils/jwt";

/**
 * AuthGuard component that protects routes by checking token validity
 * Redirects to login if token is missing, expired, or invalid
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Always start with loading state to prevent content flash
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // Use useLayoutEffect to check auth synchronously before browser paint
  // This prevents content flash by checking before rendering
  useLayoutEffect(() => {
    // Skip auth check for login page
    if (pathname === "/login") {
      setIsAuthorized(true);
      return;
    }

    // Check auth synchronously - use immediate check
    const token = Cookies.get("accessToken");

    if (!token) {
      // No token, redirect to login immediately
      setIsAuthorized(false);
      const currentPath = pathname;
      const loginUrl =
        currentPath !== "/"
          ? `/login?redirect=${encodeURIComponent(currentPath)}`
          : "/login";
      router.replace(loginUrl);
      return;
    }

    // Validate token expiration - same logic as middleware
    try {
      // Check if token is expired
      if (isTokenExpired(token)) {
        // Token is expired, redirect to login
        setIsAuthorized(false);
        Cookies.remove("accessToken", { path: "/" });
        const currentPath = pathname;
        const loginUrl =
          currentPath !== "/"
            ? `/login?redirect=${encodeURIComponent(currentPath)}`
            : "/login";
        router.replace(loginUrl);
        return;
      }

      // Validate token format (ensure it's a valid JWT)
      const payload = decodeJWT(token);
      if (!payload || !payload.exp) {
        // Invalid token format, redirect to login
        setIsAuthorized(false);
        Cookies.remove("accessToken", { path: "/" });
        const currentPath = pathname;
        const loginUrl =
          currentPath !== "/"
            ? `/login?redirect=${encodeURIComponent(currentPath)}`
            : "/login";
        router.replace(loginUrl);
        return;
      }

      // Token is valid, allow rendering
      setIsAuthorized(true);
    } catch (error) {
      // Token validation failed, redirect to login
      console.error("Token validation error:", error);
      setIsAuthorized(false);
      Cookies.remove("accessToken", { path: "/" });
      const currentPath = pathname;
      const loginUrl =
        currentPath !== "/"
          ? `/login?redirect=${encodeURIComponent(currentPath)}`
          : "/login";
      router.replace(loginUrl);
    }
  }, [pathname, router]);

  // Don't render children if we're on login page (to avoid layout conflicts)
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Show loading spinner while checking authentication (only if we're still checking)
  if (isAuthorized === null) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="animate-spin h-12 w-12 text-blue-950"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Only render if authorized
  if (isAuthorized === true) {
    return <>{children}</>;
  }

  // Not authorized - redirecting (show loading while redirecting)
  return (
    <div className="w-full h-full flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <svg
          className="animate-spin h-12 w-12 text-blue-950"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="text-gray-600 text-sm">Redirecting...</p>
      </div>
    </div>
  );
}
