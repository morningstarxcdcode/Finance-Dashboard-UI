import { useEffect, useMemo, useState } from 'react';
import { categoryOrder, navigationTabs } from './data';
import { FinanceProvider, useFinance } from './store';
import { BalanceTrendChart, InsightsPanel, SpendingBreakdownCard, SummaryCards } from './components/charts';
import { DashboardShell, TopBar } from './components/layout';
import { TransactionEditorModal, TransactionToolbar, TransactionsPanel } from './components/transactions';
import { filterAndSortTransactions, getCategoryTotals, getInsights, getOverview } from './utils';
import type { Transaction } from './types';

type AppTab = 'Dashboard' | 'Finance' | 'Accounts' | 'HR';

type PeriodConfig = {
  label: string;
  salesSeries: Array<{ month: string; income: number; expenses: number }>;
};

const periodConfigs: PeriodConfig[] = [
  {
    label: 'Current Month',
    salesSeries: [
      { month: 'Jan', income: 360, expenses: 580 },
      { month: 'Feb', income: 660, expenses: 350 },
      { month: 'Mar', income: 360, expenses: 750 },
      { month: 'Apr', income: 260, expenses: 450 },
      { month: 'May', income: 530, expenses: 260 },
      { month: 'Jun', income: 530, expenses: 930 },
      { month: 'Jul', income: 360, expenses: 580 },
      { month: 'Aug', income: 0, expenses: 180 },
      { month: 'Sep', income: 180, expenses: 450 },
    ],
  },
  {
    label: 'Last Month',
    salesSeries: [
      { month: 'Jan', income: 520, expenses: 410 },
      { month: 'Feb', income: 610, expenses: 320 },
      { month: 'Mar', income: 430, expenses: 640 },
      { month: 'Apr', income: 340, expenses: 280 },
      { month: 'May', income: 470, expenses: 360 },
      { month: 'Jun', income: 760, expenses: 610 },
      { month: 'Jul', income: 420, expenses: 520 },
      { month: 'Aug', income: 210, expenses: 150 },
      { month: 'Sep', income: 330, expenses: 430 },
    ],
  },
  {
    label: 'Quarter View',
    salesSeries: [
      { month: 'Jan', income: 310, expenses: 420 },
      { month: 'Feb', income: 420, expenses: 510 },
      { month: 'Mar', income: 500, expenses: 450 },
      { month: 'Apr', income: 280, expenses: 260 },
      { month: 'May', income: 620, expenses: 330 },
      { month: 'Jun', income: 720, expenses: 810 },
      { month: 'Jul', income: 390, expenses: 560 },
      { month: 'Aug', income: 170, expenses: 220 },
      { month: 'Sep', income: 460, expenses: 300 },
    ],
  },
];

function PageToast({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }

  return <div className="page-toast" role="status">{message}</div>;
}

