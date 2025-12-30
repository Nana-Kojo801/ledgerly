import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, DollarSign, Calendar, Tag, FileText, X, TrendingUp, TrendingDown, Target } from "lucide-react";
import { mockCategories, getColorClass, formatCurrency } from "../-mock-data.ts";
import { EditCategoryDialog } from "./edit-category-dialog";
import { DeleteCategoryDialog } from "./delete-category-dialog";

interface CategoryDetailDialogProps {
  categoryId: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoryDetailDialog({ 
  categoryId, 
  isOpen, 
  onOpenChange 
}: CategoryDetailDialogProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (!categoryId) return null;

  const category = mockCategories.find(c => c.id === categoryId);
  if (!category) return null;

  const percentageUsed = Math.round((category.currentSpend / category.monthlyBudget) * 100);
  const remaining = category.monthlyBudget - category.currentSpend;
  const dailyAverage = category.currentSpend / 30;
  const isOverBudget = remaining < 0;

  const getBudgetStatus = () => {
    if (percentageUsed >= 100) return { text: "Over budget", icon: TrendingUp, color: "text-destructive" };
    if (percentageUsed >= 75) return { text: "Close to limit", icon: TrendingUp, color: "text-warning" };
    return { text: "On track", icon: TrendingDown, color: "text-positive" };
  };

  const budgetStatus = getBudgetStatus();

  const handleEditComplete = () => {
    setIsEditDialogOpen(false);
  };

  const handleDeleteComplete = () => {
    setIsDeleteDialogOpen(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[75vh] rounded-lg border-border/50 overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Category Details</span>
            </DialogTitle>
            <DialogDescription>
              View and manage category details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Header with color and name */}
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-lg ${getColorClass(category.color)} flex items-center justify-center`}>
                <DollarSign className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={isOverBudget ? "destructive" : "default"}>
                    {budgetStatus.text}
                  </Badge>
                  <Badge variant="outline">
                    {category.expenseCount} expenses
                  </Badge>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-lg bg-surface-1 p-4 border border-border/50">
              <div className="flex items-start gap-3">
                <div className="rounded-md bg-primary/10 p-2">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">Description</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {category.description}
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg bg-surface-1 p-4 border border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="rounded-md bg-primary/10 p-2">
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Monthly Budget</div>
                    <div className="text-lg font-bold">{formatCurrency(category.monthlyBudget)}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-surface-1 p-4 border border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="rounded-md bg-primary/10 p-2">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Current Spend</div>
                    <div className="text-lg font-bold">{formatCurrency(category.currentSpend)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Budget Utilization</span>
                <span className={budgetStatus.color}>{percentageUsed}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-surface-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${getColorClass(category.color)}`}
                  style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Spent: {formatCurrency(category.currentSpend)}</span>
                <span>Budget: {formatCurrency(category.monthlyBudget)}</span>
              </div>
            </div>

            {/* Remaining & Daily Average */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-surface-1 p-4 border border-border/50">
                <div className="text-sm font-medium text-muted-foreground">Remaining</div>
                <div className={`text-xl font-bold ${isOverBudget ? 'text-destructive' : 'text-positive'}`}>
                  {formatCurrency(remaining)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {isOverBudget ? 'Over budget' : 'Available'}
                </div>
              </div>

              <div className="rounded-lg bg-surface-1 p-4 border border-border/50">
                <div className="text-sm font-medium text-muted-foreground">Daily Average</div>
                <div className="text-xl font-bold">{formatCurrency(dailyAverage)}</div>
                <div className="text-xs text-muted-foreground">
                  Per day this month
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
      <EditCategoryDialog
        categoryId={categoryId}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteCategoryDialog
        categoryId={categoryId}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDeleteComplete={handleDeleteComplete}
      />
    </>
  );
}