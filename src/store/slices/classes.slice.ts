import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ClassesUIState {
  activeTab: 'all' | 'my';
  createDialogOpen: boolean;
}

const initialState: ClassesUIState = { activeTab: 'all', createDialogOpen: false };

const classesUI = createSlice({
  name: 'classesUI',
  initialState,
  reducers: {
    setActiveTab: (s, a: PayloadAction<ClassesUIState['activeTab']>) => { s.activeTab = a.payload; },
    setCreateDialogOpen: (s, a: PayloadAction<boolean>) => { s.createDialogOpen = a.payload; },
  },
});

export const { setActiveTab, setCreateDialogOpen } = classesUI.actions;
export default classesUI.reducer;
