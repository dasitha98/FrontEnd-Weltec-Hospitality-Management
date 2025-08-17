import { makeStore } from "@/store";
import { studentsApi } from "@/store/api/students.api";
import StudentsClient from "./_client";

export default async function StudentsPage() {
  // 1. Make store on server
  const store = makeStore();

  // 2. Prefetch data
  await store.dispatch(studentsApi.endpoints.listStudents.initiate());
  // Wait for queries to finish
  await Promise.all(store.dispatch(studentsApi.util.getRunningQueriesThunk()));

  // 3. Grab state snapshot
  const preloadedState = store.getState();

  // 4. Pass to client
  return <StudentsClient initialState={preloadedState} />;
}



