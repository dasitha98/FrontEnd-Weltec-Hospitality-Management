import { apiBase } from "./baseApi";
import type { Supplier, ID } from "@/types/domain";

export const supplierApi = apiBase.injectEndpoints({
  endpoints: (b) => ({
    listSupplier: b.query<Supplier[], void>({
      query: () => ({
        url: "http://localhost:5001/api/suppliers",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiIsImV4cCI6MTc1OTU0MTE2MiwiaXNzIjoiV2VsdGVjSG9zcGl0YWxpdHlCYWNrZW5kIiwiYXVkIjoiV2VsdGVjSG9zcGl0YWxpdHlGcm9udGVuZCJ9.pzZ6HplCrxLDyDD3QQQ7k6eR3bH2FZvvJQGAimnRbME}`, // Replace with your token storage method
        },
      }),
      transformResponse: (response: Supplier[]) => response.slice(0, 3), // 👈 only first 3
      providesTags: ["Supplier"],
    }),
    // getSupplier: b.query<Supplier, ID>({
    //   query: (id) => `/suppliers/${id}`,
    //   providesTags: (_r, _e, id) => [{ type: "Supplier", id }],
    // }),
    // createSupplier: b.mutation<Supplier, Omit<Supplier, "id">>({
    //   query: (body) => ({ url: "/supplier", method: "POST", body }),
    //   invalidatesTags: ["Supplier"],
    // }),
    // updateSupplier: b.mutation<Supplier, Partial<Supplier> & { id: ID }>({
    //   query: ({ id, ...patch }) => ({
    //     url: `/supplier/${id}`,
    //     method: "PATCH",
    //     body: patch,
    //   }),
    //   invalidatesTags: (_r, _e, { id }) => [
    //     { type: "Supplier", id },
    //     "Supplier",
    //   ],
    // }),
    // deleteSupplier: b.mutation<{ success: true }, ID>({
    //   query: (id) => ({ url: `/supplier/${id}`, method: "DELETE" }),
    //   invalidatesTags: (_r, _e, id) => [{ type: "Supplier", id }, "Supplier"],
    // }),
  }),
  overrideExisting: false,
});

export const {
  useListSupplierQuery,
  // useGetSupplierQuery,
  // useCreateSupplierMutation,
  // useUpdateSupplierMutation,
  // useDeleteSupplierMutation,
} = supplierApi;
