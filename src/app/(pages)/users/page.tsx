import { makeStore } from "@/store";
import { authApi } from "@/store/api/auth.api";
import UsersClient from "./client";

export default async function UsersPage() {
  // 1. Make store on server
  const store = makeStore();

  // 2. Prefetch data
  await store.dispatch(authApi.endpoints.listAuth.initiate());
  // Wait for queries to finish
  await Promise.all(store.dispatch(authApi.util.getRunningQueriesThunk()));

  // 3. Grab state snapshot
  const preloadedState = store.getState();

  // 4. Pass to client
  return <UsersClient initialState={preloadedState} />;
}
