import { classesApi } from "@/store/api/classes.api";
import { makeStore } from "@/store";
import ClassesClient from "./_client";

export default async function ClassesPage() {
  // ❌ fetch on server
  const store = makeStore();
  await store.dispatch(classesApi.endpoints.listClasses.initiate());

  // ❌ not passing preloadedState → no hydration
  return <ClassesClient />;
}
