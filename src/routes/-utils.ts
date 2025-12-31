import type { Category, Expense } from '@/types'
import { differenceInDays, endOfMonth, getWeekOfMonth } from 'date-fns'

export const getBalance = (categories: Category[], expenses: Expense[]) => {
  const totalBudget = categories.reduce(
    (prev, cat) => prev + cat.monthlyBudget,
    0,
  )
  const totalExpense = expenses.reduce((prev, exp) => prev + exp.amount, 0)
  const actualBalance = totalBudget - totalExpense
  return actualBalance
}

export const getBalanceSummary = (
  categories: Category[],
  expenses: Expense[],
) => {
  const lastMonthBalance = getBalance(
    categories,
    expenses.filter((exp) => {
      const lastMonth = new Date().getMonth() - 1
      return new Date(exp.date).getMonth() === lastMonth
    }),
  )

  const thisMonthBalance = getBalance(
    categories,
    expenses.filter((exp) => {
      const thisMonth = new Date().getMonth()
      return new Date(exp.date).getMonth() === thisMonth
    }),
  )

  const balanceChangePercentage =
    lastMonthBalance !== 0
      ? ((lastMonthBalance - thisMonthBalance) / lastMonthBalance) * 100
      : 0

  const lastMonthExpenses = expenses
    .filter((exp) => {
      const lastMonth = new Date().getMonth() - 1
      return new Date(exp.date).getMonth() === lastMonth
    })
    .reduce((prev, exp) => prev + exp.amount, 0)

  const thisMonthExpenses = expenses
    .filter((exp) => {
      const thisMonth = new Date().getMonth()
      return new Date(exp.date).getMonth() === thisMonth
    })
    .reduce((prev, exp) => prev + exp.amount, 0)

  const expenseChangePercentage =
    lastMonthExpenses !== 0
      ? ((lastMonthExpenses - thisMonthExpenses) / lastMonthExpenses) * 100
      : 0

  // Correct calculation: Savings Rate = (Income - Expenses) / Income. Here Income approx = Budget = Balance + Expenses?
  // User logic: Budget is sum of category budgets.
  // Balance = Budget - Expenses.
  // So Savings Rate = (Balance / Budget) * 100.

  const totalBudget = categories.reduce(
    (prev, cat) => prev + cat.monthlyBudget,
    0,
  )
  const currentSavingsRate =
    totalBudget > 0 ? (thisMonthBalance / totalBudget) * 100 : 0
  const lastMonthBudget = totalBudget // Assuming static budget for now
  const lastMonthSavingsRate =
    lastMonthBudget > 0 ? (lastMonthBalance / lastMonthBudget) * 100 : 0
  const savingsRateChange = currentSavingsRate - lastMonthSavingsRate

  return {
    currentBalance: thisMonthBalance,
    balanceChange: balanceChangePercentage,
    totalExpenses: thisMonthExpenses,
    expensesChange: expenseChangePercentage,
    savingsRate: currentSavingsRate,
    savingsRateChange: savingsRateChange,
  }
}

export const getSpendingOverview = (
  categories: Category[],
  expenses: Expense[],
) => {
  const now = new Date()
  const currentMonth = now.getMonth()

  const thisMonthExpensesRaw = expenses.filter(
    (exp) => new Date(exp.date).getMonth() === currentMonth,
  )
  const spent = thisMonthExpensesRaw.reduce((sum, exp) => sum + exp.amount, 0)

  const budget = categories.reduce((sum, cat) => sum + cat.monthlyBudget, 0)
  const remaining = budget - spent
  const daysLeft = differenceInDays(endOfMonth(now), now)
  const percentageUsed = budget > 0 ? Math.round((spent / budget) * 100) : 0

  // Weekly Breakdown
  const weeks = [1, 2, 3, 4, 5]
  const weeklyBreakdown = weeks.map((week) => {
    const expensesInWeek = thisMonthExpensesRaw.filter(
      (exp) => getWeekOfMonth(new Date(exp.date)) === week,
    )
    const amount = expensesInWeek.reduce((sum, exp) => sum + exp.amount, 0)
    // Simple projection: Budget / 4 (or 5)
    // Or linear projection based on days passed? Let's keep it simple: Budget / 4.
    const projected = budget / 4

    return {
      week: `Week ${week}`,
      amount,
      projected,
    }
  })

  return {
    spent,
    budget,
    remaining,
    daysLeft,
    percentageUsed,
    weeklyBreakdown,
  }
}

