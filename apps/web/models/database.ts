import type { Category } from "./category";
import type { Expense } from "./expense";

// Database table interfaces for Supabase
export interface Database {
  public: {
    Tables: {
      CATEGORIES: {
        Row: Category;
        Insert: Omit<Category, "icon">;
        Update: Partial<Category>;
      };
      DATA: {
        Row: Expense;
        Insert: Omit<Expense, "Id">;
        Update: Partial<Omit<Expense, "Id">>;
      };
    };
  };
}
