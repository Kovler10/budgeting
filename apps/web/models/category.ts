// Category model (from CATEGORIES table)
export interface Category {
  Type: string; // The type name (e.g., "Work", "Rent", "Groceries")
  Category: string; // The category (e.g., "Income", "Housing", "Food")
  icon?: string; // Optional icon for UI
}
