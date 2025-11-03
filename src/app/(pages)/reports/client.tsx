"use client";

import {
  useDeleteReportMutation,
  useListReportQuery,
} from "@/store/api/Report.api";
import StoreProvider from "@/store/providers";
import type { RootState } from "@/store";
import { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFileAlt,
  FaCalendarAlt,
  FaUser,
  FaDownload,
} from "react-icons/fa";
import type { Report } from "@/types/domain";
import { pdfjs } from "react-pdf";

// Configure PDF.js worker (recommended method)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function ReportClient({
  initialState,
}: {
  initialState: RootState;
}) {
  return (
    <StoreProvider initialState={initialState}>
      <ReportList />
    </StoreProvider>
  );
}

function ReportList() {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [Document, setDocument] = useState<any>(null);
  const [Page, setPage] = useState<any>(null);

  // Dynamically import Document and Page to skip SSR in Next.js
  useEffect(() => {
    import("react-pdf").then((pdf) => {
      setDocument(() => pdf.Document);
      setPage(() => pdf.Page);
    });
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  if (!Document || !Page) {
    return <div>Loading PDF viewer...</div>;
  }

  return (
    <div>
      <Document file="somefile.pdf" onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
    </div>
  );
}
