import { apiBase } from "./baseApi";
import type { Recipe, ID } from "@/types/domain";

export const recipesApi = apiBase.injectEndpoints({
  endpoints: (b) => ({
    listRecipes: b.query<Recipe[], void>({
      query: () => "/recipes",
      providesTags: ["Recipes"],
    }),
    getRecipe: b.query<Recipe, ID>({
      query: (id) => `/recipes/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Recipes", id }],
    }),
    createRecipe: b.mutation<Recipe, Omit<Recipe, "id">>({
      query: (body) => ({ url: "/recipes", method: "POST", body }),
      invalidatesTags: ["Recipes"],
    }),
    updateRecipe: b.mutation<Recipe, Partial<Recipe> & { id: ID }>({
      query: ({ id, ...patch }) => ({
        url: `/recipes/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Recipes", id }, "Recipes"],
    }),
    deleteRecipe: b.mutation<{ success: true }, ID>({
      query: (id) => ({ url: `/recipes/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [{ type: "Recipes", id }, "Recipes"],
    }),
  }),
});

export const {
  useListRecipesQuery,
  useGetRecipeQuery,
  useCreateRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
} = recipesApi;
