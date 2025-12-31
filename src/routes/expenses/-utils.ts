import type { Category, Expense } from "@/types";

export const getCategoryExpenseCount = (expenses: Expense[], categoryId: string) => {
    return expenses.filter(expense => expense.categoryId === categoryId).length
}

export const getExpenseCategory = (categories: Category[], categoryId: string) => categories?.find(cat => cat.id === categoryId)?.name || ''

export const dateRanges = [
  { id: 'all', name: 'All Time' },
  { id: 'month', name: 'This Month' },
  { id: 'week', name: 'This Week' }
];