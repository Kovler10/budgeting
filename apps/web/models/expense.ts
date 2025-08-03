// Expense model (from DATA table) - based on actual database response
export interface Expense {
  Id: string; // Primary key
  Date: string; // ISO timestamp string
  Expense: string; // Description of the expense
  Total: number; // Amount in ILS (after conversion)
  Type: string; // References Category.Type
  Category: string; // Category name
  originalAmount?: number; // Original amount before conversion
  originalCurrency?: string; // Original currency before conversion
  conversionRate?: number; // Rate used for conversion
}
