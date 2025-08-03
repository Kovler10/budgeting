// DEPRECATED: Use models/index.ts instead
// Keeping for compatibility during migration

export interface DatabaseCategory {
  Type: string;
  Category: string;
  icon?: string;
}

export interface DatabaseExpense {
  Id: string;
  Date: string;
  Expense: string;
  Total: number;
  Type: string;
  Category: string;
  originalAmount?: number;
  originalCurrency?: string;
  conversionRate?: number;
}

// Database table definitions for TypeScript
export interface Database {
  public: {
    Tables: {
      CATEGORIES: {
        Row: DatabaseCategory;
        Insert: Omit<DatabaseCategory, "icon">;
        Update: Partial<DatabaseCategory>;
      };
      DATA: {
        Row: DatabaseExpense;
        Insert: Omit<DatabaseExpense, "Id">;
        Update: Partial<Omit<DatabaseExpense, "Id">>;
      };
    };
  };
}
