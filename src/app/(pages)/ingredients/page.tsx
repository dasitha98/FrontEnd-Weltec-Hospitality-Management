import { makeStore } from "@/store";
import { supplierApi } from "@/store/api/supplier.api";
import IngredientClient from "./client";
import { ingredientApi } from "@/store/api/ingredient.api";

export default async function StudentsPage() {
  // 1. Make store on server
  const store = makeStore();

  // 2. Prefetch data
  await store.dispatch(ingredientApi.endpoints.listIngredient.initiate());
  // Wait for queries to finish
  await Promise.all(store.dispatch(ingredientApi.util.getRunningQueriesThunk()));

  // 3. Grab state snapshot
  const preloadedState = store.getState();

  // 4. Pass to client
  return <IngredientClient initialState={preloadedState} />;
}



