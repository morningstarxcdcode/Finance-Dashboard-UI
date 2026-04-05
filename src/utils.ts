import type { CategoryTotal, Insight, Overview, SortKey, Transaction } from './types';
import { categoryColors } from './data';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function formatCompactCurrency(value: number) {
  return compactCurrencyFormatter.format(value);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
}

export function getOverview(transactions: Transaction[], openingBalance = 126000): Overview {
  const totalIncome = transactions.filter((transaction) => transaction.type === 'income').reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalExpenses = transactions.filter((transaction) => transaction.type === 'expense').reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalBalance = openingBalance + totalIncome - totalExpenses;
  const savingsRate = totalIncome === 0 ? 0 : ((totalIncome - totalExpenses) / totalIncome) * 100;

  return {
    totalBalance,
    totalIncome,
    totalExpenses,
    savingsRate,
    incomeCount: transactions.filter((transaction) => transaction.type === 'income').length,
    expenseCount: transactions.filter((transaction) => transaction.type === 'expense').length,
  };
}

export function getCategoryTotals(transactions: Transaction[]): CategoryTotal[] {
  const categoryMap = new Map<string, number>();

  transactions
    .filter((transaction) => transaction.type === 'expense')
    .forEach((transaction) => {
      categoryMap.set(transaction.category, (categoryMap.get(transaction.category) ?? 0) + transaction.amount);
    });

  return Array.from(categoryMap.entries())
    .sort((left, right) => right[1] - left[1])
    .map(([category, amount]) => ({
      category,
      amount,
      color: categoryColors[category] ?? '#8b5cf6',
    }));
}

export function filterAndSortTransactions(transactions: Transaction[], search: string, categoryFilter: string, sortKey: SortKey) {
  const query = search.trim().toLowerCase();

  const filtered = transactions.filter((transaction) => {
    const matchesSearch =
      !query ||
      transaction.description.toLowerCase().includes(query) ||
      transaction.category.toLowerCase().includes(query) ||
      transaction.account.toLowerCase().includes(query);

    const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return filtered.sort((left, right) => {
    switch (sortKey) {
      case 'date-asc':
        return new Date(left.date).getTime() - new Date(right.date).getTime();
      case 'amount-desc':
        return right.amount - left.amount;
      case 'amount-asc':
        return left.amount - right.amount;
      case 'category-asc':
        return left.category.localeCompare(right.category);
      case 'date-desc':
      default:
        return new Date(right.date).getTime() - new Date(left.date).getTime();
    }
  });
}

export function getInsights(transactions: Transaction[]): Insight[] {
  const overview = getOverview(transactions);
  const categories = getCategoryTotals(transactions);
  const highestCategory = categories[0];
  const averageExpense = overview.expenseCount === 0 ? 0 : overview.totalExpenses / overview.expenseCount;
  const monthlyMomentum = overview.totalIncome - overview.totalExpenses;

  return [
    {
      title: 'Highest spending category',
      value: highestCategory ? highestCategory.category : 'No expenses yet',
      note: highestCategory ? `Spent ${formatCurrency(highestCategory.amount)} this period` : 'Add transactions to unlock category insights',
    },
    {
      title: 'Average expense',
      value: formatCurrency(averageExpense),
      note: 'Useful for spotting recurring costs that can be reduced',
    },
    {
      title: 'Cash flow momentum',
      value: `${monthlyMomentum >= 0 ? '+' : ''}${formatCurrency(monthlyMomentum)}`,
      note: monthlyMomentum >= 0 ? 'Income is covering spending comfortably' : 'Expenses are exceeding income and should be reviewed',
    },
  ];
}

export function createTransactionId() {
  return `txn-${Math.random().toString(36).slice(2, 9)}`;
}

export function getMonthSummary(transactions: Transaction[]) {
  const summary = new Map<string, { income: number; expenses: number }>();

  transactions.forEach((transaction) => {
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(`${transaction.date}T00:00:00`));
    const current = summary.get(month) ?? { income: 0, expenses: 0 };

    if (transaction.type === 'income') {
      current.income += transaction.amount;
    } else {
      current.expenses += transaction.amount;
    }

    summary.set(month, current);
  });

  return Array.from(summary.entries()).map(([month, value]) => ({ month, ...value }));
}