function AccountsPage({ transactions, onAction }: { transactions: Transaction[]; onAction: (message: string) => void }) {
  const balances = transactions.reduce<Record<string, number>>((accumulator, transaction) => {
    const amount = transaction.type === 'income' ? transaction.amount : -transaction.amount;
    accumulator[transaction.account] = (accumulator[transaction.account] ?? 0) + amount;
    return accumulator;
  }, {});

  const accounts = Object.entries(balances).sort((left, right) => right[1] - left[1]);

  return (
    <section className="glass-card section-card app-page-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">Accounts</h2>
          <p className="section-description">Track balances and trigger account actions</p>
        </div>
        <div className="section-actions">
          <button type="button" className="control-button" onClick={() => onAction('New account creation flow opened')}>
            Add account
          </button>
          <button type="button" className="ghost-button" onClick={() => onAction('Transfer workflow opened')}>
            Transfer funds
          </button>
        </div>
      </div>

      <div className="account-grid">
        {accounts.map(([account, amount]) => (
          <article key={account} className="account-card">
            <p className="metric-title">{account}</p>
            <p className="account-value">${Math.abs(amount).toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
            <p className="helper-copy">{amount >= 0 ? 'Positive balance' : 'Needs attention'}</p>
            <div className="section-actions">
              <button type="button" className="control-button" onClick={() => onAction(`Viewing statement for ${account}`)}>
                View statement
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function HRPage({ onAction }: { onAction: (message: string) => void }) {
  const employees = [
    { name: 'Hannah Morgan', team: 'Design', status: 'Active' },
    { name: 'Megan Clark', team: 'Marketing', status: 'Onboarding' },
    { name: 'James Ward', team: 'Finance', status: 'Active' },
    { name: 'Sarah Lewis', team: 'HR', status: 'Leave' },
  ];

  return (
    <section className="glass-card section-card app-page-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">HR</h2>
          <p className="section-description">Manage team status and HR actions</p>
        </div>
        <div className="section-actions">
          <button type="button" className="control-button" onClick={() => onAction('Invite employee modal opened')}>
            Invite employee
          </button>
          <button type="button" className="ghost-button" onClick={() => onAction('Leave requests panel opened')}>
            Leave requests
          </button>
        </div>
      </div>

      <div className="hr-list">
        {employees.map((employee) => (
          <article key={employee.name} className="hr-item">
            <div>
              <p className="transaction-description">{employee.name}</p>
              <p className="helper-copy">{employee.team}</p>
            </div>
            <span className={`transaction-type ${employee.status === 'Active' ? 'income-pill' : employee.status === 'Leave' ? 'expense-pill' : 'category-utilities'}`}>
              {employee.status}
            </span>
            <button type="button" className="ghost-button" onClick={() => onAction(`Opened profile for ${employee.name}`)}>
              Open profile
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function Dashboard() {
  const { state, actions } = useFinance();
  const [activeTab, setActiveTab] = useState<AppTab>('Dashboard');
  const [periodIndex, setPeriodIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const notify = (message: string) => {
    setToastMessage(message);
  };

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => setToastMessage(null), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const overview = useMemo(() => getOverview(state.transactions), [state.transactions]);
  const filteredTransactions = useMemo(
    () => filterAndSortTransactions(state.transactions, state.search, state.categoryFilter, state.sortKey),
    [state.transactions, state.search, state.categoryFilter, state.sortKey],
  );
  const spendingBreakdown = useMemo(() => getCategoryTotals(state.transactions), [state.transactions]);
  const insights = useMemo(() => getInsights(state.transactions), [state.transactions]);
  const monthlyTotals = useMemo(() => periodConfigs[periodIndex].salesSeries, [periodIndex]);
  const categories = useMemo(
    () => ['all', ...Array.from(new Set([...categoryOrder, ...state.transactions.map((transaction) => transaction.category)]))],
    [state.transactions],
  );
  const editingTransaction = state.editingId ? state.transactions.find((transaction) => transaction.id === state.editingId) ?? null : null;

  const financeOnlyTransactions = useMemo(
    () => filteredTransactions.filter((transaction) => transaction.type === 'income' || transaction.type === 'expense'),
    [filteredTransactions],
  );

  const renderActivePage = () => {
    if (activeTab === 'Accounts') {
      return <AccountsPage transactions={state.transactions} onAction={notify} />;
    }

    if (activeTab === 'HR') {
      return <HRPage onAction={notify} />;
    }

    const shownTransactions = activeTab === 'Finance' ? financeOnlyTransactions : filteredTransactions;
    const successRate = Math.max(10, Math.min(95, Number.isFinite(overview.savingsRate) ? Math.abs(overview.savingsRate) : 51.2));

    return (
      <>
        <SummaryCards overview={overview} />

        <div className="dashboard-grid">
          <div className="main-column">
            <BalanceTrendChart
              monthlyTotals={monthlyTotals}
              periodLabel={periodConfigs[periodIndex].label}
              onPeriodLabelClick={() => {
                setPeriodIndex((current) => {
                  const next = (current + 1) % periodConfigs.length;
                  notify(`Period switched to ${periodConfigs[next].label}`);
                  return next;
                });
              }}
              onPreviousPeriod={() => {
                setPeriodIndex((current) => (current - 1 + periodConfigs.length) % periodConfigs.length);
                notify('Loaded previous period');
              }}
              onNextPeriod={() => {
                setPeriodIndex((current) => (current + 1) % periodConfigs.length);
                notify('Loaded next period');
              }}
            />
            <TransactionToolbar
              categories={categories}
              role={state.role}
              search={state.search}
              categoryFilter={state.categoryFilter}
              sortKey={state.sortKey}
              onSearchChange={actions.setSearch}
              onCategoryChange={actions.setCategoryFilter}
              onSortChange={actions.setSortKey}
              onAddTransaction={actions.openCreateEditor}
              onResetFilters={actions.resetFilters}
            />
            <TransactionsPanel
              transactions={shownTransactions}
              role={state.role}
              onEditTransaction={actions.openEditEditor}
              onDeleteTransaction={actions.deleteTransaction}
              onResetFilters={actions.resetFilters}
              search={state.search}
              categoryFilter={state.categoryFilter}
              sortKey={state.sortKey}
            />
          </div>

          <aside className="side-column">
            <SpendingBreakdownCard spendingBreakdown={spendingBreakdown} onViewStatus={() => notify('Formation status details opened')} />
            <InsightsPanel insights={insights} role={state.role} successRate={successRate} onOpenDetails={() => notify('Success rate details opened')} />
          </aside>
        </div>
      </>
    );
  };

  return (
    <DashboardShell>
      <TopBar
        activeTab={activeTab}
        navigationTabs={navigationTabs}
        role={state.role}
        theme={state.theme}
        onTabChange={(tab) => setActiveTab(tab as AppTab)}
        onRoleChange={actions.setRole}
        onThemeChange={actions.setTheme}
        onQuickAction={(action) => notify(`${action} action opened`)}
      />

      {renderActivePage()}
      <PageToast message={toastMessage} />

      {state.role === 'admin' ? (
        <TransactionEditorModal
          open={state.editorOpen}
          transaction={editingTransaction}
          onClose={actions.closeEditor}
          onSave={actions.saveTransaction}
        />
      ) : null}
    </DashboardShell>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <Dashboard />
    </FinanceProvider>
  );
}