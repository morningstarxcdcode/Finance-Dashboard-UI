import type { BalancePoint, Transaction } from './types';

export const navigationTabs = ['Dashboard', 'Finance', 'Accounts', 'HR'];

export const categoryColors: Record<string, string> = {
  Salary: '#8b5cf6',
  Investments: '#22c55e',
  Rent: '#f97316',
  Groceries: '#60a5fa',
  Utilities: '#a78bfa',
  Dining: '#f43f5e',
  Travel: '#14b8a6',
  Subscriptions: '#eab308',
  Health: '#ec4899',
  Savings: '#6366f1',
};

export const initialTransactions: Transaction[] = [
  { id: 'txn-1001', date: '2026-04-05', description: 'Monthly payroll deposit', category: 'Salary', type: 'income', amount: 8600, account: 'Checking', note: 'Primary salary payment' },
  { id: 'txn-1002', date: '2026-04-04', description: 'Apartment rent', category: 'Rent', type: 'expense', amount: 1850, account: 'Checking' },
  { id: 'txn-1003', date: '2026-04-04', description: 'Grocery market', category: 'Groceries', type: 'expense', amount: 214.32, account: 'Debit Card' },
  { id: 'txn-1004', date: '2026-04-03', description: 'Freelance design work', category: 'Investments', type: 'income', amount: 1450, account: 'Savings' },
  { id: 'txn-1005', date: '2026-04-02', description: 'Electricity and internet', category: 'Utilities', type: 'expense', amount: 162.8, account: 'Checking' },
  { id: 'txn-1006', date: '2026-04-01', description: 'Team dinner', category: 'Dining', type: 'expense', amount: 89.4, account: 'Credit Card' },
  { id: 'txn-1007', date: '2026-03-30', description: 'Travel refund', category: 'Travel', type: 'income', amount: 320, account: 'Checking' },
  { id: 'txn-1008', date: '2026-03-29', description: 'Cloud software subscription', category: 'Subscriptions', type: 'expense', amount: 54.99, account: 'Credit Card' },
  { id: 'txn-1009', date: '2026-03-28', description: 'Health checkup', category: 'Health', type: 'expense', amount: 120, account: 'Checking' },
  { id: 'txn-1010', date: '2026-03-27', description: 'Auto transfer to savings', category: 'Savings', type: 'expense', amount: 500, account: 'Checking' },
  { id: 'txn-1011', date: '2026-03-26', description: 'Stock dividend', category: 'Investments', type: 'income', amount: 240, account: 'Investments' },
  { id: 'txn-1012', date: '2026-03-24', description: 'Weekend groceries', category: 'Groceries', type: 'expense', amount: 138.57, account: 'Debit Card' },
];

export const balanceHistory: BalancePoint[] = [
  { label: 'Oct', balance: 118400 },
  { label: 'Nov', balance: 121500 },
  { label: 'Dec', balance: 125300 },
  { label: 'Jan', balance: 129800 },
  { label: 'Feb', balance: 132900 },
  { label: 'Mar', balance: 139200 },
  { label: 'Apr', balance: 143624 },
];

export const categoryOrder = ['Salary', 'Investments', 'Rent', 'Groceries', 'Utilities', 'Dining', 'Travel', 'Subscriptions', 'Health', 'Savings'];