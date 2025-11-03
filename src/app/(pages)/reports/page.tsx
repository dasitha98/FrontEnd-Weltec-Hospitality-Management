import { makeStore } from "@/store";
import { reportApi } from "@/store/api/Report.api";
import ReportClient from "./client";

export default async function ReportsPage() {
  // 1. Make store on server
  const store = makeStore();

  // 2. Prefetch data
  await store.dispatch(reportApi.endpoints.listReport.initiate());
  // Wait for queries to finish
  await Promise.all(store.dispatch(reportApi.util.getRunningQueriesThunk()));

  // 3. Grab state snapshot
  const preloadedState = store.getState();

  // 4. Pass to client
  return <ReportClient initialState={preloadedState} />;
}
