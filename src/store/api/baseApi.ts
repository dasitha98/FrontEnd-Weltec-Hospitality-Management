import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const apiBase = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      const token = Cookies.get("accessToken"); // read JWT from cookie
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  tagTypes: ["Students", "Classes", "Foods","Supplier","Recipe"],
=======
  tagTypes: ["Students", "Classes", "Foods","Supplier", "Ingredient"],
>>>>>>> Stashed changes
=======
  tagTypes: ["Students", "Classes", "Foods","Supplier", "Ingredient"],
>>>>>>> Stashed changes
=======
  tagTypes: ["Students", "Classes", "Foods","Supplier", "Ingredient"],
>>>>>>> Stashed changes
  endpoints: () => ({}),
});
