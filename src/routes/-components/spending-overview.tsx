// src/routes/dashboard/-components/spending-overview.tsx
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '@/lib/db'
import { getSpendingOverview } from '../-utils'

export function SpendingOverview() {
  const data = useLiveQuery(async () => {
    const categories = await db.categories.toArray()
    const expenses = await db.expenses.toArray()
    return getSpendingOverview(categories, expenses)
  })

  if (!data) return null // Or skeleton

  const {
    spent,
    budget,
    remaining,
    daysLeft,
    weeklyBreakdown,
    percentageUsed,
  } = data

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  // percentageUsed is already calculated in data

  const chartData = weeklyBreakdown.map((week) => ({
    name: week.week,
    actual: week.amount,
    projected: week.projected,
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg bg-surface-3 border border-border p-3">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-positive">
            Actual: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-sm text-muted-foreground">
            Projected: {formatCurrency(payload[1].value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Spending Overview</h2>
          <p className="text-sm text-muted-foreground">
            Current month vs. monthly budget
          </p>
        </div>
        <Button variant="ghost" size="sm" className="gap-1">
          View details
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Budget summary - Flat design */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="p-4 rounded-lg bg-surface-1 border border-border/50">
          <div className="text-sm font-medium text-muted-foreground">Spent</div>
          <div className="text-2xl font-bold">{formatCurrency(spent)}</div>
          <div className="text-xs text-muted-foreground">
            of {formatCurrency(budget)} budget
          </div>
        </div>
        <div className="p-4 rounded-lg bg-surface-1 border border-border/50">
          <div className="text-sm font-medium text-muted-foreground">
            Remaining
          </div>
          <div
            className={`text-2xl font-bold ${remaining < 0 ? 'text-negative' : 'text-positive'}`}
          >
            {formatCurrency(remaining)}
          </div>
          <div className="text-xs text-muted-foreground">
            {daysLeft} days left
          </div>
        </div>
        <div className="p-4 rounded-lg bg-surface-1 border border-border/50">
          <div className="text-sm font-medium text-muted-foreground">Usage</div>
          <div className="text-2xl font-bold">{percentageUsed}%</div>
          <div className="text-xs text-muted-foreground">
            {percentageUsed >= 90
              ? 'Nearly spent'
              : percentageUsed >= 75
                ? 'On track'
                : 'Under budget'}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2 p-4 rounded-lg bg-surface-1 border border-border/50">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Budget usage</span>
          <span>{percentageUsed}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-surface-2">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(percentageUsed, 100)}%`,
              backgroundColor:
                percentageUsed >= 90
                  ? 'oklch(0.7 0.2 25)'
                  : percentageUsed >= 75
                    ? 'oklch(0.75 0.15 85)'
                    : 'oklch(0.6 0.12 145)',
            }}
          />
        </div>
      </div>

      {/* Weekly chart */}
      <div className="space-y-3 p-4 rounded-lg bg-surface-1 border border-border/50">
        <div className="text-sm font-medium">Weekly Breakdown</div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
              />
              <XAxis
                dataKey="name"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={budget / 4}
                stroke="oklch(0.55 0.09 185)"
                strokeDasharray="3 3"
                label={{
                  value: 'Weekly Budget',
                  position: 'top',
                  fill: 'var(--color-muted-foreground)',
                  fontSize: 10,
                }}
              />
              <Bar
                dataKey="actual"
                fill="oklch(0.55 0.09 185)"
                radius={[2, 2, 0, 0]}
                name="Actual"
              />
              <Bar
                dataKey="projected"
                fill="oklch(0.55 0.09 185 / 0.3)"
                radius={[2, 2, 0, 0]}
                name="Projected"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
