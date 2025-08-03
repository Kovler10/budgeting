import { createClient } from "@/utils/supabase/client";
import type { Category, Expense } from "@/models";

const supabase = createClient();

/**
 * Categories (Types) Functions
 */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("CATEGORIES")
    .select("*")
    .order("Type", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }

  return data || [];
}

export async function getCategoryByType(
  type: string
): Promise<Category | null> {
  const { data, error } = await supabase
    .from("CATEGORIES")
    .select("*")
    .eq("Type", type)
    .single();

  if (error) {
    console.error("Error fetching category:", error);
    return null;
  }

  return data;
}

/**
 * Expenses Functions
 */
export async function getExpenses(): Promise<Expense[]> {
  const { data, error } = await supabase
    .from("DATA")
    .select("*")
    .order("Date", { ascending: false });

  if (error) {
    console.error("Error fetching expenses:", error);
    throw error;
  }

  return data || [];
}

export async function addExpense(
  expense: Omit<Expense, "Id">
): Promise<Expense> {
  const { data, error } = await supabase
    .from("DATA")
    .insert([expense])
    .select()
    .single();

  if (error) {
    console.error("Error adding expense:", error);
    throw error;
  }

  return data;
}

export async function updateExpense(
  id: string,
  updates: Partial<Omit<Expense, "Id">>
): Promise<Expense> {
  const { data, error } = await supabase
    .from("DATA")
    .update(updates)
    .eq("Id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating expense:", error);
    throw error;
  }

  return data;
}

export async function deleteExpense(id: string): Promise<void> {
  const { error } = await supabase.from("DATA").delete().eq("Id", id);

  if (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
}

/**
 * Helper function to get category by type ID
 */
export async function getCategoryByTypeId(typeId: string): Promise<string> {
  const category = await getCategoryByType(typeId);
  return category?.Category || "other";
}
