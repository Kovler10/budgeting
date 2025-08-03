"use client";

import { Plus } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { ExpenseForm } from "@/components/expense-form";
import type { Expense, Category } from "@/models";
import { useState } from "react";

interface ExpenseFormDialogProps {
  categories: Category[];
  onSubmit: (expense: Omit<Expense, "Id">) => Promise<void>;
}

export function ExpenseFormDialog({
  categories,
  onSubmit,
}: ExpenseFormDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (expense: Omit<Expense, "Id">) => {
    try {
      await onSubmit(expense);
      setOpen(false); // Close dialog after successful submission
    } catch (error) {
      console.error("Failed to submit expense:", error);
      // Keep dialog open on error
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>
            Record a new expense transaction. All fields are required.
          </DialogDescription>
        </DialogHeader>
        <ExpenseForm
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
