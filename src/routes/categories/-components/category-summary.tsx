// src/routes/categories/-components/category-summary.tsx
import { TrendingUp, Target, PieChart, AlertCircle } from "lucide-react";
import { mockCategorySummary } from "../-mock-data.ts";

export function CategorySummary() {
  const { totalCategories, totalBudget, totalSpent, averageUtilization } = mockCategorySummary;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const cards = [
    {
      title: "Total Categories",
      value: totalCategories.toString(),
      icon: PieChart,
      description: "Active spending categories",
      color: "text-primary",
    },
    {
      title: "Monthly Budget",
      value: formatCurrency(totalBudget),
      icon: Target,
      description: "Total allocated budget",
      color: "text-positive",
    },
    {
      title: "Current Spend",
      value: formatCurrency(totalSpent),
      icon: TrendingUp,
      description: "Spent this month",
      color: "text-negative",
    },
    {
      title: "Budget Utilization",
      value: `${averageUtilization}%`,
      icon: AlertCircle,
      description: "Average category usage",
      color: averageUtilization > 80 ? "text-destructive" : "text-warning",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div 
          key={card.title}
          className="rounded-lg bg-surface-1 p-4 border border-border/50"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-muted-foreground">
              {card.title}
            </div>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </div>
          <div className="mt-2 text-2xl font-bold">{card.value}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {card.description}
          </p>
        </div>
      ))}
    </div>
  );
}