import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Home } from "@/app/api/homes";

export type FavoriteState = {
  items: Home[];
};

const initialState: FavoriteState = {
  items: [],
};

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Home>) => {
      if (!state.items.find((h) => h.id === action.payload.id)) {
        state.items.push(action.payload);
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((h) => h.id !== action.payload);
    },
    clearFavorites: (state) => {
      state.items = [];
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites } =
  favoriteSlice.actions;

export default favoriteSlice.reducer;