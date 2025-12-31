import type { Category, Expense } from '@/types'

// utils/category-utils.ts
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export const calculatePercentage = (current: number, budget: number) => {
  return Math.min(Math.round((current / budget) * 100), 100)
}

export const getUtilizationBadge = (percentage: number) => {
  if (percentage >= 90) return { text: 'Over', variant: 'destructive' as const }
  if (percentage >= 75) return { text: 'Close', variant: 'warning' as const }
  return { text: 'On track', variant: 'default' as const }
}

export const getCategorySummary = (
  categories: Category[],
  expenses: Expense[],
) => {
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const totalBudget = categories.reduce(
    (sum, cat) => sum + cat.monthlyBudget,
    0,
  )
  return {
    totalCategories: categories.length,
    totalBudget,
    totalSpent,
    averageUtilization: Math.round((totalSpent / totalBudget) * 100),
  }
}

export const getCategoryCurrentSpend = (
  expenses: Expense[],
  categoryId: string,
) => {
  return expenses
    .filter((exp) => exp.categoryId === categoryId)
    .reduce((prev, exp) => prev + exp.amount, 0)
}
