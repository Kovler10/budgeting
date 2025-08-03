"use client";

import { useMemo } from "react";
import { TrendingDown, TrendingUp, Wallet, Calendar } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ExpenseFormDialog } from "@/components/expense-form-dialog";
import { ExpenseList } from "@/components/expense-list";
import { CategoryChart } from "@/components/category-chart";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { formatCurrency } from "@/lib/currency";
import type { Expense } from "@/models";
import { useExpenses, useCreateExpense } from "@/hooks/use-expenses";
import { useCategories } from "@/hooks/use-categories";

export function ExpenseDashboard() {
  // Use TanStack Query hooks for data fetching
  const {
    data: expenses = [],
    isLoading: expensesLoading,
    error: expensesError,
  } = useExpenses();

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const createExpenseMutation = useCreateExpense();

  const isLoading = expensesLoading || categoriesLoading;

  // Helper function to determine if an expense is income
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

  // Calculate all financial metrics using useMemo for performance
  const calculations = useMemo(() => {
    const safeExpenses = expenses || [];

    const totalIncome = safeExpenses
      .filter(isIncome)
      .reduce((sum, expense) => sum + (expense.Total || 0), 0);

    const totalExpenses = safeExpenses
      .filter((expense) => !isIncome(expense))
      .reduce((sum, expense) => sum + (expense.Total || 0), 0);

    // Calculate this month's income and expenses
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const thisMonthTransactions = safeExpenses.filter((expense) => {
      const expenseDate = new Date(expense.Date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });

    const thisMonthIncome = thisMonthTransactions
      .filter(isIncome)
      .reduce((sum, expense) => sum + (expense.Total || 0), 0);

    const thisMonthExpenses = thisMonthTransactions
      .filter((expense) => !isIncome(expense))
      .reduce((sum, expense) => sum + (expense.Total || 0), 0);

    const dailyAverageExpenses =
      thisMonthExpenses / Math.max(new Date().getDate(), 1);

    // Calculate budget: base budget (if no income, use default) + this month's income - this month's expenses
    const baseBudget = thisMonthIncome > 0 ? 0 : 3000; // Use ₪3000 default only if no income
    const availableBudget = baseBudget + thisMonthIncome;
    const remainingBudget = availableBudget - thisMonthExpenses;

    return {
      totalIncome,
      totalExpenses,
      thisMonthIncome,
      thisMonthExpenses,
      dailyAverageExpenses,
      baseBudget,
      availableBudget,
      remainingBudget,
    };
  }, [expenses, categories]);

  // Extract calculations for easier use
  const {
    totalIncome,
    totalExpenses,
    thisMonthIncome,
    thisMonthExpenses,
    dailyAverageExpenses,
    baseBudget,
    availableBudget,
    remainingBudget,
  } = calculations;

  // Handle adding new expenses with TanStack Query mutation
  const addExpense = async (newExpense: Omit<Expense, "Id">) => {
    try {
      await createExpenseMutation.mutateAsync(newExpense);
    } catch (error) {
      console.error("Failed to create expense:", error);
      // You could add toast notifications here
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            💰 Budget Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your expenses in Israeli Shekels
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <ExpenseFormDialog categories={categories} onSubmit={addExpense} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              Expenses only (Income: {formatCurrency(totalIncome)})
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar
              className="h-4 w-4 text-muted-foreground"
              size={16}
              aria-hidden="true"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(thisMonthExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              Daily avg: {formatCurrency(dailyAverageExpenses)} • Income:{" "}
              {formatCurrency(thisMonthIncome)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Budget
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${remainingBudget >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {formatCurrency(remainingBudget)}
            </div>
            <p className="text-xs text-muted-foreground">
              Available: {formatCurrency(availableBudget)}
              {baseBudget > 0 && ` (₪${baseBudget} base + income)`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
            {remainingBudget >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${remainingBudget >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {remainingBudget >= 0 ? "On Track" : "Over Budget"}
            </div>
            <p className="text-xs text-muted-foreground">
              {availableBudget > 0
                ? `${Math.abs((thisMonthExpenses / availableBudget) * 100).toFixed(1)}% used`
                : "No budget set"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Expenses */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
              <CardDescription>Your latest transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseList
                expenses={expenses.slice(0, 10)}
                categories={categories}
              />
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Spending by category</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryChart expenses={expenses} categories={categories} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
