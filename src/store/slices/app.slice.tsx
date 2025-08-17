import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark';

interface AppState {
  sidebarOpen: boolean;
  theme: Theme;
}

const initialState: AppState = { sidebarOpen: true, theme: 'light' };

const app = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleSidebar: (s) => { s.sidebarOpen = !s.sidebarOpen; },
    setSidebar: (s, a: PayloadAction<boolean>) => { s.sidebarOpen = a.payload; },
    setTheme: (s, a: PayloadAction<Theme>) => { s.theme = a.payload; },
  },
});

export const { toggleSidebar, setSidebar, setTheme } = app.actions;
export default app.reducer;
