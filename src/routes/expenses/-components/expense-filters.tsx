// src/routes/expenses/-components/expense-filters.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, X } from "lucide-react";
import { mockCategories, mockDateRanges } from "../-mock-data.ts";
import { useState } from "react";

interface ExpenseFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedDateRange: string;
  onDateRangeChange: (range: string) => void;
}

export function ExpenseFilters({
  selectedCategory,
  onCategoryChange,
  selectedDateRange,
  onDateRangeChange,
}: ExpenseFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>(["This Month"]);

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter));
  };

  const handleCategoryChange = (categoryId: string) => {
    onCategoryChange(categoryId);
    const categoryName = mockCategories.find(c => c.id === categoryId)?.name;
    if (categoryId !== 'all' && categoryName) {
      setActiveFilters(prev => [...prev.filter(f => !mockCategories.some(c => c.name === f)), categoryName]);
    } else {
      setActiveFilters(prev => prev.filter(f => !mockCategories.some(c => c.name === f)));
    }
  };

  const handleDateRangeChange = (rangeId: string) => {
    onDateRangeChange(rangeId);
    const rangeName = mockDateRanges.find(r => r.id === rangeId)?.name;
    if (rangeName) {
      setActiveFilters(prev => [...prev.filter(f => !mockDateRanges.some(r => r.name === f)), rangeName]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge
              key={filter}
              variant="secondary"
              className="gap-1 pl-2 pr-1"
            >
              {filter}
              <Button
                variant="ghost"
                size="icon"
                className="h-3 w-3 p-0 hover:bg-transparent"
                onClick={() => {
                  removeFilter(filter);
                  // Also clear the corresponding selection
                  if (mockCategories.some(c => c.name === filter)) {
                    onCategoryChange('all');
                  }
                  if (mockDateRanges.some(r => r.name === filter)) {
                    onDateRangeChange('month');
                  }
                }}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove filter</span>
              </Button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={() => {
              setActiveFilters([]);
              onCategoryChange('all');
              onDateRangeChange('month');
            }}
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Filter controls - Stack vertically on all screens */}
      <div className="space-y-4">
        {/* Category filter section */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Category</div>
          <div className="flex flex-wrap items-center gap-2">
            {mockCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
                {category.id !== "all" && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-4 min-w-4 px-1 text-xs"
                  >
                    {category.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Date range filter section */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Date Range</div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap items-center gap-1">
              {mockDateRanges.map((range) => (
                <Button
                  key={range.id}
                  variant={selectedDateRange === range.id ? "default" : "outline"}
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => handleDateRangeChange(range.id)}
                >
                  {range.name}
                </Button>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 px-2"
              onClick={() => console.log('Calendar picker would open')}
            >
              <Calendar className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}