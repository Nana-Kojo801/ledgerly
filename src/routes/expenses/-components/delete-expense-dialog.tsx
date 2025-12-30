// src/routes/expenses/-components/delete-expense-dialog.tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface DeleteExpenseDialogProps {
  expenseId: string;
  expenseName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteComplete: () => void;
}

export function DeleteExpenseDialog({ 
  expenseId, 
  expenseName,
  isOpen, 
  onOpenChange,
  onDeleteComplete 
}: DeleteExpenseDialogProps) {
  const handleDelete = () => {
    // Mock: Show success feedback
    console.log(`Expense deleted: ${expenseId}`);
    
    // Show visual feedback before closing
    setTimeout(() => {
      onDeleteComplete();
      onOpenChange(false);
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Expense
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the expense:
          </DialogDescription>
        </DialogHeader>
        
        <div className="rounded-lg bg-destructive/10 p-4">
          <div className="font-medium">{expenseName}</div>
          <div className="text-sm text-muted-foreground">
            This expense will be removed from all reports and cannot be recovered.
          </div>
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            type="button"
            variant="destructive"
            onClick={handleDelete}
          >
            Delete Expense
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}