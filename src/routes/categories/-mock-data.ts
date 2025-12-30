export interface Category {
  id: string;
  name: string;
  description: string;
  monthlyBudget: number;
  currentSpend: number;
  color: string;
  expenseCount: number;
}

export const mockCategories: Category[] = [
  {
    id: 'food',
    name: 'Food & Dining',
    description: 'Groceries, restaurants, and coffee shops',
    monthlyBudget: 600,
    currentSpend: 485.25,
    color: 'chart-1',
    expenseCount: 24,
  },
  {
    id: 'transport',
    name: 'Transport',
    description: 'Public transit, ride-sharing, and fuel',
    monthlyBudget: 300,
    currentSpend: 215.5,
    color: 'chart-2',
    expenseCount: 12,
  },
  {
    id: 'shopping',
    name: 'Shopping',
    description: 'Clothing, electronics, and personal items',
    monthlyBudget: 400,
    currentSpend: 395.75,
    color: 'chart-3',
    expenseCount: 18,
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    description: 'Movies, concerts, and subscriptions',
    monthlyBudget: 200,
    currentSpend: 189.99,
    color: 'chart-4',
    expenseCount: 9,
  },
  {
    id: 'utilities',
    name: 'Utilities',
    description: 'Electricity, water, and internet bills',
    monthlyBudget: 350,
    currentSpend: 342.0,
    color: 'chart-5',
    expenseCount: 6,
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    description: 'Gym, pharmacy, and medical expenses',
    monthlyBudget: 150,
    currentSpend: 85.5,
    color: 'positive',
    expenseCount: 5,
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Courses, books, and learning materials',
    monthlyBudget: 100,
    currentSpend: 42.75,
    color: 'primary',
    expenseCount: 3,
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Miscellaneous and unexpected expenses',
    monthlyBudget: 300,
    currentSpend: 275.25,
    color: 'muted',
    expenseCount: 11,
  },
];

export const mockCategorySummary = {
  totalCategories: mockCategories.length,
  totalBudget: mockCategories.reduce((sum, cat) => sum + cat.monthlyBudget, 0),
  totalSpent: mockCategories.reduce((sum, cat) => sum + cat.currentSpend, 0),
  averageUtilization: Math.round(
    (mockCategories.reduce((sum, cat) => sum + (cat.currentSpend / cat.monthlyBudget), 0) / mockCategories.length) * 100
  ),
};

// Helper function to get CSS class for color
export const getColorClass = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    'chart-1': 'bg-chart-1',
    'chart-2': 'bg-chart-2',
    'chart-3': 'bg-chart-3',
    'chart-4': 'bg-chart-4',
    'chart-5': 'bg-chart-5',
    'positive': 'bg-positive',
    'primary': 'bg-primary',
    'muted': 'bg-muted',
  };
  
  return colorMap[colorName] || colorMap.muted;
};

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};