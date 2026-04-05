export type Role = 'viewer' | 'admin';
export type ThemeMode = 'light' | 'dark';
export type TransactionType = 'income' | 'expense';

export type SortKey = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc' | 'category-asc';

export type Transaction = {
  id: string;
  date: string;
  description: string;
  category: string;
  type: TransactionType;
  amount: number;
  account: string;
  note?: string;
};

export type TransactionInput = Omit<Transaction, 'id'>;

export type BalancePoint = {
  label: string;
  balance: number;
};

export type CategoryTotal = {
  category: string;
  amount: number;
  color: string;
};

export type Overview = {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  incomeCount: number;
  expenseCount: number;
};

export type Insight = {
  title: string;
  value: string;
  note: string;
};