import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FoodsUIState {
  onlyVeg: boolean;
  maxCalories?: number;
  cart: string[]; // ids of foods selected by user
}

const initialState: FoodsUIState = { onlyVeg: false, maxCalories: undefined, cart: [] };

const foodsUI = createSlice({
  name: 'foodsUI',
  initialState,
  reducers: {
    setOnlyVeg: (s, a: PayloadAction<boolean>) => { s.onlyVeg = a.payload; },
    setMaxCalories: (s, a: PayloadAction<number | undefined>) => { s.maxCalories = a.payload; },
    addToCart: (s, a: PayloadAction<string>) => { if (!s.cart.includes(a.payload)) s.cart.push(a.payload); },
    removeFromCart: (s, a: PayloadAction<string>) => { s.cart = s.cart.filter(id => id !== a.payload); },
    clearCart: (s) => { s.cart = []; },
  },
});

export const { setOnlyVeg, setMaxCalories, addToCart, removeFromCart, clearCart } = foodsUI.actions;
export default foodsUI.reducer;
