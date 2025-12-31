// category-list-empty.tsx
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface CategoryListEmptyProps {
  searchQuery: string;
}

export function CategoryListEmpty({ searchQuery }: CategoryListEmptyProps) {
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