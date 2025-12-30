// src/routes/dashboard.tsx
import { createFileRoute } from '@tanstack/react-router'
import { BalanceSummary } from './-components/balance-summary'
import { SpendingOverview } from './-components/spending-overview'
import { CategoryBreakdown } from './-components/category-breakdown'
import { AdditionalStats } from './-components/additional-stats'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your personal finances
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Today, 10:42 AM
        </div>
      </div>
      
      <BalanceSummary />
      
      <div className="space-y-6">
        <SpendingOverview />
        <AdditionalStats />
      </div>
      
      <CategoryBreakdown />
    </div>
  )
}