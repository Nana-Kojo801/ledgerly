import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AlertTriangle } from 'lucide-react'
import db from '@/lib/db'
import { useLiveQuery } from 'dexie-react-hooks'

interface DeleteCategoryDialogProps {
  categoryId: string | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onDeleteComplete: () => void
}

export function DeleteCategoryDialog({
  categoryId,
  isOpen,
  onOpenChange,
  onDeleteComplete,
}: DeleteCategoryDialogProps) {

  if(!categoryId) return null

  const category = useLiveQuery(() => db.categories.where('id').equals(categoryId).first())

  const handleDelete = async () => {
    if (!category) return
    await db.categories.delete(category.id)
    onDeleteComplete()
  }

  if (!category) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-lg border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Category
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. Deleting this category will:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg bg-surface-2 p-4 border border-border/50">
            <div className="font-medium">{category.name}</div>
            <div className="text-sm text-muted-foreground">
              {category.expenseCount} expenses will be moved to "Uncategorized"
            </div>
          </div>

          <div className="rounded-lg border border-border/50 p-4">
            <div className="text-sm font-medium">Warning</div>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>
                • All expenses in this category will be moved to "Uncategorized"
              </li>
              <li>• Monthly reports will reflect this change</li>
              <li>• Budget tracking for this category will stop</li>
              <li>• This action cannot be reversed</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-lg"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="flex-1 rounded-lg"
            onClick={handleDelete}
          >
            Delete Category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
