import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RecipesUIState {
  selectedCategory: string;
  selectedDifficulty: string;
  maxPrepTime?: number;
  maxCookTime?: number;
  minServings?: number;
  favorites: string[]; // ids of recipes marked as favorites
  searchTerm: string;
}

const initialState: RecipesUIState = {
  selectedCategory: "",
  selectedDifficulty: "",
  maxPrepTime: undefined,
  maxCookTime: undefined,
  minServings: undefined,
  favorites: [],
  searchTerm: "",
};

const recipesUI = createSlice({
  name: "recipesUI",
  initialState,
  reducers: {
    setSelectedCategory: (s, a: PayloadAction<string>) => {
      s.selectedCategory = a.payload;
    },
    setSelectedDifficulty: (s, a: PayloadAction<string>) => {
      s.selectedDifficulty = a.payload;
    },
    setMaxPrepTime: (s, a: PayloadAction<number | undefined>) => {
      s.maxPrepTime = a.payload;
    },
    setMaxCookTime: (s, a: PayloadAction<number | undefined>) => {
      s.maxCookTime = a.payload;
    },
    setMinServings: (s, a: PayloadAction<number | undefined>) => {
      s.minServings = a.payload;
    },
    setSearchTerm: (s, a: PayloadAction<string>) => {
      s.searchTerm = a.payload;
    },
    toggleFavorite: (s, a: PayloadAction<string>) => {
      const id = a.payload;
      if (s.favorites.includes(id)) {
        s.favorites = s.favorites.filter((favId) => favId !== id);
      } else {
        s.favorites.push(id);
      }
    },
    clearFilters: (s) => {
      s.selectedCategory = "";
      s.selectedDifficulty = "";
      s.maxPrepTime = undefined;
      s.maxCookTime = undefined;
      s.minServings = undefined;
      s.searchTerm = "";
    },
  },
});

export const {
  setSelectedCategory,
  setSelectedDifficulty,
  setMaxPrepTime,
  setMaxCookTime,
  setMinServings,
  setSearchTerm,
  toggleFavorite,
  clearFilters,
} = recipesUI.actions;

export default recipesUI.reducer;
