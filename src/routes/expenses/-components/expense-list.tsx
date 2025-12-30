import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { mockExpenses } from "../-mock-data.ts";
import { ExpenseTable } from "./expense-table";
import { ExpenseCards } from "./expense-cards";
import { useMediaQuery } from "@/hooks/use-media-query";

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
  
  // Mock filtering logic (UI-only)
  const filteredExpenses = mockExpenses.filter(expense => {
    if (selectedCategory !== 'all' && expense.categoryId !== selectedCategory) {
      return false;
    }
    
    // Mock date filtering based on selected range
    if (selectedDateRange === 'week') {
      return expense.date >= '2024-01-08';
    } else if (selectedDateRange === 'month') {
      return expense.date >= '2024-01-01';
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