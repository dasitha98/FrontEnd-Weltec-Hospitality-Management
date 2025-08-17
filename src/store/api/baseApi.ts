import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const apiBase = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  tagTypes: ["Students", "Classes", "Foods"],
  endpoints: () => ({}),
});
