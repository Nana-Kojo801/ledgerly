import { DollarSign } from 'lucide-react'
import { formatCurrency, getCategoryCurrentSpend } from '../-utils'
import { Badge } from '@/components/ui/badge'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '@/lib/db'
import { getCategoryExpenseCount } from '@/routes/expenses/-utils'

interface MobileCategoryItemProps {
  categoryId: string
  percentage: number
  utilizationBadge: {
    text: string
    variant: 'destructive' | 'warning' | 'default'
  }
  remaining: number
}

export function MobileCategoryItem({
  categoryId,
  percentage,
  utilizationBadge,
  remaining,
}: MobileCategoryItemProps) {
  const expenses = useLiveQuery(() => db.expenses.toArray())
  const category = useLiveQuery(() => db.categories.get(categoryId))

  if (!category) return null

  return (
    <div className="space-y-3 p-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div
            className={`h-10 w-10 rounded-lg ${category.color} flex items-center justify-center shrink-0`}
          >
            <DollarSign className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-sm">{category.name}</h3>
              <Badge
                variant={utilizationBadge.variant}
                className="text-xs shrink-0"
              >
                {utilizationBadge.text}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-surface-3 p-2">
          <div className="text-xs text-muted-foreground">Budget</div>
          <div className="font-medium text-sm">
            {formatCurrency(category.monthlyBudget)}
          </div>
        </div>
        <div className="rounded-lg bg-surface-3 p-2">
          <div className="text-xs text-muted-foreground">Spent</div>
          <div className="font-medium text-sm">
            {formatCurrency(
              getCategoryCurrentSpend(expenses || [], categoryId),
            )}
          </div>
        </div>
        <div className="rounded-lg bg-surface-3 p-2">
          <div className="text-xs text-muted-foreground">Remaining</div>
          <div
            className={`font-medium text-sm ${remaining < 0 ? 'text-destructive' : 'text-positive'}`}
          >
            {formatCurrency(remaining)}
          </div>
        </div>
        <div className="rounded-lg bg-surface-3 p-2">
          <div className="text-xs text-muted-foreground">Expenses</div>
          <div className="font-medium text-sm">{getCategoryExpenseCount(expenses || [], categoryId)}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Utilization</span>
          <span className="font-medium">{percentage}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-surface-3 overflow-hidden">
          <div
            className={`h-full rounded-full ${category.color}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
