// src/routes/expenses/-components/expense-detail-dialog.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Calendar, Tag, FileText } from 'lucide-react'
import { format } from 'date-fns'
import { EditExpenseDialog } from './edit-expense-dialog'
import { DeleteExpenseDialog } from './delete-expense-dialog'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '@/lib/db.ts'
import { getExpenseCategory } from '../-utils'

interface ExpenseDetailDialogProps {
  expenseId: string | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function ExpenseDetailDialog({
  expenseId,
  isOpen,
  onOpenChange,
}: ExpenseDetailDialogProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const expense = useLiveQuery(
    () => (!expenseId ? undefined : db.expenses.get(expenseId)),
    [expenseId],
  )
  const categories = useLiveQuery(() => db.categories.toArray())

  if (expense === undefined || !expenseId) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy')
  }

  const handleEditComplete = () => {
    setIsEditDialogOpen(false)
    // Reopen this dialog after edit
  }

  const handleDeleteComplete = () => {
    setIsDeleteDialogOpen(false)
    onOpenChange(false) // Close detail dialog after delete
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Expense Details</span>
            </DialogTitle>
            <DialogDescription>
              View and manage expense details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Amount - Highlighted */}
            <div className="rounded-lg bg-accent p-4 text-center">
              <div className="text-sm text-muted-foreground">Amount</div>
              <div className="text-3xl font-bold">
                {formatCurrency(expense.amount)}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Date</div>
                  <div className="font-medium">{formatDate(expense.date)}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2">
                  <Tag className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Category</div>
                  <Badge variant="secondary" className="mt-1">
                    {getExpenseCategory(categories || [], expense.categoryId)}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Notes</div>
                  <div className="font-medium">
                    {expense.note || 'No notes'}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <EditExpenseDialog
        expenseId={expenseId}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onEditComplete={handleEditComplete}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteExpenseDialog
        expenseId={expenseId}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDeleteComplete={handleDeleteComplete}
      />
    </>
  )
}
