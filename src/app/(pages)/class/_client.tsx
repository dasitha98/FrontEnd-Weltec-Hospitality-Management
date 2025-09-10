"use client";

import { useListClassesQuery } from "@/store/api/classes.api";

export default function ClassesClient() {
  const { data, isLoading } = useListClassesQuery();

  if (isLoading) return <p>Loading…</p>;
  return (
    <ul>
      {data?.map((c) => (
        <li key={c.id}>{c.name}</li>
      ))}
    </ul>
  );
}
