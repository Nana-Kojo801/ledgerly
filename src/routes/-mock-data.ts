// src/routes/dashboard/-mock-data.ts
export interface DashboardData {
  balance: {
    current: number;
    income: number;
    expenses: number;
    savingsRate: number;
  };
  spendingOverview: {
    spent: number;
    budget: number;
    remaining: number;
    daysLeft: number;
    weeklyBreakdown: Array<{
      week: string;
      amount: number;
      projected: number;
    }>;
  };
  categories: Array<{
    name: string;
    amount: number;
    percentage: number;
    color: string;
  }>;
  additionalStats: {
    averageDailySpend: number;
    topSpendingDay: string;
    topSpendingDayAmount: number;
    budgetAdherence: number;
    overspentCategories: number;
  };
  weeklyPattern: Array<{
    day: string;
    amount: number;
  }>;
}

export const mockDashboardData: DashboardData = {
  balance: {
    current: 4287.5,
    income: 3850,
    expenses: 2842.75,
    savingsRate: 26.2,
  },
  spendingOverview: {
    spent: 2842.75,
    budget: 3000,
    remaining: 157.25,
    daysLeft: 5,
    weeklyBreakdown: [
      { week: "Week 1", amount: 680, projected: 720 },
      { week: "Week 2", amount: 720, projected: 720 },
      { week: "Week 3", amount: 820, projected: 720 },
      { week: "Week 4", amount: 622.75, projected: 720 },
    ],
  },
  categories: [
    { name: "Food & Dining", amount: 680, percentage: 24, color: "chart-1" },
    { name: "Shopping", amount: 420, percentage: 15, color: "chart-2" },
    { name: "Entertainment", amount: 320, percentage: 11, color: "chart-3" },
    { name: "Transport", amount: 280, percentage: 10, color: "chart-4" },
    { name: "Utilities", amount: 240, percentage: 8, color: "chart-5" },
    { name: "Other", amount: 902.75, percentage: 32, color: "muted" },
  ],
  additionalStats: {
    averageDailySpend: 94.76,
    topSpendingDay: "Saturday",
    topSpendingDayAmount: 145.80,
    budgetAdherence: 76,
    overspentCategories: 2,
  },
  weeklyPattern: [
    { day: "Mon", amount: 65.30 },
    { day: "Tue", amount: 85.20 },
    { day: "Wed", amount: 70.50 },
    { day: "Thu", amount: 80.75 },
    { day: "Fri", amount: 75.25 },
    { day: "Sat", amount: 95.80 },
    { day: "Sun", amount: 60.40 },
  ],
};

// Helper function to get color values for Recharts
export const getColorValue = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    'chart-1': 'oklch(0.55 0.09 185)',      // Primary teal
    'chart-2': 'oklch(0.6 0.12 145)',       // Positive green
    'chart-3': 'oklch(0.65 0.11 220)',      // Blue
    'chart-4': 'oklch(0.7 0.15 85)',        // Amber
    'chart-5': 'oklch(0.65 0.12 320)',      // Purple
    'muted': 'oklch(0.55 0.02 260)',        // Muted gray
    'primary': 'oklch(0.55 0.09 185)',      // Primary (same as chart-1)
    'positive': 'oklch(0.6 0.12 145)',      // Positive
    'negative': 'oklch(0.7 0.12 30)',       // Negative
    'warning': 'oklch(0.75 0.15 85)',       // Warning
  };
  
  return colorMap[colorName] || colorMap.muted;
};

// Format currency helper
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Format percentage helper
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};