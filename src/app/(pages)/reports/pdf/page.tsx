import { makeStore } from "@/store";
import { Suspense } from "react";
import PDFClientWrapper from "./client-wrapper";

export default async function PDFPage() {
  // 1. Make store on server
  const store = makeStore();

  // 2. Grab state snapshot
  const preloadedState = store.getState();

  // 3. Pass to client wrapper with Suspense for useSearchParams
  return (
    <Suspense
      fallback={
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>Loading PDF page...</div>
        </div>
      }
    >
      <PDFClientWrapper initialState={preloadedState} />
    </Suspense>
  );
}

