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
      <div className="space-y-3">
        {filteredCategories.map((category) => {
          const percentage = calculatePercentage(category.currentSpend, category.monthlyBudget);
          const utilizationBadge = getUtilizationBadge(percentage);
          const remaining = category.monthlyBudget - category.currentSpend;

          return (
            <div
              key={category.id}
              className="rounded-lg bg-surface-1 p-4 border border-border/50 hover:bg-surface-2 transition-colors cursor-pointer"
              onClick={() => onCategoryClick(category.id)}
            >
              {/* Mobile Layout */}
              {!isDesktop ? (
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`h-10 w-10 rounded-lg ${getColorClass(category.color)} flex items-center justify-center shrink-0`}>
                        <DollarSign className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{category.name}</h3>
                          <Badge variant={utilizationBadge.variant} className="text-xs shrink-0">
                            {utilizationBadge.text}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 truncate">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCategoryId(category.id);
                        console.log('Show actions menu');
                      }}
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-surface-3 p-3 min-w-0">
                      <div className="text-xs text-muted-foreground truncate">Budget</div>
                      <div className="font-medium truncate">{formatCurrency(category.monthlyBudget)}</div>
                    </div>
                    <div className="rounded-lg bg-surface-3 p-3 min-w-0">
                      <div className="text-xs text-muted-foreground truncate">Spent</div>
                      <div className="font-medium truncate">{formatCurrency(category.currentSpend)}</div>
                    </div>
                    <div className="rounded-lg bg-surface-3 p-3 min-w-0">
                      <div className="text-xs text-muted-foreground truncate">Remaining</div>
                      <div className={`font-medium truncate ${remaining < 0 ? 'text-destructive' : 'text-positive'}`}>
                        {formatCurrency(remaining)}
                      </div>
                    </div>
                    <div className="rounded-lg bg-surface-3 p-3 min-w-0">
                      <div className="text-xs text-muted-foreground truncate">Expenses</div>
                      <div className="font-medium truncate">{category.expenseCount}</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
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

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-lg min-w-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCategoryClick(category.id);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ) : (
                /* Desktop Layout - Fixed for no horizontal scroll */
                <div className="flex items-center gap-4 w-full">
                  {/* Left side: Category info */}
                  <div className="flex items-center gap-4 min-w-0 flex-[1.5]"> {/* Changed from flex-2 */}
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
                      
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Middle: Budget stats */}
                  <div className="flex items-center gap-4 min-w-0 flex-2 overflow-hidden"> {/* Changed from flex-3 and added overflow-hidden */}
                    <div className="text-center min-w-[80px] flex-1">
                      <div className="text-sm text-muted-foreground truncate">Budget</div>
                      <div className="font-semibold truncate">{formatCurrency(category.monthlyBudget)}</div>
                    </div>
                    <div className="text-center min-w-[80px] flex-1">
                      <div className="text-sm text-muted-foreground truncate">Spent</div>
                      <div className="font-semibold truncate">{formatCurrency(category.currentSpend)}</div>
                    </div>
                    <div className="text-center min-w-[80px] flex-1">
                      <div className="text-sm text-muted-foreground truncate">Remaining</div>
                      <div className={`font-semibold truncate ${remaining < 0 ? 'text-destructive' : 'text-positive'}`}>
                        {formatCurrency(remaining)}
                      </div>
                    </div>
                    <div className="text-center min-w-[80px] flex-1">
                      <div className="text-sm text-muted-foreground truncate">Expenses</div>
                      <div className="font-semibold truncate">{category.expenseCount}</div>
                    </div>
                  </div>

                  {/* Right side: Progress and actions */}
                  <div className="flex items-center gap-4 min-w-0 flex-1 shrink-0"> {/* Changed from flex-2 and added shrink-0 */}
                    {/* Progress */}
                    <div className="w-32 space-y-1 shrink-0">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground truncate">{percentage}%</span>
                        <span className="text-muted-foreground truncate">Utilized</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-surface-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getColorClass(category.color)}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg h-8 w-8 p-0 shrink-0"
                        onClick={(e) => handleEditClick(category.id, e)}
                      >
                        <Edit className="h-3 w-3" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCategoryClick(category.id);
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
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