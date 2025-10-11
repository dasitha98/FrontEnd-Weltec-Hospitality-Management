import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RecipesUIState {
  search: string;
  selectedIds: string[];
  sortBy: 'name'  | 'class';
  sortDir: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

const initialState: RecipesUIState = {
  search: '',
  selectedIds: [],
  sortBy: 'name',
  sortDir: 'asc',
  page: 1,
  pageSize: 20,
};

const recipesUI = createSlice({
  name: 'recipesUI',
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
    setSort: (s, a: PayloadAction<{ by: RecipesUIState['sortBy']; dir: RecipesUIState['sortDir'] }>) => {
      s.sortBy = a.payload.by; s.sortDir = a.payload.dir; s.page = 1;
    },
    setPage: (s, a: PayloadAction<number>) => { s.page = a.payload; },
    setPageSize: (s, a: PayloadAction<number>) => { s.pageSize = a.payload; s.page = 1; },
  },
});

export const {
  setSearch, toggleSelected, clearSelection, setSort, setPage, setPageSize
} = recipesUI.actions;
export default recipesUI.reducer;
