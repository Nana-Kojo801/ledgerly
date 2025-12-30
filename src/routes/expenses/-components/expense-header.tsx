// src/routes/expenses/-components/expense-header.tsx
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface ExpenseHeaderProps {
  onAddExpenseClick: () => void;
}

export function ExpenseHeader({ onAddExpenseClick }: ExpenseHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Expenses</h1>
        <p className="text-sm text-muted-foreground">
          Track and manage all your expenses
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onAddExpenseClick} className="rounded-lg">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>
    </div>
  );
}