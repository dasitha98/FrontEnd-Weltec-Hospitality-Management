import { apiBase } from "./baseApi";
import type { Student, ID } from "@/types/domain";

export const studentsApi = apiBase.injectEndpoints({
  endpoints: (b) => ({
    listStudents: b.query<Student[], void>({
      query: () => "https://jsonplaceholder.typicode.com/users",
      transformResponse: (response: Student[]) => response.slice(0, 3), // 👈 only first 3
      providesTags: ["Students"],
    }),
    getStudent: b.query<Student, ID>({
      query: (id) => `/students/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Students", id }],
    }),
    createStudent: b.mutation<Student, Omit<Student, "id">>({
      query: (body) => ({ url: "/students", method: "POST", body }),
      invalidatesTags: ["Students"],
    }),
    updateStudent: b.mutation<Student, Partial<Student> & { id: ID }>({
      query: ({ id, ...patch }) => ({
        url: `/students/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Students", id },
        "Students",
      ],
    }),
    deleteStudent: b.mutation<{ success: true }, ID>({
      query: (id) => ({ url: `/students/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [{ type: "Students", id }, "Students"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListStudentsQuery,
  useGetStudentQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentsApi;
