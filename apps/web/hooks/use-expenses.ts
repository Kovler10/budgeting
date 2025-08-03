import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchExpenses, createExpense } from "@/lib/server-actions";
import type { Expense } from "@/models";

export const EXPENSES_QUERY_KEY = ["expenses"] as const;

export function useExpenses() {
  return useQuery({
    queryKey: EXPENSES_QUERY_KEY,
    queryFn: fetchExpenses,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newExpense: Omit<Expense, "Id">) => createExpense(newExpense),
    onSuccess: (newExpense) => {
      // Optimistically update the cache
      queryClient.setQueryData<Expense[]>(EXPENSES_QUERY_KEY, (old) => {
        if (!old) return [newExpense];
        return [newExpense, ...old];
      });

      // Refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: EXPENSES_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Failed to create expense:", error);
      // You could add toast notifications here
    },
  });
}
