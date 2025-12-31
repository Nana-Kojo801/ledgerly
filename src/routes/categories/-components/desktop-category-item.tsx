import { Badge } from '@/components/ui/badge'
import { DollarSign } from 'lucide-react'
import { formatCurrency, getCategoryCurrentSpend } from '../-utils'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '@/lib/db'

interface DesktopCategoryItemProps {
  categoryId: string
  percentage: number
  utilizationBadge: {
    text: string
    variant: 'destructive' | 'warning' | 'default'
  }
  remaining: number
  onEditClick: (categoryId: string) => void
}

export function DesktopCategoryItem({
  categoryId,
  percentage,
  utilizationBadge,
  remaining,
}: DesktopCategoryItemProps) {
  const category = useLiveQuery(
    () => db.categories.get(categoryId),
    [categoryId],
  )
  const expenses = useLiveQuery(() => db.expenses.toArray())

  if (!category) return null

  return (
    <div className="p-4">
      <div className="flex items-center gap-4">
        {/* Icon and Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={`h-12 w-12 rounded-lg ${category.color} flex items-center justify-center shrink-0`}
          >
            <DollarSign className="h-6 w-6 text-primary-foreground" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate">{category.name}</h3>
              <Badge variant={utilizationBadge.variant} className="shrink-0">
                {utilizationBadge.text}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {category.description}
            </p>
          </div>
        </div>

        {/* Stats - Compact */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Budget</div>
            <div className="font-semibold text-sm">
              {formatCurrency(category.monthlyBudget)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Spent</div>
            <div className="font-semibold text-sm">
              {formatCurrency(
                getCategoryCurrentSpend(expenses || [], categoryId),
              )}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Left</div>
            <div
              className={`font-semibold text-sm ${remaining < 0 ? 'text-destructive' : 'text-positive'}`}
            >
              {formatCurrency(remaining)}
            </div>
          </div>
        </div>

        {/* Progress and Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-24 space-y-1">
            <div className="text-xs text-muted-foreground text-center">
              {percentage}%
            </div>
            <div className="h-2 w-full rounded-full bg-surface-3 overflow-hidden">
              <div
                className={`h-full rounded-full ${category.color}`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
