// src/routes/expenses.tsx
import { createFileRoute } from '@tanstack/react-router'
import { ExpenseList } from './-components/expense-list'
import { ExpenseFilters } from './-components/expense-filters'
import { ExpenseHeader } from './-components/expense-header'
import { AddExpenseDialog } from './-components/add-expense-dialog'
import { ExpenseDetailDialog } from './-components/expense-detail-dialog'
import { useState } from 'react'

export const Route = createFileRoute('/expenses/')({
  component: ExpensesPage,
})

function ExpensesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDateRange, setSelectedDateRange] = useState('month')

  const handleExpenseClick = (expenseId: string) => {
    setSelectedExpenseId(expenseId)
    setIsDetailDialogOpen(true)
  }

  return (
    <div className="space-y-6 pb-6">
      <ExpenseHeader onAddExpenseClick={() => setIsAddDialogOpen(true)} />
      <ExpenseFilters 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedDateRange={selectedDateRange}
        onDateRangeChange={setSelectedDateRange}
      />
      <ExpenseList 
        selectedCategory={selectedCategory}
        selectedDateRange={selectedDateRange}
        onExpenseClick={handleExpenseClick}
      />
      
      {/* Dialogs */}
      <AddExpenseDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
      
      <ExpenseDetailDialog
        expenseId={selectedExpenseId}
        isOpen={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
      
      {/* Extra spacing for mobile bottom nav */}
      <div className="h-4 md:h-0" />
    </div>
  )
}