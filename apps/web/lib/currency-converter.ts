/**
 * Currency conversion utilities using GeoAPI
 */

const API_KEY = process.env.NEXT_PUBLIC_GEOAPI_KEY || "";
const BASE_URL = "https://api.getgeoapi.com/v2/currency/convert";

export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
}

// Popular currencies for the picker
export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  { code: "ILS", name: "Israeli Shekel", symbol: "₪" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "DKK", name: "Danish Krone", symbol: "kr" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
  { code: "ARS", name: "Argentine Peso", symbol: "$" },
  { code: "CLP", name: "Chilean Peso", symbol: "$" },
  { code: "COP", name: "Colombian Peso", symbol: "$" },
  { code: "PEN", name: "Peruvian Sol", symbol: "S/" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "EGP", name: "Egyptian Pound", symbol: "£" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "QAR", name: "Qatari Riyal", symbol: "﷼" },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك" },
  { code: "BHD", name: "Bahraini Dinar", symbol: ".د.ب" },
  { code: "OMR", name: "Omani Rial", symbol: "﷼" },
  { code: "JOD", name: "Jordanian Dinar", symbol: "د.ا" },
  { code: "LBP", name: "Lebanese Pound", symbol: "ل.ل" },
];

export interface ConversionResult {
  success: boolean;
  convertedAmount: number;
  rate: number;
  error?: string;
}

/**
 * Convert currency amount to ILS using GeoAPI
 */
export async function convertToILS(
  amount: number,
  fromCurrency: string
): Promise<ConversionResult> {
  // If already in ILS, no conversion needed
  if (fromCurrency === "ILS") {
    return {
      success: true,
      convertedAmount: amount,
      rate: 1,
    };
  }

  try {
    // Check if API key is available
    if (!API_KEY) {
      throw new Error(
        "GeoAPI key not found. Please set NEXT_PUBLIC_GEOAPI_KEY in your environment variables."
      );
    }

    const url = new URL(BASE_URL);
    url.searchParams.append("api_key", API_KEY);
    url.searchParams.append("from", fromCurrency);
    url.searchParams.append("to", "ILS");
    url.searchParams.append("amount", amount.toString());
    url.searchParams.append("format", "json");

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === "success") {
      return {
        success: true,
        convertedAmount: data.rates.ILS.rate_for_amount,
        rate: data.rates.ILS.rate,
      };
    } else {
      throw new Error(data.error || "Conversion failed");
    }
  } catch (error) {
    console.error("Currency conversion error:", error);
    return {
      success: false,
      convertedAmount: amount, // Fallback to original amount
      rate: 1,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get currency symbol by code
 */
export function getCurrencySymbol(currencyCode: string): string {
  const currency = SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode);
  return currency?.symbol || currencyCode;
}

/**
 * Format amount with currency symbol
 */
export function formatAmountWithCurrency(
  amount: number,
  currencyCode: string
): string {
  const symbol = getCurrencySymbol(currencyCode);

  // For ILS, use the existing formatter
  if (currencyCode === "ILS") {
    return new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: "ILS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  // For other currencies, use basic formatting
  return `${symbol}${amount.toFixed(2)}`;
}
