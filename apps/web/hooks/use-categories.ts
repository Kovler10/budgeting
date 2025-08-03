import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/server-actions";

export const CATEGORIES_QUERY_KEY = ["categories"] as const;

export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 15, // 15 minutes (categories change less frequently)
  });
}
