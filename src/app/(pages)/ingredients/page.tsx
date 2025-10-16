import { makeStore } from "@/store";
import { supplierApi } from "@/store/api/supplier.api";
import SupplierClient from "./client";

export default async function StudentsPage() {
  // 1. Make store on server
  const store = makeStore();

  // 2. Prefetch data
  await store.dispatch(supplierApi.endpoints.listSupplier.initiate());
  // Wait for queries to finish
  await Promise.all(store.dispatch(supplierApi.util.getRunningQueriesThunk()));

  // 3. Grab state snapshot
  const preloadedState = store.getState();

  // 4. Pass to client
  return <SupplierClient initialState={preloadedState} />;
}



