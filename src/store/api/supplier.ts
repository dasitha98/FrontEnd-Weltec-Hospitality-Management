import { apiBase } from "./baseApi";
import type { Supplier, ID } from "@/types/domain";

export const supplierApi = apiBase.injectEndpoints({
  endpoints: (b) => ({
    listSupplier: b.query<Supplier[], void>({
      query: () => "http://localhost:5001/api/suppliers",
      transformResponse: (response: Supplier[]) => response.slice(0, 3), // 👈 only first 3
      providesTags: ["Suppliers"],
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
