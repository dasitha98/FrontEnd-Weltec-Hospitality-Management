import { makeStore } from "@/store";
import { recipeApi } from "@/store/api/recipes.api";
import RecipeClient from "./client";

export default async function RecipesPage() {
  // 1. Make store on server
  const store = makeStore();

  // 2. Prefetch data
  await store.dispatch(recipeApi.endpoints.listRecipe.initiate());
  // Wait for queries to finish
  await Promise.all(store.dispatch(recipeApi.util.getRunningQueriesThunk()));

  // 3. Grab state snapshot
  const preloadedState = store.getState();

  // 4. Pass to client
  return <RecipeClient initialState={preloadedState} />;
}



