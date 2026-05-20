import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  activePage: string;
}

const initialState: UiState = {
  sidebarOpen: true,
  activePage: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setActivePage: (state, action: PayloadAction<string>) => {
      state.activePage = action.payload;
    },
  },
});

export const { setSidebarOpen, setActivePage } = uiSlice.actions;
export default uiSlice.reducer;
