import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '@/lib/db'
import { getBalanceSummary } from '../-utils'

export function BalanceSummary() {
  const summary = useLiveQuery(async () => {
    const categories = await db.categories.toArray()
    const expenses = await db.expenses.toArray()
    return getBalanceSummary(categories, expenses)
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatPercent = (amount: number) => {
    return `${amount > 0 ? '+' : ''}${amount.toFixed(1)}%`
  }

  if (!summary) return null // Or a skeleton loader

  const cards = [
    {
      title: 'Current Balance',
      amount: formatCurrency(summary.currentBalance),
      change: formatPercent(summary.balanceChange),
      trend: summary.balanceChange >= 0 ? 'positive' : 'negative',
      icon: Wallet,
      description: 'From last month',
    },
    {
      title: 'Total Expenses',
      amount: formatCurrency(summary.totalExpenses),
      change: formatPercent(summary.expensesChange),
      trend: summary.expensesChange <= 0 ? 'positive' : 'negative', // Lower expenses is positive usually? The UI logic might differ.
      // Original code: change: "-1.8%", trend: "negative" (red).
      // Usually +Expenses is "bad" (negative trend color/meaning), -Expenses is "good".
      // Let's stick to: Increase in expense = negative trend?
      // Actually standard finance UI: Green/Up usually means "More money".
      // For expenses: "Change +10%" -> Red?
      // Let's assume trend "positive" means GREEN COLOR.
      // If expenses went DOWN, that is GOOD (Positive).
      // If expenses went UP, that is BAD (Negative).
      icon: ArrowDownRight,
      description: 'This month so far',
    },
    {
      title: 'Savings Rate',
      amount: `${summary.savingsRate.toFixed(1)}%`,
      change: formatPercent(summary.savingsRateChange),
      trend: summary.savingsRateChange >= 0 ? 'positive' : 'negative',
      icon: ArrowUpRight,
      description: 'Of monthly income',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-lg bg-surface-1 p-4 border border-border/50"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-muted-foreground">
              {card.title}
            </div>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 text-2xl font-bold">{card.amount}</div>
          <div className="flex items-center pt-1 text-xs">
            <span
              className={
                card.trend === 'positive'
                  ? 'text-positive flex items-center'
                  : 'text-negative flex items-center'
              }
            >
              {card.change.startsWith('+') ? (
                <ArrowUpRight className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDownRight className="mr-1 h-3 w-3" />
              )}
              {card.change}
            </span>
            <span className="text-muted-foreground ml-2">
              {card.description}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
