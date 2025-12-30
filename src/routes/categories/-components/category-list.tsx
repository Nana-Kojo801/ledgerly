import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  ChevronRight,
  DollarSign,
  Target,
  Search
} from "lucide-react";
import { mockCategories, getColorClass } from "../-mock-data.ts";
import { EditCategoryDialog } from "./edit-category-dialog";
import { DeleteCategoryDialog } from "./delete-category-dialog";
import { useMediaQuery } from "@/hooks/use-media-query";

interface CategoryListProps {
  searchQuery: string;
  onCategoryClick: (categoryId: string) => void;
}

export function CategoryList({ searchQuery, onCategoryClick }: CategoryListProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const calculatePercentage = (current: number, budget: number) => {
    return Math.min(Math.round((current / budget) * 100), 100);
  };

  const getUtilizationBadge = (percentage: number) => {
    if (percentage >= 90) return { text: "Over", variant: "destructive" as const };
    if (percentage >= 75) return { text: "Close", variant: "warning" as const };
    return { text: "On track", variant: "default" as const };
  };

  const filteredCategories = mockCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditClick = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCategoryId(categoryId);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCategoryId(categoryId);
    setIsDeleteDialogOpen(true);
  };

  if (filteredCategories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg bg-surface-1 border border-border/50 p-8">
        <div className="h-16 w-16 rounded-full bg-surface-2 flex items-center justify-center mb-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No categories found</h3>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {searchQuery ? 'Try a different search term' : 'Create your first spending category'}
        </p>
        <Button className="rounded-lg">
          {searchQuery ? 'Clear Search' : 'Add Category'}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 w-full">
        {filteredCategories.map((category) => {
          const percentage = calculatePercentage(category.currentSpend, category.monthlyBudget);
          const utilizationBadge = getUtilizationBadge(percentage);
          const remaining = category.monthlyBudget - category.currentSpend;

          return (
            <div
              key={category.id}
              className="rounded-lg bg-surface-1 border border-border/50 hover:bg-surface-2 transition-colors cursor-pointer w-full overflow-hidden"
              onClick={() => onCategoryClick(category.id)}
            >
              {/* Mobile Layout */}
              {!isDesktop ? (
                <div className="space-y-3 p-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className={`h-10 w-10 rounded-lg ${getColorClass(category.color)} flex items-center justify-center shrink-0`}>
                        <DollarSign className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-sm">{category.name}</h3>
                          <Badge variant={utilizationBadge.variant} className="text-xs shrink-0">
                            {utilizationBadge.text}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-surface-3 p-2">
                      <div className="text-xs text-muted-foreground">Budget</div>
                      <div className="font-medium text-sm">{formatCurrency(category.monthlyBudget)}</div>
                    </div>
                    <div className="rounded-lg bg-surface-3 p-2">
                      <div className="text-xs text-muted-foreground">Spent</div>
                      <div className="font-medium text-sm">{formatCurrency(category.currentSpend)}</div>
                    </div>
                    <div className="rounded-lg bg-surface-3 p-2">
                      <div className="text-xs text-muted-foreground">Remaining</div>
                      <div className={`font-medium text-sm ${remaining < 0 ? 'text-destructive' : 'text-positive'}`}>
                        {formatCurrency(remaining)}
                      </div>
                    </div>
                    <div className="rounded-lg bg-surface-3 p-2">
                      <div className="text-xs text-muted-foreground">Expenses</div>
                      <div className="font-medium text-sm">{category.expenseCount}</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Utilization</span>
                      <span className="font-medium">{percentage}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-surface-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getColorClass(category.color)}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Desktop Layout - Simplified */
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Icon and Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`h-12 w-12 rounded-lg ${getColorClass(category.color)} flex items-center justify-center shrink-0`}>
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
                        <div className="font-semibold text-sm">{formatCurrency(category.monthlyBudget)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Spent</div>
                        <div className="font-semibold text-sm">{formatCurrency(category.currentSpend)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Left</div>
                        <div className={`font-semibold text-sm ${remaining < 0 ? 'text-destructive' : 'text-positive'}`}>
                          {formatCurrency(remaining)}
                        </div>
                      </div>
                    </div>

                    {/* Progress and Actions */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-24 space-y-1">
                        <div className="text-xs text-muted-foreground text-center">{percentage}%</div>
                        <div className="h-2 w-full rounded-full bg-surface-3 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getColorClass(category.color)}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg h-8 w-8 p-0"
                          onClick={(e) => handleEditClick(category.id, e)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCategoryClick(category.id);
                          }}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dialogs */}
      <EditCategoryDialog
        categoryId={selectedCategoryId}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
      
      <DeleteCategoryDialog
        categoryId={selectedCategoryId}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDeleteComplete={() => {
          setIsDeleteDialogOpen(false);
          setSelectedCategoryId(null);
        }}
      />
    </>
  );
}