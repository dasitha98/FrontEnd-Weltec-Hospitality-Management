import { apiBase } from "./baseApi";
import type { Ingredient, ID } from "@/types/domain";

export const ingredientApi = apiBase.injectEndpoints({
  endpoints: (b) => ({
    listIngredient: b.query<Ingredient[], void>({
      query: () => ({
        url: "/ingredients",
      }),
      // transformResponse: (response: Ingredient[]) => response.slice(0, 3), // 👈 only first 3
      providesTags: ["Ingredient"],
    }),
    // getSupplier: b.query<Ingredient, ID>({
    //   query: (id) => `/ingredients/${id}`,
    //   providesTags: (_r, _e, id) => [{ type: "Ingredient", id }],
    // }),
    createIngredient: b.mutation<Ingredient, Omit<Ingredient, "IngredientId">>({
      query: (body) => ({
        url: `/ingredients`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Ingredient"],
    }),
    updateIngredient: b.mutation<Ingredient, Partial<Ingredient> & { id: ID }>({
      query: ({ id, ...patch }) => ({
        url: `/ingredients/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Ingredient", id },
        "Ingredient",
      ],
    }),
    deleteIngredient: b.mutation<{ success: true }, ID>({
      // query: (id) => ({ url: `/supplier/${id}`, method: "DELETE" }),
      query: (id) => ({
        url: `/ingredients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Ingredient", id },
        "Ingredient",
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListIngredientQuery,
  // useGetIngredientQuery,
  useCreateIngredientMutation,
  useUpdateIngredientMutation,
  useDeleteIngredientMutation,
} = ingredientApi;