export const getCategoryBreakdown = (
  categories: Category[],
  expenses: Expense[],
) => {
  const currentMonth = new Date().getMonth()
  const thisMonthExpenses = expenses.filter(
    (exp) => new Date(exp.date).getMonth() === currentMonth,
  )
  const totalSpent = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  const breakdown = categories.map((cat) => {
    // Ensure types match for comparison. IDs are strings (UUIDs).
    const catExpenses = thisMonthExpenses.filter((exp) => {
      // Handle potential undefined IDs
      if (exp.categoryId === undefined || cat.id === undefined) return false
      return exp.categoryId === cat.id
    })
    const amount = catExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    const percentage =
      totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0

    return {
      ...cat,
      amount,
      percentage,
    }
  })

  // Return breakdown sorted by amount, but append extra properties to match expected UI types if needed.
  // The UI expects { ...Category, amount, percentage }.
  return breakdown.sort((a, b) => b.amount - a.amount)
}

export const getAdditionalStats = (
  categories: Category[],
  expenses: Expense[],
) => {
  const currentMonth = new Date().getMonth()
  const thisMonthExpenses = expenses.filter(
    (exp) => new Date(exp.date).getMonth() === currentMonth,
  )

  // Average Daily Spend
  const daysPassed = new Date().getDate()
  const totalSpent = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  const averageDailySpend = daysPassed > 0 ? totalSpent / daysPassed : 0

  // Top Spending Day
  const expensesByDate: Record<string, number> = {}
  thisMonthExpenses.forEach((exp) => {
    const date = new Date(exp.date).toDateString()
    expensesByDate[date] = (expensesByDate[date] || 0) + exp.amount
  })

  let topDay = 'N/A'
  let topAmount = 0
  Object.entries(expensesByDate).forEach(([date, amount]) => {
    if (amount > topAmount) {
      topAmount = amount
      topDay = new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
      })
    }
  })

  // Budget Adherence
  let overspentCount = 0
  let onBudgetCount = 0
  categories.forEach((cat) => {
    const catExpenses = thisMonthExpenses.filter(
      (exp) => exp.categoryId === cat.id,
    )
    const spent = catExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    if (spent > cat.monthlyBudget) {
      overspentCount++
    } else {
      onBudgetCount++
    }
  })

  const budgetAdherence =
    categories.length > 0
      ? Math.round((onBudgetCount / categories.length) * 100)
      : 100

  // Weekly Pattern (Avg by Day of Week)
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const expensesByDayOfWeek: { [key: number]: number[] } = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  }

  thisMonthExpenses.forEach((exp) => {
    const day = new Date(exp.date).getDay()
    expensesByDayOfWeek[day].push(exp.amount)
  })

  const weeklyPattern = daysOfWeek.map((dayName, index) => {
    const amounts = expensesByDayOfWeek[index]
    // Use average of occurrences
    const total = amounts.reduce((a, b) => a + b, 0)
    const average = amounts.length > 0 ? total / amounts.length : 0

    return {
      day: dayName.slice(0, 1), // S, M, T...
      amount: average,
    }
  })

  return {
    averageDailySpend,
    topSpendingDay: topDay,
    topSpendingDayAmount: topAmount,
    budgetAdherence,
    overspentCategories: overspentCount,
    weeklyPattern,
  }
}
