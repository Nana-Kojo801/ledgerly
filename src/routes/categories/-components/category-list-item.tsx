import { useMediaQuery } from '@/hooks/use-media-query'
import { calculatePercentage, getCategoryCurrentSpend, getUtilizationBadge } from '../-utils'
import { DesktopCategoryItem } from './desktop-category-item'
import { MobileCategoryItem } from './mobile-category-item'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '@/lib/db'

interface CategoryListItemProps {
  categoryId: string | null
  onCategoryClick: (categoryId: string) => void
  onEditClick: (categoryId: string) => void
  onDeleteClick?: (categoryId: string) => void
}

export function CategoryListItem({
  categoryId,
  onCategoryClick,
  onEditClick,
}: CategoryListItemProps) {
  const category = useLiveQuery(
    () =>
      !categoryId
        ? undefined
        : db.categories.get(categoryId),
    [categoryId],
  )
  const expenses = useLiveQuery(() => db.expenses.toArray())
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (category === undefined || !categoryId) return null

  const currentSpend = getCategoryCurrentSpend(expenses || [], categoryId)

  const percentage = calculatePercentage(
    currentSpend,
    category.monthlyBudget,
  )
  const utilizationBadge = getUtilizationBadge(percentage)
  const remaining = category.monthlyBudget - currentSpend

  return (
    <div
      className="rounded-lg bg-surface-1 border border-border/50 hover:bg-surface-2 transition-colors cursor-pointer w-full overflow-hidden"
      onClick={() => onCategoryClick(categoryId)}
    >
      {!isDesktop ? (
        <MobileCategoryItem
          categoryId={categoryId}
          percentage={percentage}
          utilizationBadge={utilizationBadge}
          remaining={remaining}
        />
      ) : (
        <DesktopCategoryItem
          categoryId={categoryId}
          percentage={percentage}
          utilizationBadge={utilizationBadge}
          remaining={remaining}
          onEditClick={onEditClick}
        />
      )}
    </div>
  )
}
