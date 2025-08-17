"use client";

import { useListFoodsQuery } from "@/store/api/foods.api";

export default function FoodsPage() {
  const { data, isLoading } = useListFoodsQuery();

  if (isLoading) return <p>Loading…</p>;
  return (
    <ul>
      {data?.map((f) => (
        <li key={f.id}>{f.name}</li>
      ))}
    </ul>
  );
}
