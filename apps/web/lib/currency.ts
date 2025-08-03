/**
 * Currency utilities for Israeli Shekel (₪)
 */

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatCurrencyCompact = (amount: number): string => {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    notation: "compact",
  }).format(amount);
};

export const parseCurrency = (value: string): number => {
  // Remove currency symbols and parse
  const cleaned = value.replace(/[₪,\s]/g, "");
  return parseFloat(cleaned) || 0;
};
