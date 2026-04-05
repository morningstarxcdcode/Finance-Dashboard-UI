import { useEffect, useState } from 'react';
import type { Role, SortKey, Transaction, TransactionInput, TransactionType } from '../types';
import { formatCurrency, formatDate } from '../utils';

function slugify(value: string) {
  return `category-${value.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

type TransactionToolbarProps = {
  categories: string[];
  role: Role;
  search: string;
  categoryFilter: string;
  sortKey: SortKey;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: SortKey) => void;
  onAddTransaction: () => void;
  onResetFilters: () => void;
};

type TransactionsPanelProps = {
  transactions: Transaction[];
  role: Role;
  onEditTransaction: (transactionId: string) => void;
  onDeleteTransaction: (transactionId: string) => void;
  onResetFilters: () => void;
  search: string;
  categoryFilter: string;
  sortKey: SortKey;
};

type TransactionEditorModalProps = {
  open: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onSave: (transaction: TransactionInput, transactionId: string | null) => void;
};

function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M6 6l1 14h10l1-14" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

export function TransactionToolbar({
  categories,
  role,
  search,
  categoryFilter,
  sortKey,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onAddTransaction,
  onResetFilters,
}: TransactionToolbarProps) {
  return (
    <section className="glass-card section-card toolbar-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">Recent emails</h2>
          <p className="section-description">Search, filter, and sort your latest entries</p>
        </div>
        <div className="section-actions">
          {role === 'admin' ? (
            <button type="button" className="control-button" onClick={onAddTransaction}>
              <IconPlus />
              Add transaction
            </button>
          ) : null}
        </div>
      </div>

      {role === 'viewer' ? (
        <div className="viewer-banner">
          <div>
            <strong>Viewer mode</strong>
            <span className="helper-copy">Transaction data is available for review, but editing is disabled.</span>
          </div>
        </div>
      ) : null}

      <div className="toolbar-grid">
        <label htmlFor="search-transactions" className="field-stack toolbar-search">
          <span className="helper-copy">Search</span>
          <input
            id="search-transactions"
            className="field"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by description, category, or account"
          />
        </label>

        <label htmlFor="category-filter" className="field-stack">
          <span className="helper-copy">Category</span>
          <select id="category-filter" className="select" value={categoryFilter} onChange={(event) => onCategoryChange(event.target.value)}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'All categories' : category}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="sort-filter" className="field-stack">
          <span className="helper-copy">Sort</span>
          <select id="sort-filter" className="select" value={sortKey} onChange={(event) => onSortChange(event.target.value as SortKey)}>
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="amount-desc">Highest amount</option>
            <option value="amount-asc">Lowest amount</option>
            <option value="category-asc">Category A-Z</option>
          </select>
        </label>
      </div>

      <div className="section-actions">
        <button type="button" className="ghost-button reset-filters-button" onClick={onResetFilters}>
          Reset filters
        </button>
      </div>
    </section>
  );
}

export function TransactionsPanel({ transactions, role, onEditTransaction, onDeleteTransaction, onResetFilters, search, categoryFilter, sortKey }: TransactionsPanelProps) {
  const [selectedMobileId, setSelectedMobileId] = useState<string | null>(null);

  useEffect(() => {
    if (!transactions.some((transaction) => transaction.id === selectedMobileId)) {
      setSelectedMobileId(null);
    }
  }, [transactions, selectedMobileId]);

  const hasFilters = search.trim().length > 0 || categoryFilter !== 'all' || sortKey !== 'date-desc';

  if (transactions.length === 0) {
    return (
      <section className="glass-card section-card transactions-panel">
        <div className="empty-state">
          <p className="section-title">No transactions match your filters</p>
          <p className="section-description">Try another search term or clear the current filters.</p>
          {hasFilters ? (
            <button type="button" className="control-button reset-filters-button" onClick={onResetFilters}>
              Reset filters
            </button>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className="glass-card section-card transactions-panel">
      <div className="transactions-header">
        <div>
          <h2 className="section-title">Message activity</h2>
          <p className="transactions-meta">{transactions.length} records displayed</p>
        </div>
      </div>

      <div className="transaction-list desktop-only">
        {transactions.map((transaction, index) => (
          <div key={transaction.id} className="transaction-row">
            <div>
              <p className="metric-title">Sender</p>
              <div className="sender-block">
                <img className="sender-avatar" src={`https://i.pravatar.cc/80?img=${(index % 30) + 1}`} alt={transaction.description} />
                <p className="transaction-date">{transaction.description}</p>
              </div>
            </div>
            <div>
              <p className="metric-title">Subject</p>
              <p className="transaction-description">
                {transaction.note || `${transaction.category} update`}
              </p>
            </div>
            <div>
              <p className="metric-title">Audience</p>
              <p className="transaction-date">{`${Math.max(1, Math.floor(transaction.amount / 700))} invited`}</p>
            </div>
            <div>
              <p className="metric-title">Priority</p>
              <span className={`transaction-type transaction-type-label ${transaction.type === 'income' ? 'income-pill' : 'expense-pill'}`}>
                {transaction.type === 'income' ? 'Urgent' : 'Pending'}
              </span>
            </div>
            <div>
              <p className="metric-title">Time</p>
              <p className="transaction-amount">
                {formatDate(transaction.date)}
              </p>
            </div>
            <div className="transaction-actions">
              {role === 'admin' ? (
                <>
                  <button type="button" aria-label={`Edit ${transaction.description}`} onClick={() => onEditTransaction(transaction.id)}>
                    <IconEdit />
                  </button>
                  <button type="button" aria-label={`Delete ${transaction.description}`} onClick={() => onDeleteTransaction(transaction.id)}>
                    <IconTrash />
                  </button>
                </>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="mobile-only transaction-list">
        {transactions.map((transaction) => {
          const open = selectedMobileId === transaction.id;

          return (
            <article key={transaction.id} className="transaction-row" onClick={() => setSelectedMobileId(open ? null : transaction.id)}>
              <div className="transactions-header transaction-row-header">
                <div>
                  <p className="metric-title">{formatDate(transaction.date)}</p>
                  <p className="transaction-description">
                    {transaction.description}
                  </p>
                </div>
                <span className={`transaction-type ${transaction.type === 'income' ? 'income-pill' : 'expense-pill'}`}>{transaction.type === 'income' ? 'Urgent' : 'Pending'}</span>
              </div>
              <div className="legend-row transaction-mobile-meta">
                <span className={`category-pill ${slugify(transaction.category)}`}>{transaction.category}</span>
                <strong className="transaction-mobile-amount">{formatDate(transaction.date)}</strong>
              </div>
              {open ? <p className="helper-copy">{transaction.account}{transaction.note ? ` • ${transaction.note}` : ''}</p> : null}
              {role === 'admin' && open ? (
                <div className="transaction-actions" onClick={(event) => event.stopPropagation()}>
                  <button type="button" aria-label={`Edit ${transaction.description}`} onClick={() => onEditTransaction(transaction.id)}>
                    <IconEdit />
                  </button>
                  <button type="button" aria-label={`Delete ${transaction.description}`} onClick={() => onDeleteTransaction(transaction.id)}>
                    <IconTrash />
                  </button>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function TransactionEditorModal({ open, transaction, onClose, onSave }: TransactionEditorModalProps) {
  const isEditing = Boolean(transaction);
  const [draft, setDraft] = useState<TransactionInput>({
    date: transaction?.date ?? new Date().toISOString().slice(0, 10),
    description: transaction?.description ?? '',
    category: transaction?.category ?? 'Salary',
    type: transaction?.type ?? 'expense',
    amount: transaction?.amount ?? 0,
    account: transaction?.account ?? 'Checking',
    note: transaction?.note ?? '',
  });

  useEffect(() => {
    if (open) {
      setDraft({
        date: transaction?.date ?? new Date().toISOString().slice(0, 10),
        description: transaction?.description ?? '',
        category: transaction?.category ?? 'Salary',
        type: transaction?.type ?? 'expense',
        amount: transaction?.amount ?? 0,
        account: transaction?.account ?? 'Checking',
        note: transaction?.note ?? '',
      });
    }
  }, [open, transaction]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave(
      {
        ...draft,
        amount: Number(draft.amount),
      },
      transaction?.id ?? null,
    );
  };

  const updateField = <K extends keyof TransactionInput>(field: K, value: TransactionInput[K]) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  if (!open) {
    return null;
  }

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="transaction-editor-title" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title" id="transaction-editor-title">
              {isEditing ? 'Edit transaction' : 'Add transaction'}
            </h2>
            <p className="helper-copy">Admin users can create or update a transaction record here.</p>
          </div>
          <button type="button" className="theme-button" onClick={onClose} aria-label="Close editor">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-grid">
          <label className="field-stack">
            <span className="helper-copy">Date</span>
            <input className="input" type="date" value={draft.date} onChange={(event) => updateField('date', event.target.value)} required />
          </label>

          <label className="field-stack">
            <span className="helper-copy">Type</span>
            <select className="select" value={draft.type} onChange={(event) => updateField('type', event.target.value as TransactionType)}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>

          <label className="field-stack full-span">
            <span className="helper-copy">Description</span>
            <input className="input" value={draft.description} onChange={(event) => updateField('description', event.target.value)} required placeholder="Enter transaction description" />
          </label>

          <label className="field-stack">
            <span className="helper-copy">Category</span>
            <input className="input" value={draft.category} onChange={(event) => updateField('category', event.target.value)} required placeholder="Salary, Rent, Groceries..." />
          </label>

          <label className="field-stack">
            <span className="helper-copy">Amount</span>
            <input className="input" type="number" min="0" step="0.01" value={draft.amount} onChange={(event) => updateField('amount', Number(event.target.value))} required />
          </label>

          <label className="field-stack">
            <span className="helper-copy">Account</span>
            <input className="input" value={draft.account} onChange={(event) => updateField('account', event.target.value)} required placeholder="Checking, Card, Savings..." />
          </label>

          <label className="field-stack">
            <span className="helper-copy">Note</span>
            <input className="input" value={draft.note ?? ''} onChange={(event) => updateField('note', event.target.value)} placeholder="Optional note" />
          </label>

          <div className="full-span form-actions">
            <button type="button" className="ghost-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-button">
              {isEditing ? 'Save changes' : 'Add transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}