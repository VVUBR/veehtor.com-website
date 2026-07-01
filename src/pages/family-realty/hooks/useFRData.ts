import { useQuery } from "@tanstack/react-query";
import { frSupabase } from "../lib/frSupabase";

async function fetchTable(table: string, limit = 500) {
  const { data, error } = await frSupabase.from(table).select("*").limit(limit);
  if (error) throw error;
  return data ?? [];
}

export function useFRTable(table: string, limit = 500) {
  return useQuery({
    queryKey: ["fr", table, limit],
    queryFn: () => fetchTable(table, limit),
    retry: 1,
    staleTime: 60_000,
  });
}
