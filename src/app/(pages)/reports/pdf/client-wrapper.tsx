"use client";

import dynamic from "next/dynamic";
import type { RootState } from "@/store";

// Dynamically import PDFClient with SSR disabled
const PDFClient = dynamic(() => import("./client"), {
  ssr: false,
  loading: () => (
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
  ),
});

export default function PDFClientWrapper({
  initialState,
}: {
  initialState: RootState;
}) {
  return <PDFClient initialState={initialState} />;
}

