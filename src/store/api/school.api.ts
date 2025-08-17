// src/store/api/students.ts (or schoolApi.ts)
import { apiBase } from "./base";
import type { Student, ID } from "@/types/domain";

export const schoolApi = apiBase.injectEndpoints({
  endpoints: (b) => ({
    listStudents: b.query<Student[], void>({
      query: () => "/students",
      providesTags: ["Students"],
    }),
    listClasses: b.query<{ id: string; name: string }[], void>({
      query: () => "/classes",
      providesTags: ["Classes"],
    }),
    listFoods: b.query<{ id: string; name: string }[], void>({
      query: () => "/foods",
      providesTags: ["Foods"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListStudentsQuery,
  useListClassesQuery,
  useListFoodsQuery,
} = schoolApi;
