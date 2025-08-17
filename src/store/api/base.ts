import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getBaseUrl = () => {
  if (typeof window === "undefined") {
    // Running on server (SSR)
    return "http://localhost:3000/api"; 
    // 🚨 In production, replace with your real domain, e.g. "https://myapp.com/api"
  }
  // Running on client (CSR)
  return "/api";
};

export const apiBase = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  tagTypes: ["Students", "Classes", "Foods"],
  endpoints: () => ({}),
});
