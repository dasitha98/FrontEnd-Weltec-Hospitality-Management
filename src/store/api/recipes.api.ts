import { apiBase } from "./baseApi";
import type { Recipe, ID } from "@/types/domain";

export const recipeApi = apiBase.injectEndpoints({
  endpoints: (b) => ({
    listRecipe: b.query<Recipe[], void>({
      query: () => ({
        url: "/recipes",
      }),
      // transformResponse: (response: Supplier[]) => response.slice(0, 3), // 👈 only first 3
      providesTags: ["Recipe"],
    }),
    // getSupplier: b.query<Supplier, ID>({
    //   query: (id) => `/suppliers/${id}`,
    //   providesTags: (_r, _e, id) => [{ type: "Supplier", id }],
    // }),
    createRecipe: b.mutation<Recipe, Omit<Recipe, "RecipeId">>({
      query: (body) => ({
        url: `/recipes`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Recipe"],
    }),
    updateRecipe: b.mutation<Recipe, Partial<Recipe> & { id: ID }>({
      query: ({ id, ...patch }) => ({
        url: `/recipes/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Recipe", id }, "Recipe"],
    }),
    deleteRecipe: b.mutation<{ success: true }, ID>({
      // query: (id) => ({ url: `/supplier/${id}`, method: "DELETE" }),
      query: (id) => ({
        url: `/recipes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => [{ type: "Recipe", id }, "Recipe"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListRecipeQuery,
  // useGetSupplierQuery,
  useCreateRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
} = recipeApi;
