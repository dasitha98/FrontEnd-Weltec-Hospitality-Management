import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StudentsUIState {
  search: string;
  selectedIds: string[];
  sortBy: 'name' | 'email' | 'class';
  sortDir: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

const initialState: StudentsUIState = {
  search: '',
  selectedIds: [],
  sortBy: 'name',
  sortDir: 'asc',
  page: 1,
  pageSize: 20,
};

const studentsUI = createSlice({
  name: 'studentsUI',
  initialState,
  reducers: {
    setSearch: (s, a: PayloadAction<string>) => { s.search = a.payload; s.page = 1; },
    toggleSelected: (s, a: PayloadAction<string>) => {
      const id = a.payload;
      s.selectedIds = s.selectedIds.includes(id)
        ? s.selectedIds.filter(x => x !== id)
        : [...s.selectedIds, id];
    },
    clearSelection: (s) => { s.selectedIds = []; },
    setSort: (s, a: PayloadAction<{ by: StudentsUIState['sortBy']; dir: StudentsUIState['sortDir'] }>) => {
      s.sortBy = a.payload.by; s.sortDir = a.payload.dir; s.page = 1;
    },
    setPage: (s, a: PayloadAction<number>) => { s.page = a.payload; },
    setPageSize: (s, a: PayloadAction<number>) => { s.pageSize = a.payload; s.page = 1; },
  },
});

export const {
  setSearch, toggleSelected, clearSelection, setSort, setPage, setPageSize
} = studentsUI.actions;
export default studentsUI.reducer;
