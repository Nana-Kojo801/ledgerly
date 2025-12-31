// src/routes/expenses/-components/expense-cards.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Tag, DollarSign } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import type { Expense } from "@/types";
import db from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";

interface ExpenseCardsProps {
  expenses: Expense[];
  onExpenseClick: (expenseId: string) => void;
}

export function ExpenseCards({ expenses, onExpenseClick }: ExpenseCardsProps) {

  const categories = useLiveQuery(() => db.categories.toArray())

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const getExpenseCategory = (categoryId: string) => categories?.find(cat => cat.id === categoryId)?.name || ''

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="cursor-pointer rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50"
          onClick={() => onExpenseClick(expense.id)}
        >
          {/* Top row: Amount and Category */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-lg font-bold">
                  {formatCurrency(expense.amount)}
                </span>
              </div>
              <div className="text-sm font-medium text-foreground">
                {expense.note}
              </div>
            </div>
            
            <Link
              to="/categories"
              onClick={(e) => e.stopPropagation()}
            >
              <Badge variant="secondary" className="font-normal">
                {getExpenseCategory(expense.categoryId)}
              </Badge>
            </Link>
          </div>

          {/* Bottom row: Date and additional info */}
          <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(expense.date)}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              <span className="text-xs">{getExpenseCategory(expense.categoryId)}</span>
            </div>
          </div>

          {/* Divider line */}
          <div className="mt-3 border-t border-border/50 pt-3">
            <div className="text-xs text-muted-foreground">
              Tap to view details
            </div>
          </div>
        </div>
      ))}

      {/* Summary footer */}
      <div className="sticky bottom-0 rounded-lg border border-border bg-card p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">
              {expenses.length} expenses
            </div>
            <div className="text-lg font-bold">
              {formatCurrency(totalAmount)}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="w-full"
              onClick={() => console.log('Would export filtered expenses as CSV')}
            >
              Export
            </Button>
            
            <div className="text-xs text-muted-foreground text-right">
              Swipe cards to dismiss
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}