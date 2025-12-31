export type Category = {
  id: string;
  name: string;
  description: string;
  monthlyBudget: number;
  color: string;
}

export type Expense = {
  id: string;
  amount: number;
  categoryId: string;
  date: string;
  note: string;
}