import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

// Custom base query with error handling for 401/403 responses
const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers) => {
    const token = Cookies.get("accessToken"); // read JWT from cookie
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

// Wrapper that handles auth errors
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQueryWithAuth(args, api, extraOptions);

  // If we get a 401 or 403, the token is invalid or expired
  if (result.error && (result.error.status === 401 || result.error.status === 403)) {
    // Clear the invalid token
    Cookies.remove("accessToken");

    // Redirect to login page
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const loginUrl = currentPath !== "/login" 
        ? `/login?redirect=${encodeURIComponent(currentPath)}`
        : "/login";
      window.location.href = loginUrl;
    }
  }

  return result;
};

export const apiBase = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Students",
    "Classes",
    "Foods",
    "Supplier",
    "Ingredient",
    "Recipe",
    "Auth",
    "Level",
    "Report",
  ],
  endpoints: () => ({}),
});
