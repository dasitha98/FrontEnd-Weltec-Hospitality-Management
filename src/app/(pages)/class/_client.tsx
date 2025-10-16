"use client";

import { useListClassesQuery } from "@/store/api/classes.api";

export default function ClassesClient() {
  const { data, isLoading } = useListClassesQuery();

}
