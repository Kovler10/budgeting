// Use the new models instead
export type { Category as ExpenseType, Expense } from "@/models";
import type { Category } from "@/models";

export type ExpenseCategory =
  | "food"
  | "transport"
  | "housing"
  | "entertainment"
  | "healthcare"
  | "shopping"
  | "utilities"
  | "education"
  | "savings"
  | "income"
  | "other";

export const EXPENSE_CATEGORIES: Record<
  ExpenseCategory,
  { label: string; icon: string; color: string }
> = {
  food: { label: "Food & Dining", icon: "🍽️", color: "bg-orange-500" },
  transport: { label: "Transportation", icon: "🚗", color: "bg-blue-500" },
  housing: { label: "Housing", icon: "🏠", color: "bg-green-500" },
  entertainment: { label: "Entertainment", icon: "🎬", color: "bg-purple-500" },
  healthcare: { label: "Healthcare", icon: "⚕️", color: "bg-red-500" },
  shopping: { label: "Shopping", icon: "🛒", color: "bg-pink-500" },
  utilities: { label: "Utilities", icon: "⚡", color: "bg-yellow-500" },
  education: { label: "Education", icon: "📚", color: "bg-indigo-500" },
  savings: { label: "Savings", icon: "💰", color: "bg-emerald-500" },
  income: { label: "Income", icon: "💵", color: "bg-green-600" },
  other: { label: "Other", icon: "📋", color: "bg-gray-500" },
};

// Helper functions for database integration
export const getCategoryByType = async (
  typeId: string
): Promise<ExpenseCategory> => {
  // Import here to avoid circular dependencies
  const { getCategoryByTypeId } = await import("@/lib/database");
  const category = await getCategoryByTypeId(typeId);
  return category as ExpenseCategory;
};

export const getExpenseType = async (
  typeId: string
): Promise<Category | null> => {
  // Import here to avoid circular dependencies
  const { getCategoryByType } = await import("@/lib/database");
  return await getCategoryByType(typeId);
};
