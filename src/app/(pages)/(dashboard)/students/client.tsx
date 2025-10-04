"use client";

import { useListStudentsQuery } from "@/store/api/students.api";
import StoreProvider from "@/store/providers";
import type { RootState } from "@/store";
import { useEffect } from "react";

export default function StudentsClient({ initialState }: { initialState: RootState }) {
  return (
    <StoreProvider initialState={initialState}>
      <StudentsList />
    </StoreProvider>
  );
}

function StudentsList() {
  const { data, isLoading } = useListStudentsQuery();
  if (isLoading) return <p>Loading…</p>;
  return (
    <ul>
      {data?.map((s) => (
        <li key={s.id}>{s.name} – {s.email}</li>
      ))}
    </ul>
  );
}
