import { apiBase } from "./baseApi";
import type { Level, ID } from "@/types/domain";

export const levelApi = apiBase.injectEndpoints({
  endpoints: (b) => ({
    listLevel: b.query<Level[], void>({
      query: () => ({
        url: "/levels",
      }),
      providesTags: ["Level"],
    }),
    createLevel: b.mutation<Level, Omit<Level, "LevelId">>({
      query: (body) => ({
        url: `/levels`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Level"],
    }),
  }),
  overrideExisting: false,
});

export const { useListLevelQuery, useCreateLevelMutation } = levelApi;
