"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { type Expense, type Category } from "@/models";
import { getCategoryByType } from "@/lib/server-actions";
import {
  SUPPORTED_CURRENCIES,
  convertToILS,
  formatAmountWithCurrency,
} from "@/lib/currency-converter";

// Emoji mappings for different expense types
const TYPE_EMOJIS: Record<string, string> = {
  // Food & Dining
  Coffee: "☕",
  Groceries: "🛒",
  Takeout: "🥡",
  Alcohol: "🍺",

  // Transportation
  "Public Transportation": "🚌",
  "Bike Maintenance": "🚲",

  // Housing & Utilities
  Rent: "🏠",
  Electricity: "⚡",
  Hydro: "💧",
  Internet: "🌐",
  "Home Tax": "🏡",

  // Personal Care & Lifestyle
  Hair: "💇",
  Clothing: "👕",
  Fitness: "💪",

  // Entertainment
  "Live Shows": "🎭",
  Hobbies: "🎨",

  // Work & Income
  Work: "💼",
};

interface ExpenseFormProps {
  categories: Category[];
  onSubmit: (expense: Omit<Expense, "Id">) => Promise<void>;
  onCancel: () => void;
}

export function ExpenseForm({
  categories,
  onSubmit,
  onCancel,
}: ExpenseFormProps) {
  const [formData, setFormData] = useState<{
    amount: string;
    description: string;
    type: string;
    currency: string;
    date: string;
  }>({
    amount: "",
    description: "",
    type: "",
    currency: "ILS", // Default to ILS
    date: new Date().toISOString().substring(0, 10),
  });

  const [isConverting, setIsConverting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.description || !formData.type) {
      return;
    }

    setIsConverting(true);

    try {
      const originalAmount = parseFloat(formData.amount);
      const category = await getCategoryByType(formData.type);

      // Convert currency if not ILS
      const conversionResult = await convertToILS(
        originalAmount,
        formData.currency
      );

      if (!conversionResult.success) {
        alert(
          `Currency conversion failed: ${conversionResult.error || "Unknown error"}`
        );
        setIsConverting(false);
        return;
      }

      const expenseData: Omit<Expense, "Id"> = {
        Total: conversionResult.convertedAmount, // Always in ILS
        Expense: formData.description,
        Type: formData.type,
        Category: category,
        Date: formData.date,
        originalAmount:
          formData.currency !== "ILS" ? originalAmount : undefined,
        originalCurrency:
          formData.currency !== "ILS" ? formData.currency : undefined,
        conversionRate:
          formData.currency !== "ILS" ? conversionResult.rate : undefined,
      };

      // Pass the expense data to the parent component (which will handle the mutation)
      await onSubmit(expenseData);

      // Reset form
      setFormData({
        amount: "",
        description: "",
        type: "",
        currency: "ILS",
        date: new Date().toISOString().substring(0, 10),
      });
    } catch (error) {
      console.error("Error submitting expense:", error);
      alert("Failed to submit expense. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">
            Amount (
            {formData.currency
              ? SUPPORTED_CURRENCIES.find((c) => c.code === formData.currency)
                  ?.symbol || formData.currency
              : "₪"}
            )
          </Label>
          <div className="flex gap-2">
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
              className="flex-1"
            />
            <Select
              value={formData.currency}
              onValueChange={(value) =>
                setFormData({ ...formData, currency: value })
              }
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <span className="flex items-center gap-1">
                      <span>{currency.symbol}</span>
                      <span className="text-xs text-muted-foreground">
                        {currency.code}
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {formData.currency !== "ILS" && (
            <p className="text-xs text-muted-foreground">
              Will be converted to ILS automatically
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="What did you spend on?"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select expense type" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((expenseType) => (
              <SelectItem key={expenseType.Type} value={expenseType.Type}>
                <span className="flex items-center gap-2">
                  <span>{TYPE_EMOJIS[expenseType.Type] || "📝"}</span>
                  <span>{expenseType.Type}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formData.type && (
          <p className="text-xs text-muted-foreground">
            Category:{" "}
            <span className="font-medium">
              {categories.find((c) => c.Type === formData.type)?.Category ||
                "unknown"}
            </span>
          </p>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1" disabled={isConverting}>
          {isConverting ? "Converting..." : "Add Expense"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isConverting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
