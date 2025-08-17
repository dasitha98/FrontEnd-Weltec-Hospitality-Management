"use client";
import { Provider } from "react-redux";
import { useMemo } from "react";
import { makeStore, type RootState } from "./index";

export default function StoreProvider({
  children,
  initialState,
}: {
  children: React.ReactNode;
  //initialState?: RootState;
  initialState?: Partial<RootState>; // ✅ allow partial hydration
}) {
  const store = useMemo(() => makeStore(initialState), [initialState]);
  return <Provider store={store}>{children}</Provider>;
}
