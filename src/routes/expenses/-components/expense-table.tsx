// src/routes/expenses/-components/expense-table.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { format } from 'date-fns'
import { ChevronRight } from 'lucide-react'
import type { Expense } from '@/types'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '@/lib/db'

interface ExpenseTableProps {
  expenses: Expense[]
  onExpenseClick: (expenseId: string) => void
}

export function ExpenseTable({ expenses, onExpenseClick }: ExpenseTableProps) {
  const categories = useLiveQuery(() => db.categories.toArray())

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy')
  }

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <div className="space-y-4">
      {/* Table Container - Flat design */}
      <div className="rounded-lg border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-1 hover:bg-surface-1">
              <TableHead className="w-[100px] py-3 font-medium text-muted-foreground border-b border-border/50">
                Date
              </TableHead>
              <TableHead className="py-3 font-medium text-muted-foreground border-b border-border/50">
                Description
              </TableHead>
              <TableHead className="py-3 font-medium text-muted-foreground border-b border-border/50">
                Category
              </TableHead>
              <TableHead className="text-right py-3 font-medium text-muted-foreground border-b border-border/50">
                Amount
              </TableHead>
              <TableHead className="w-[40px] py-3 border-b border-border/50"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow
                key={expense.id}
                className="hover:bg-surface-1 transition-colors cursor-pointer border-b border-border/50 last:border-b-0"
                onClick={() => onExpenseClick(expense.id)}
              >
                <TableCell className="py-3 font-medium">
                  {formatDate(expense.date)}
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{expense.note}</span>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <Link
                    to="/categories"
                    className="inline-flex items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Badge
                      variant="outline"
                      className="font-normal hover:bg-accent bg-surface-2 border-border/50"
                    >
                      {categories === undefined
                        ? ''
                        : categories.find(
                            (category) => category.id === expense.categoryId,
                          )?.name}
                    </Badge>
                  </Link>
                </TableCell>
                <TableCell className="text-right py-3 font-mono font-medium">
                  {formatCurrency(expense.amount)}
                </TableCell>
                <TableCell className="py-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      onExpenseClick(expense.id)
                    }}
                  >
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">View</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary footer - Flat design */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-surface-1 border border-border/50">
        <div className="text-sm text-muted-foreground">
          Showing {expenses.length} expenses
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Total: </span>
            <span className="font-medium">{formatCurrency(totalAmount)}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            onClick={() => {
              console.log('Would export filtered expenses as CSV')
            }}
          >
            Export
          </Button>
        </div>
      </div>
    </div>
  )
}
