// src/routes/expenses/-mock-data.ts
export interface Expense {
  id: string;
  amount: number;
  category: string;
  categoryId: string;
  date: string;
  note: string;
  // No status field - manual tracker only
}

export interface CategoryFilter {
  id: string;
  name: string;
  count: number;
}

export const mockExpenses: Expense[] = [
  {
    id: '1',
    amount: 45.5,
    category: 'Food & Dining',
    categoryId: 'food',
    date: '2024-01-15',
    note: 'Weekly groceries at Whole Foods',
  },
  {
    id: '2',
    amount: 28.75,
    category: 'Coffee',
    categoryId: 'coffee',
    date: '2024-01-15',
    note: 'Starbucks with team',
  },
  {
    id: '3',
    amount: 120.0,
    category: 'Shopping',
    categoryId: 'shopping',
    date: '2024-01-14',
    note: 'New headphones',
  },
  {
    id: '4',
    amount: 65.0,
    category: 'Transport',
    categoryId: 'transport',
    date: '2024-01-14',
    note: 'Monthly transit pass',
  },
  {
    id: '5',
    amount: 89.99,
    category: 'Entertainment',
    categoryId: 'entertainment',
    date: '2024-01-13',
    note: 'Movie tickets for 4',
  },
  {
    id: '6',
    amount: 42.3,
    category: 'Food & Dining',
    categoryId: 'food',
    date: '2024-01-12',
    note: 'Dinner at Italian restaurant',
  },
  {
    id: '7',
    amount: 15.0,
    category: 'Coffee',
    categoryId: 'coffee',
    date: '2024-01-12',
    note: 'Morning coffee',
  },
  {
    id: '8',
    amount: 220.0,
    category: 'Utilities',
    categoryId: 'utilities',
    date: '2024-01-11',
    note: 'Electricity bill',
  },
  {
    id: '9',
    amount: 75.5,
    category: 'Shopping',
    categoryId: 'shopping',
    date: '2024-01-10',
    note: 'Office supplies',
  },
  {
    id: '10',
    amount: 35.25,
    category: 'Food & Dining',
    categoryId: 'food',
    date: '2024-01-09',
    note: 'Lunch meeting',
  },
];

export const mockCategories: CategoryFilter[] = [
  { id: 'all', name: 'All Categories', count: mockExpenses.length },
  { id: 'food', name: 'Food & Dining', count: mockExpenses.filter(e => e.categoryId === 'food').length },
  { id: 'coffee', name: 'Coffee', count: mockExpenses.filter(e => e.categoryId === 'coffee').length },
  { id: 'shopping', name: 'Shopping', count: mockExpenses.filter(e => e.categoryId === 'shopping').length },
  { id: 'entertainment', name: 'Entertainment', count: mockExpenses.filter(e => e.categoryId === 'entertainment').length },
  { id: 'transport', name: 'Transport', count: mockExpenses.filter(e => e.categoryId === 'transport').length },
  { id: 'utilities', name: 'Utilities', count: mockExpenses.filter(e => e.categoryId === 'utilities').length },
];

export const mockDateRanges = [
  { id: 'all', name: 'All Time' },
  { id: 'month', name: 'This Month' },
  { id: 'week', name: 'This Week' },
  { id: 'custom', name: 'Custom Range' },
];