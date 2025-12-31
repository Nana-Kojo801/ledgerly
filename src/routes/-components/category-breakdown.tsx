// src/routes/dashboard/-components/category-breakdown.tsx
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
  Cell,
} from 'recharts'
import { getColorValue, formatCurrency } from '../-mock-data.ts'
import { useState } from 'react'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '@/lib/db'
import { getCategoryBreakdown } from '../-utils'

export function CategoryBreakdown() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const categories = useLiveQuery(async () => {
    const cats = await db.categories.toArray()
    const exps = await db.expenses.toArray()
    return getCategoryBreakdown(cats, exps)
  })

  if (!categories) return null

  const totalSpent = categories.reduce((sum, cat) => sum + cat.amount, 0)

  // Sort by amount descending (already done in util, but mostly fine)
  const sortedCategories = categories // util sorts it

  // Show only top 5 by default, or all if showAll is true
  const displayCategories = showAll
    ? sortedCategories
    : sortedCategories.slice(0, 5)

  // Prepare data for vertical bar chart
  const barChartData = displayCategories.map((category) => ({
    name: isDesktop ? category.name : category.name.split(' ')[0],
    fullName: category.name,
    value: category.amount,
    percentage: category.percentage,
    color: getColorValue(category.color),
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="rounded-lg bg-surface-3 border border-border p-3">
          <div className="font-medium">{data.fullName}</div>
          <div className="text-sm text-muted-foreground">
            {formatCurrency(data.value)} ({data.percentage}%)
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Category Breakdown</h2>
          <p className="text-sm text-muted-foreground">
            Spending distribution across categories
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show less' : 'View all'}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Summary - Flat design */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="p-4 rounded-lg bg-surface-1 border border-border/50">
          <div className="text-sm font-medium text-muted-foreground">
            Total Spent
          </div>
          <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
        </div>
        <div className="p-4 rounded-lg bg-surface-1 border border-border/50">
          <div className="text-sm font-medium text-muted-foreground">
            Categories
          </div>
          <div className="text-2xl font-bold">{categories.length}</div>
        </div>
        <div className="p-4 rounded-lg bg-surface-1 border border-border/50">
          <div className="text-sm font-medium text-muted-foreground">
            Top Category
          </div>
          <div className="text-2xl font-bold">
            {sortedCategories[0]?.percentage}%
          </div>
        </div>
        <div className="p-4 rounded-lg bg-surface-1 border border-border/50">
          <div className="text-sm font-medium text-muted-foreground">
            Daily Avg
          </div>
          <div className="text-2xl font-bold">
            ${(totalSpent / 30).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Vertical Bar Chart - Flat design */}
      <div className="space-y-3 p-4 rounded-lg bg-surface-1 border border-border/50">
        <div className="text-sm font-medium">Spending Distribution</div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="var(--color-muted-foreground)"
                fontSize={isDesktop ? 12 : 10}
                angle={isDesktop ? 0 : -45}
                textAnchor={isDesktop ? 'middle' : 'end'}
                height={isDesktop ? 30 : 50}
              />
              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
                width={isDesktop ? 50 : 40}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                radius={[4, 4, 0, 0]}
                onMouseEnter={(data) => setHoveredCategory(data.name || '')}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {barChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    opacity={
                      hoveredCategory === null || hoveredCategory === entry.name
                        ? 1
                        : 0.6
                    }
                    className="transition-opacity duration-200"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category List - Flat design */}
      <div className="space-y-3 p-4 rounded-lg bg-surface-1 border border-border/50">
        <div className="text-sm font-medium">Categories</div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {sortedCategories.map((category) => (
            <div
              key={category.name}
              className="p-3 rounded-lg bg-surface-2 border border-border/50 text-center hover:bg-surface-3 transition-colors cursor-pointer min-w-0"
              onMouseEnter={() => setHoveredCategory(category.name)}
              onMouseLeave={() => setHoveredCategory(null)}
              onClick={() => console.log(`View ${category.name} details`)}
            >
              <div
                className="h-3 w-3 rounded-full mx-auto mb-2"
                style={{ backgroundColor: getColorValue(category.color) }}
              />
              <div
                className="text-sm font-medium truncate"
                title={category.name}
              >
                {isDesktop ? category.name : category.name.split(' ')[0]}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {formatCurrency(category.amount)}
              </div>
              <div className="text-xs text-positive mt-1 truncate">
                {category.percentage}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
