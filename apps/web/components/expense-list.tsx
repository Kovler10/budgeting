"use client";

import { formatCurrency } from "@/lib/currency";
import { type Expense, type Category, EXPENSE_CATEGORIES } from "@/models";
import { formatAmountWithCurrency } from "@/lib/currency-converter";

// Emoji mappings for different expense types (same as expense form)
const TYPE_EMOJIS: Record<string, string> = {
  // Food & Dining
  Coffee: "☕",
  Groceries: "🛒",
  Takeout: "🥡",
  Alcohol: "🍺",

  // Transportation
  "Public Transportation": "🚌",
  "Bike Maintenance": "🚲",

  // Housing & Utilities
  Rent: "🏠",
  Electricity: "⚡",
  Hydro: "💧",
  Internet: "🌐",
  "Home Tax": "🏡",

  // Personal Care & Lifestyle
  Hair: "💇",
  Clothing: "👕",
  Fitness: "💪",

  // Entertainment
  "Live Shows": "🎭",
  Hobbies: "🎨",

  // Work & Income
  Work: "💼",
};

interface ExpenseListProps {
  expenses: Expense[];
  categories?: Category[];
}

export function ExpenseList({ expenses, categories = [] }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p className="text-lg mb-2">No expenses yet</p>
        <p className="text-sm">Add your first expense to get started!</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    console.log(dateString);
    const date = new Date(dateString);
    console.log(date);
    return new Intl.DateTimeFormat("en-IL", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return formatDate(dateString);
  };

  return (
    <div className="space-y-3">
      {expenses.map((expense) => {
        const categoryInfo =
          EXPENSE_CATEGORIES[
            expense.Category.toLowerCase() as keyof typeof EXPENSE_CATEGORIES
          ] || EXPENSE_CATEGORIES.other;
        const typeInfo = categories.find((cat) => cat.Type === expense.Type);
        const displayIcon = TYPE_EMOJIS[expense.Type] || categoryInfo.icon;
        const displayTypeName = typeInfo?.Type || "Unknown Type";

        return (
          <div
            key={expense.Id}
            className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full ${categoryInfo.color} flex items-center justify-center text-white text-lg`}
              >
                {displayIcon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate">
                  {expense.Expense}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{displayTypeName}</span>
                  <span>•</span>
                  <span className="text-xs opacity-75">
                    {categoryInfo.label}
                  </span>
                  <span>•</span>
                  <span>{formatRelativeDate(expense.Date)}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`font-semibold ${expense.Category === "Income" ? "text-green-600" : "text-red-600"}`}
              >
                {formatCurrency(expense.Total)}
              </p>
              {expense.originalCurrency && expense.originalAmount && (
                <p className="text-xs text-muted-foreground">
                  Originally:{" "}
                  {formatAmountWithCurrency(
                    expense.originalAmount,
                    expense.originalCurrency
                  )}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
