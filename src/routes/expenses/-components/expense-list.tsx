import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { ExpenseTable } from "./expense-table";
import { ExpenseCards } from "./expense-cards";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useLiveQuery } from "dexie-react-hooks";
import db from "@/lib/db.ts";

interface ExpenseListProps {
  selectedCategory: string;
  selectedDateRange: string;
  onExpenseClick: (expenseId: string) => void;
}

export function ExpenseList({ 
  selectedCategory, 
  selectedDateRange, 
  onExpenseClick 
}: ExpenseListProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const expenses = useLiveQuery(() => db.expenses.toArray())

  if(expenses === undefined) return null
  
  // Mock filtering logic (UI-only)
  const filteredExpenses = expenses.filter(expense => {
    if (selectedCategory !== 'all' && expense.categoryId !== selectedCategory) {
      return false;
    }
    
    // Mock date filtering based on selected range
    if (selectedDateRange === 'week') {
      const today = new Date()
      const expenseDate = new Date(expense.date)
      const minDate = new Date()
      minDate.setDate(today.getDate() - 7)
      return expenseDate >= minDate;
    } else if (selectedDateRange === 'month') {
      const today = new Date()
      const expenseDate = new Date(expense.date)
      const minDate = new Date()
      minDate.setMonth(today.getMonth() - 1)
      return expenseDate >= minDate;
    }
    
    return true;
  });

  if (filteredExpenses.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-border">
        <FileText className="h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No expenses found</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          {selectedCategory !== 'all' || selectedDateRange !== 'all' 
            ? 'Try changing your filters'
            : 'Start tracking your expenses by adding your first one.'}
        </p>
        <Button>
          {selectedCategory !== 'all' || selectedDateRange !== 'all' 
            ? 'Clear Filters'
            : 'Add Expense'}
        </Button>
      </div>
    );
  }

  return (
    <>
      {isDesktop ? (
        <ExpenseTable 
          expenses={filteredExpenses}
          onExpenseClick={onExpenseClick}
        />
      ) : (
        <ExpenseCards 
          expenses={filteredExpenses}
          onExpenseClick={onExpenseClick}
        />
      )}
    </>
  );
}