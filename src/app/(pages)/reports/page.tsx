import { makeStore } from "@/store";
import ReportClient from "./client";

export default async function ReportsPage() {
  // 1. Make store on server
  const store = makeStore();

  // 2. Grab state snapshot
  const preloadedState = store.getState();

  // 3. Pass to client
  return <ReportClient initialState={preloadedState} />;
}
