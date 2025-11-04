import { apiBase } from "./baseApi";
import type { Report, ID } from "@/types/domain";

export interface ListReportParams {
  ClassIds: string[];
}

export interface StorageData {
  "Dry Storage": IngredientData[];
  "Chill Storage": IngredientData[];
  "Frozen Storage": IngredientData[];
}

export interface IngredientData {
  IngredientName: string;
  Quantity: number;
  Unit: string;
  Cost: number;
  Store: string;
}

export const reportApi = apiBase.injectEndpoints({
  endpoints: (b) => ({
    listReport: b.query<StorageData, ListReportParams>({
      query: (params) => ({
        url: "/reports",
        method: "POST",
        body: params,
      }),
      providesTags: ["Report"],
    }),
    getReport: b.query<Report, ID>({
      query: (id) => `/reports/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Report", id }],
    }),
    createReport: b.mutation<Report, Omit<Report, "ReportId">>({
      query: (body) => ({
        url: `/reports`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Report"],
    }),
    updateReport: b.mutation<Report, Partial<Report> & { id: ID }>({
      query: ({ id, ...patch }) => ({
        url: `/reports/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Report", id }, "Report"],
    }),
    deleteReport: b.mutation<{ success: true }, ID>({
      query: (id) => ({
        url: `/reports/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => [{ type: "Report", id }, "Report"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListReportQuery,
  useGetReportQuery,
  useCreateReportMutation,
  useUpdateReportMutation,
  useDeleteReportMutation,
} = reportApi;
