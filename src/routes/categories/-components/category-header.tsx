// src/routes/categories/-components/category-header.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";

interface CategoryHeaderProps {
  onAddCategoryClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function CategoryHeader({ 
  onAddCategoryClick, 
  searchQuery, 
  onSearchChange 
}: CategoryHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
        <p className="text-sm text-muted-foreground">
          Manage your spending categories and budgets
        </p>
      </div>
      
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search categories..."
            className="w-full pl-9 sm:w-64 rounded-lg bg-surface-2 border-border/50"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <Button 
          onClick={onAddCategoryClick}
          className="rounded-lg"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>
    </div>
  );
}