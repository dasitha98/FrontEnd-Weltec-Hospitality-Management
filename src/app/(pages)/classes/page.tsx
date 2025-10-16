import { makeStore } from "@/store";
import { classesApi } from "@/store/api/classes.api";
import ClassesClient from "./client";

export default async function StudentsPage() {
  // 1. Make store on server
  const store = makeStore();

  // 2. Prefetch data
  await store.dispatch(classesApi.endpoints.listClasses.initiate());
  // Wait for queries to finish
  await Promise.all(store.dispatch(classesApi.util.getRunningQueriesThunk()));

  // 3. Grab state snapshot
  const preloadedState = store.getState();

  // 4. Pass to client
  return <ClassesClient initialState={preloadedState} />;
}



