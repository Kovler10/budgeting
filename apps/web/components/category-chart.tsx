"use client";

import { useMemo } from "react";
import { formatCurrency } from "@/lib/currency";
import { type Expense, type Category, EXPENSE_CATEGORIES } from "@/models";

interface CategoryChartProps {
  expenses: Expense[];
  categories?: Category[];
}

export function CategoryChart({
  expenses,
  categories = [],
}: CategoryChartProps) {
  const categoryTotals = useMemo(() => {
    // Helper function to determine if an expense is income (same logic as dashboard)
    const isIncome = (expense: Expense) => {
      // If Category is explicitly set, use it
      if (expense.Category) {
        return expense.Category === "Income";
      }
      // Fallback: check if Type maps to Income category (only if categories are loaded)
      if (categories.length > 0) {
        const typeCategory = categories.find(
          (cat) => cat.Type === expense.Type
        )?.Category;
        return typeCategory === "Income";
      }
      // If categories not loaded yet, fallback to Type name
      return expense.Type === "Work";
    };

    // Filter out income - only show actual expenses
    const expenseTransactions = expenses.filter(
      (expense) => !isIncome(expense)
    );

    const totals = expenseTransactions.reduce(
      (acc, expense) => {
        acc[expense.Category] = (acc[expense.Category] || 0) + expense.Total;
        return acc;
      },
      {} as Record<string, number>
    );

    const totalAmount = Object.values(totals).reduce(
      (sum, amount) => sum + amount,
      0
    );

    return Object.entries(totals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
        ...(EXPENSE_CATEGORIES[
          category.toLowerCase() as keyof typeof EXPENSE_CATEGORIES
        ] || EXPENSE_CATEGORIES.other),
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses, categories]);

  if (categoryTotals.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p className="text-sm">No expense categories yet</p>
        <p className="text-xs mt-1">Add some expenses to see the breakdown</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {categoryTotals.map((category) => (
        <div key={category.category} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">{category.icon}</span>
              <span className="font-medium">{category.label}</span>
            </div>
            <div className="text-right">
              <div className="font-semibold">
                {formatCurrency(category.amount)}
              </div>
              <div className="text-xs text-muted-foreground">
                {category.percentage.toFixed(1)}%
              </div>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full ${category.color} transition-all duration-300`}
              style={{ width: `${category.percentage}%` }}
            />
          </div>
        </div>
      ))}

      {/* Summary */}
      <div className="pt-4 border-t">
        <div className="flex justify-between items-center text-sm font-medium">
          <span>Total Spending</span>
          <span className="text-red-600">
            {formatCurrency(
              categoryTotals.reduce((sum, cat) => sum + cat.amount, 0)
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
