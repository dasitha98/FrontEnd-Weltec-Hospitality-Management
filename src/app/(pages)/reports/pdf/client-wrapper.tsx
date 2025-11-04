"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { RootState } from "@/store";

// Dynamically import PDFClient with SSR disabled to prevent PDFViewer ref errors
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Double-check we're on client and wait a bit to ensure everything is ready
    if (typeof window !== "undefined") {
      // Use setTimeout to ensure we're fully on client side
      const timer = setTimeout(() => {
        setIsMounted(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  // Don't render PDFClient until component is mounted on client
  if (!isMounted || typeof window === "undefined") {
    return (
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
    );
  }

  return <PDFClient initialState={initialState} />;
}

