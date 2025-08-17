import { apiBase } from "./baseApi";
import type { Class, ID } from "@/types/domain";

export const classesApi = apiBase.injectEndpoints({
  endpoints: (b) => ({
    listClasses: b.query<Class[], void>({
      query: () => "/classes",
      providesTags: ["Classes"],
    }),
    getClass: b.query<Class, ID>({
      query: (id) => `/classes/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Classes", id }],
    }),
    createClass: b.mutation<Class, Omit<Class, "id">>({
      query: (body) => ({ url: "/classes", method: "POST", body }),
      invalidatesTags: ["Classes"],
    }),
    updateClass: b.mutation<Class, Partial<Class> & { id: ID }>({
      query: ({ id, ...patch }) => ({
        url: `/classes/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Classes", id }, "Classes"],
    }),
    deleteClass: b.mutation<{ success: true }, ID>({
      query: (id) => ({ url: `/classes/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [{ type: "Classes", id }, "Classes"],
    }),
  }),
});

export const {
  useListClassesQuery,
  useGetClassQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
} = classesApi;
