// src/routes/dashboard-components/category-breakdown-preview.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import type { JSX } from "react";

export function CategoryBreakdownPreview() {
  const categories = [
    { name: "Food & Dining", amount: 680, percentage: 24, color: "bg-chart-1" },
    { name: "Shopping", amount: 420, percentage: 15, color: "bg-chart-2" },
    { name: "Entertainment", amount: 320, percentage: 11, color: "bg-chart-3" },
    { name: "Transport", amount: 280, percentage: 10, color: "bg-chart-4" },
    { name: "Utilities", amount: 240, percentage: 8, color: "bg-chart-5" },
    { name: "Other", amount: 902.75, percentage: 32, color: "bg-muted" },
  ];

  const total = categories.reduce((sum, cat) => sum + cat.amount, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Category Breakdown</CardTitle>
          <p className="text-sm text-muted-foreground">
            Top spending categories
          </p>
        </div>
        <Button variant="ghost" size="sm" className="gap-1">
          All categories
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Donut chart visualization */}
          <div className="relative mx-auto h-40 w-40">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">${total.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total spent</div>
              </div>
            </div>
            <svg viewBox="0 0 100 100" className="h-40 w-40">
              {categories.reduce(
                (acc, category) => {
                  const percentage = category.percentage;
                  const strokeDasharray = `${percentage} ${100 - percentage}`;
                  const strokeDashoffset = -acc.offset;

                  const circle = (
                    <circle
                      key={category.name}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className={category.color}
                      transform="rotate(-90 50 50)"
                    />
                  );

                  acc.elements.push(circle);
                  acc.offset += percentage;
                  return acc;
                },
                { elements: [] as JSX.Element[], offset: 0 }
              ).elements}
            </svg>
          </div>

          {/* Category list */}
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${category.color}`}
                  />
                  <div>
                    <div className="text-sm font-medium">{category.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {category.percentage}%
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium">
                  ${category.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}