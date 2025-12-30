// src/routes/dashboard/-components/balance-summary.tsx
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp } from "lucide-react";

export function BalanceSummary() {
  const cards = [
    {
      title: "Current Balance",
      amount: "$4,287.50",
      change: "+2.5%",
      trend: "positive",
      icon: Wallet,
      description: "From last month",
    },
    {
      title: "Monthly Income",
      amount: "$3,850.00",
      change: "+5.2%",
      trend: "positive",
      icon: TrendingUp,
      description: "Salary & other income",
    },
    {
      title: "Total Expenses",
      amount: "$2,842.75",
      change: "-1.8%",
      trend: "negative",
      icon: ArrowDownRight,
      description: "This month so far",
    },
    {
      title: "Savings Rate",
      amount: "26.2%",
      change: "+3.1%",
      trend: "positive",
      icon: ArrowUpRight,
      description: "Of monthly income",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div 
          key={card.title} 
          className="rounded-lg bg-surface-1 p-4 border border-border/50"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-muted-foreground">
              {card.title}
            </div>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 text-2xl font-bold">{card.amount}</div>
          <div className="flex items-center pt-1 text-xs">
            <span
              className={
                card.trend === "positive"
                  ? "text-positive flex items-center"
                  : "text-negative flex items-center"
              }
            >
              {card.trend === "positive" ? (
                <ArrowUpRight className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDownRight className="mr-1 h-3 w-3" />
              )}
              {card.change}
            </span>
            <span className="text-muted-foreground ml-2">
              {card.description}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}