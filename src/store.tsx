import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { initialTransactions } from './data';
import type { Role, SortKey, ThemeMode, Transaction, TransactionInput } from './types';
import { createTransactionId } from './utils';

type FinanceState = {
  transactions: Transaction[];
  role: Role;
  theme: ThemeMode;
  search: string;
  categoryFilter: string;
  sortKey: SortKey;
  editorOpen: boolean;
  editingId: string | null;
};

type FinanceAction =
  | { type: 'setRole'; role: Role }
  | { type: 'setTheme'; theme: ThemeMode }
  | { type: 'setSearch'; search: string }
  | { type: 'setCategoryFilter'; categoryFilter: string }
  | { type: 'setSortKey'; sortKey: SortKey }
  | { type: 'openEditor'; editingId: string | null }
  | { type: 'closeEditor' }
  | { type: 'saveTransaction'; transaction: TransactionInput; transactionId: string | null }
  | { type: 'deleteTransaction'; transactionId: string }
  | { type: 'resetFilters' };

type FinanceContextValue = {
  state: FinanceState;
  actions: {
    setRole: (role: Role) => void;
    setTheme: (theme: ThemeMode) => void;
    setSearch: (search: string) => void;
    setCategoryFilter: (categoryFilter: string) => void;
    setSortKey: (sortKey: SortKey) => void;
    openCreateEditor: () => void;
    openEditEditor: (transactionId: string) => void;
    closeEditor: () => void;
    saveTransaction: (transaction: TransactionInput, transactionId: string | null) => void;
    deleteTransaction: (transactionId: string) => void;
    resetFilters: () => void;
  };
};

const FinanceContext = createContext<FinanceContextValue | undefined>(undefined);

function getStoredValue<T>(key: string, fallback: T) {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);

  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function createInitialState(): FinanceState {
  return {
    transactions: initialTransactions,
    role: getStoredValue<Role>('finance-role', 'admin'),
    theme: getStoredValue<ThemeMode>('finance-theme', 'light'),
    search: '',
    categoryFilter: 'all',
    sortKey: 'date-desc',
    editorOpen: false,
    editingId: null,
  };
}

function reducer(state: FinanceState, action: FinanceAction): FinanceState {
  switch (action.type) {
    case 'setRole':
      return { ...state, role: action.role };
    case 'setTheme':
      return { ...state, theme: action.theme };
    case 'setSearch':
      return { ...state, search: action.search };
    case 'setCategoryFilter':
      return { ...state, categoryFilter: action.categoryFilter };
    case 'setSortKey':
      return { ...state, sortKey: action.sortKey };
    case 'openEditor':
      return { ...state, editorOpen: true, editingId: action.editingId };
    case 'closeEditor':
      return { ...state, editorOpen: false, editingId: null };
    case 'saveTransaction': {
      const nextTransaction: Transaction = {
        ...action.transaction,
        id: action.transactionId ?? createTransactionId(),
      };

      const existingIndex = state.transactions.findIndex((transaction) => transaction.id === nextTransaction.id);

      const transactions =
        existingIndex >= 0
          ? state.transactions.map((transaction) => (transaction.id === nextTransaction.id ? nextTransaction : transaction))
          : [nextTransaction, ...state.transactions];

      return {
        ...state,
        transactions,
        editorOpen: false,
        editingId: null,
      };
    }
    case 'deleteTransaction':
      return {
        ...state,
        transactions: state.transactions.filter((transaction) => transaction.id !== action.transactionId),
      };
    case 'resetFilters':
      return {
        ...state,
        search: '',
        categoryFilter: 'all',
        sortKey: 'date-desc',
      };
    default:
      return state;
  }
}

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  useEffect(() => {
    window.localStorage.setItem('finance-role', JSON.stringify(state.role));
    window.localStorage.setItem('finance-theme', JSON.stringify(state.theme));
    document.documentElement.dataset.theme = state.theme;
  }, [state.role, state.theme]);

  const value = useMemo<FinanceContextValue>(
    () => ({
      state,
      actions: {
        setRole: (role) => dispatch({ type: 'setRole', role }),
        setTheme: (theme) => dispatch({ type: 'setTheme', theme }),
        setSearch: (search) => dispatch({ type: 'setSearch', search }),
        setCategoryFilter: (categoryFilter) => dispatch({ type: 'setCategoryFilter', categoryFilter }),
        setSortKey: (sortKey) => dispatch({ type: 'setSortKey', sortKey }),
        openCreateEditor: () => dispatch({ type: 'openEditor', editingId: null }),
        openEditEditor: (transactionId) => dispatch({ type: 'openEditor', editingId: transactionId }),
        closeEditor: () => dispatch({ type: 'closeEditor' }),
        saveTransaction: (transaction, transactionId) => dispatch({ type: 'saveTransaction', transaction, transactionId }),
        deleteTransaction: (transactionId) => dispatch({ type: 'deleteTransaction', transactionId }),
        resetFilters: () => dispatch({ type: 'resetFilters' }),
      },
    }),
    [state],
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const context = useContext(FinanceContext);

  if (!context) {
    throw new Error('useFinance must be used inside FinanceProvider');
  }

  return context;
}