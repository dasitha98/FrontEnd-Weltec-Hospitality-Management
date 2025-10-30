import { apiBase } from "./baseApi";
import type { Auth, ID } from "@/types/domain";

export const authApi = apiBase.injectEndpoints({
  endpoints: (b) => ({
    listAuth: b.query<Auth[], void>({
      query: () => ({
        url: "/auth",
      }),
      providesTags: ["Auth"],
    }),
    createAuth: b.mutation<Auth, Omit<Auth, "UserId">>({
      query: (body) => ({
        url: `/auth`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    updateAuth: b.mutation<Auth, Partial<Auth> & { id: ID }>({
      query: ({ id, ...patch }) => ({
        url: `/auth/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Auth", id }, "Auth"],
    }),
    deleteAuth: b.mutation<{ success: true }, ID>({
      query: (id) => ({
        url: `/auth/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => [{ type: "Auth", id }, "Auth"],
    }),
    login: b.mutation<
      {
        accessToken: any;
        token: string;
        user: Auth;
        message: string;
      },
      { email: string; password: string }
    >({
      query: ({ email, password }) => ({
        url: `/auth/login`,
        method: "POST",
        // Backend expects Username/Password. Map from our form fields.
        body: { username: email, password: password },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useListAuthQuery,
  useCreateAuthMutation,
  useUpdateAuthMutation,
  useDeleteAuthMutation,
  useLoginMutation,
} = authApi;
