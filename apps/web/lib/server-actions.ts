"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { randomUUID } from "crypto";
import type { Category, Expense } from "@/models";

/**
 * Server actions for database operations
 */

export async function fetchCategories(): Promise<Category[]> {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase
    .from("CATEGORIES")
    .select("*")
    .order("Type", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data || [];
}

export async function fetchExpenses(): Promise<Expense[]> {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase
    .from("DATA")
    .select("*")
    .order("Date", { ascending: false });

  if (error) {
    console.error("Error fetching expenses:", error);
    return [];
  }

  return data || [];
}

export async function createExpense(
  expense: Omit<Expense, "Id">
): Promise<Expense | null> {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  // Generate UUID for the expense
  const expenseWithId = {
    Id: randomUUID(),
    ...expense,
  };

  console.log(
    "📝 Creating expense with data:",
    JSON.stringify(expenseWithId, null, 2)
  );

  const { data, error } = await supabase
    .from("DATA")
    .insert([expenseWithId])
    .select()
    .single();

  if (error) {
    console.error("❌ Error creating expense:", error);
    console.error("📊 Error details:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    return null;
  }

  console.log("✅ Successfully created expense:", data);
  return data;
}

export async function getCategoryByType(type: string): Promise<string> {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase
    .from("CATEGORIES")
    .select("Category")
    .eq("Type", type)
    .single();

  if (error) {
    console.error("Error fetching category:", error);
    return "other";
  }

  return data?.Category || "other";
}
