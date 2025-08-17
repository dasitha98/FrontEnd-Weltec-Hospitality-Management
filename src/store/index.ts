// src/store/index.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiBase } from "./api/baseApi";

// Import slices
import app from "./slices/app.slice";
import studentsUI from "./slices/students.ui.slice";
import classesUI from "./slices/classes.ui.slice";
import foodsUI from "./slices/foods.ui.slice";

// 1) Root reducer (all slices combined)
const rootReducer = combineReducers({
  app,
  studentsUI,
  classesUI,
  foodsUI,
  [apiBase.reducerPath]: apiBase.reducer,
});

// 2) RootState type
export type RootState = ReturnType<typeof rootReducer>;

// 3) Store factory (supports partial hydration)
export function makeStore(preloadedState?: Partial<RootState>) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (gDM) => gDM().concat(apiBase.middleware),
    devTools: process.env.NODE_ENV !== "production",
    preloadedState, // ✅ can be partial or full
  });

  // Enable RTK Query features like refetchOnFocus/refetchOnReconnect
  setupListeners(store.dispatch);

  return store;
}

// 4) Helper types
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
