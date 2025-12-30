// src/routes/dashboard/-components/additional-stats.tsx
import { TrendingUp, TrendingDown, Target, AlertCircle, Calendar, BarChart3 } from "lucide-react";
import { mockDashboardData } from "../-mock-data.ts";

export function AdditionalStats() {
  const { additionalStats, weeklyPattern } = mockDashboardData;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const stats = [
    {
      title: "Avg Daily",
      value: formatCurrency(additionalStats.averageDailySpend),
      change: "+5.2%",
      trend: "up" as const,
      icon: Calendar,
      description: "From last week",
    },
    {
      title: "Top Day",
      value: additionalStats.topSpendingDay.slice(0, 3),
      fullValue: additionalStats.topSpendingDay,
      change: formatCurrency(additionalStats.topSpendingDayAmount),
      trend: "neutral" as const,
      icon: BarChart3,
      description: "Highest spend",
    },
    {
      title: "On Budget",
      value: `${additionalStats.budgetAdherence}%`,
      change: "+8.3%",
      trend: "up" as const,
      icon: Target,
      description: "Categories",
    },
    {
      title: "Overspent",
      value: additionalStats.overspentCategories.toString(),
      change: "-1",
      trend: "down" as const,
      icon: AlertCircle,
      description: "Categories",
    },
  ];

  // Find min and max for the weekly pattern
  const weeklyAmounts = weeklyPattern.map(day => day.amount);
  const maxAmount = Math.max(...weeklyAmounts);
  const minAmount = Math.min(...weeklyAmounts);
  const maxDay = weeklyPattern.find(day => day.amount === maxAmount)?.day;
  const minDay = weeklyPattern.find(day => day.amount === minAmount)?.day;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Additional Insights</h2>
        <p className="text-sm text-muted-foreground">
          Key metrics and spending patterns
        </p>
      </div>

      {/* Stats Grid - Flat design */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.title} className="space-y-2 p-3 rounded-lg bg-surface-1 border border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  {stat.title}
                </span>
              </div>
              <div className={`text-xs font-medium ${
                stat.trend === 'up' ? 'text-positive' : 
                stat.trend === 'down' ? 'text-negative' : 
                'text-muted-foreground'
              }`}>
                {stat.change}
              </div>
            </div>
            
            <div className="flex items-end justify-between">
              <div>
                <div className="text-xl font-bold">
                  {stat.title === "Top Day" ? (
                    <>
                      <span className="sm:hidden">{stat.value}</span>
                      <span className="hidden sm:inline">{stat.fullValue}</span>
                    </>
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Weekly pattern - Flat design */}
      <div className="space-y-3 p-4 rounded-lg bg-surface-1 border border-border/50">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-medium">Weekly Pattern</div>
            <div className="text-xs text-muted-foreground">Daily average spend</div>
          </div>
        </div>
        
        <div className="flex items-end justify-between gap-1 pt-4">
          {weeklyPattern.map((day) => {
            const heightPercentage = (day.amount / maxAmount) * 100;
            return (
              <div key={day.day} className="flex flex-1 flex-col items-center">
                <div
                  className="w-3/4 sm:w-11/12 rounded-t-sm bg-primary/20 transition-all duration-300 hover:bg-primary/30"
                  style={{ 
                    height: `${Math.max(heightPercentage, 10)}px`,
                    minHeight: '20px'
                  }}
                  title={`${day.day}: ${formatCurrency(day.amount)}`}
                />
                <div className="mt-2 text-xs text-muted-foreground">{day.day}</div>
                <div className="text-xs font-medium sm:hidden truncate w-full text-center">
                  ${day.amount.toFixed(0)}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex flex-col gap-1 pt-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span className="truncate">Low: {formatCurrency(minAmount)} ({minDay})</span>
          <span className="truncate">High: {formatCurrency(maxAmount)} ({maxDay})</span>
        </div>
      </div>
    </div>
  );
}