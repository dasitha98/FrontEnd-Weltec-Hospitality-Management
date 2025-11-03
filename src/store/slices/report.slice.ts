import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ReportUIState {
  search: string;
  selectedIds: string[];
  sortBy: "title" | "type" | "generatedAt";
  sortDir: "asc" | "desc";
  page: number;
  pageSize: number;
}

const initialState: ReportUIState = {
  search: "",
  selectedIds: [],
  sortBy: "title",
  sortDir: "asc",
  page: 1,
  pageSize: 20,
};

const reportUI = createSlice({
  name: "reportUI",
  initialState,
  reducers: {
    setSearch: (s, a: PayloadAction<string>) => {
      s.search = a.payload;
      s.page = 1;
    },
    toggleSelected: (s, a: PayloadAction<string>) => {
      const id = a.payload;
      s.selectedIds = s.selectedIds.includes(id)
        ? s.selectedIds.filter((x) => x !== id)
        : [...s.selectedIds, id];
    },
    clearSelection: (s) => {
      s.selectedIds = [];
    },
    setSort: (
      s,
      a: PayloadAction<{
        by: ReportUIState["sortBy"];
        dir: ReportUIState["sortDir"];
      }>
    ) => {
      s.sortBy = a.payload.by;
      s.sortDir = a.payload.dir;
      s.page = 1;
    },
    setPage: (s, a: PayloadAction<number>) => {
      s.page = a.payload;
    },
    setPageSize: (s, a: PayloadAction<number>) => {
      s.pageSize = a.payload;
      s.page = 1;
    },
  },
});

export const {
  setSearch,
  toggleSelected,
  clearSelection,
  setSort,
  setPage,
  setPageSize,
} = reportUI.actions;
export default reportUI.reducer;
