import type { CategoryTotal, Insight, Overview } from '../types';
import { formatCurrency } from '../utils';
import type { ReactNode } from 'react';

type SummaryCardsProps = {
  overview: Overview;
};

type BalanceTrendChartProps = {
  monthlyTotals: Array<{ month: string; income: number; expenses: number }>;
  periodLabel: string;
  onPeriodLabelClick: () => void;
  onPreviousPeriod: () => void;
  onNextPeriod: () => void;
};

type SpendingBreakdownCardProps = {
  spendingBreakdown: CategoryTotal[];
  onViewStatus: () => void;
};

type InsightsPanelProps = {
  insights: Insight[];
  role: string;
  successRate: number;
  onOpenDetails: () => void;
};

function CardIcon({ children }: { children: ReactNode }) {
  return <div className="summary-icon">{children}</div>;
}

function IconBalance() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19h16" />
      <path d="M6 17V9" />
      <path d="M10 17V7" />
      <path d="M14 17v-4" />
      <path d="M18 17V5" />
    </svg>
  );
}

function IconTransactions() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
      <path d="M3 10h18" />
      <path d="M10 15h4" />
    </svg>
  );
}

function IconPeople() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="3" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a3 3 0 0 1 0 5.75" />
    </svg>
  );
}

export function SummaryCards({ overview }: SummaryCardsProps) {
  const totalTransactions = overview.incomeCount + overview.expenseCount;
  const uncategorizedCount = Math.max(1, Math.round(totalTransactions * 0.34));
  const weeklyCardSpend = overview.totalExpenses / 4.3;

  const cards = [
    { label: 'Your bank balance', value: formatCurrency(overview.totalBalance), note: 'Current account balance', icon: <IconBalance /> },
    { label: 'Uncategorized transactions', value: `${uncategorizedCount}`, note: `${totalTransactions} entries this month`, icon: <IconTransactions /> },
    { label: 'Employees working today', value: '7', note: roleHint(totalTransactions), icon: <IconPeople /> },
    {
      label: "This week's card spending",
      value: formatCurrency(weeklyCardSpend),
      note: `Savings rate ${overview.savingsRate.toFixed(1)}%`,
      icon: <IconTransactions />,
    },
  ];

  return (
    <section className="summary-grid" aria-label="Summary metrics">
      {cards.map((card) => (
        <article key={card.label} className="glass-card summary-card">
          <CardIcon>{card.icon}</CardIcon>
          <div>
            <h2 className="summary-value">{card.value}</h2>
            <p className="summary-label">{card.label}</p>
          </div>
          <span className={`summary-chip ${card.label.includes('spending') ? 'chip-red' : 'chip-green'}`}>{card.note}</span>
        </article>
      ))}
    </section>
  );
}

function roleHint(totalTransactions: number) {
  return totalTransactions > 10 ? 'Fully staffed' : 'Light schedule';
}

export function BalanceTrendChart({ monthlyTotals, periodLabel, onPeriodLabelClick, onPreviousPeriod, onNextPeriod }: BalanceTrendChartProps) {
  const maxValue = Math.max(...monthlyTotals.flatMap((item) => [item.income, item.expenses]), 1);
  const axisLabels = ['$1.2k', '$1k', '$800', '$600', '$400', '$200', '0'];

  const getBarLevel = (value: number) => {
    const ratio = value / maxValue;
    if (ratio >= 0.88) return 8;
    if (ratio >= 0.76) return 7;
    if (ratio >= 0.64) return 6;
    if (ratio >= 0.52) return 5;
    if (ratio >= 0.4) return 4;
    if (ratio >= 0.28) return 3;
    if (ratio >= 0.16) return 2;
    return 1;
  };

  return (
    <section className="glass-card section-card chart-shell" aria-label="Balance trend chart">
      <div className="section-header">
        <div>
          <h2 className="section-title">Average Sales</h2>
          <p className="section-description">Sales overview from all channels</p>
        </div>
        <div className="section-actions">
          <button type="button" className="control-button" onClick={onPeriodLabelClick}>
            {periodLabel}
          </button>
          <button type="button" className="theme-button" aria-label="Previous period" onClick={onPreviousPeriod}>
            ←
          </button>
          <button type="button" className="theme-button" aria-label="Next period" onClick={onNextPeriod}>
            →
          </button>
        </div>
      </div>

      <div className="trend-summary">
        <div className="trend-stat">
          <p className="trend-stat-label">Offline</p>
          <p className="trend-stat-value">{formatCurrency(monthlyTotals.reduce((sum, item) => sum + item.expenses, 0))}</p>
          <span className="summary-chip chip-red">-11%</span>
        </div>
        <div className="trend-stat">
          <p className="trend-stat-label">Online</p>
          <p className="trend-stat-value">{formatCurrency(monthlyTotals.reduce((sum, item) => sum + item.income, 0))}</p>
          <span className="summary-chip chip-green">+6%</span>
        </div>
      </div>

      <div className="chart-frame" role="img" aria-label="Monthly average sales chart">
        <div className="chart-y-axis" aria-hidden="true">
          {axisLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="bar-chart-wrap">
          <div className="bar-chart-grid" aria-hidden="true">
            {axisLabels.slice(0, -1).map((label) => (
              <span key={label} className="grid-line" />
            ))}
          </div>

          <div className="bar-chart">
            {monthlyTotals.map((point) => {
              const onlineLevel = getBarLevel(point.income);
              const offlineLevel = getBarLevel(point.expenses);

              return (
                <div key={point.month} className="bar-group">
                  <div className="bar-stack" aria-hidden="true">
                    <span className={`bar bar-offline bar-level-${offlineLevel}`} />
                    <span className={`bar bar-online bar-level-${onlineLevel}`} />
                  </div>
                  <span className="bar-label">{point.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="legend-row">
        <span className="legend-item">
          <span className="legend-swatch trend-swatch-secondary" />
          Offline
        </span>
        <span className="legend-item">
          <span className="legend-swatch trend-swatch-primary" />
          Online
        </span>
      </div>
    </section>
  );
}

export function SpendingBreakdownCard({ spendingBreakdown, onViewStatus }: SpendingBreakdownCardProps) {
  const total = spendingBreakdown.reduce((sum, item) => sum + item.amount, 0);
  const slices = (spendingBreakdown.length > 0 ? spendingBreakdown : [{ category: 'No expenses yet', amount: 1, color: '#d9dbe5' }]).map((item) => {
    const share = total > 0 ? (item.amount / total) * 100 : 100;
    return { ...item, share };
  });

  let cursor = 0;
  const gradientStops = slices
    .map((slice) => {
      const start = cursor;
      const end = cursor + slice.share;
      cursor = end;
      return `${slice.color} ${start}% ${end}%`;
    })
    .join(', ');

  return (
    <section className="glass-card section-card spending-grid" aria-label="Spending breakdown">
      <div className="section-header">
        <div>
          <h2 className="section-title">Spending Breakdown</h2>
          <p className="section-description">Expense distribution by category</p>
        </div>
        <button type="button" className="theme-button" aria-label="Open spending details" onClick={onViewStatus}>
          →
        </button>
      </div>

      <div className="spending-donut-wrap" role="img" aria-label="Category spending donut chart">
        <div className="spending-donut" style={{ background: `conic-gradient(${gradientStops})` }}>
          <div className="spending-donut-center">
            <p className="metric-title">Total spent</p>
            <p className="spending-total">{formatCurrency(total)}</p>
          </div>
        </div>
      </div>

      <div className="legend-list" aria-label="Category totals">
        {slices.map((slice) => (
          <article className="legend-card" key={slice.category}>
            <div className="legend-item-left">
              <span className="legend-swatch" style={{ background: slice.color }} aria-hidden="true" />
              <div>
                <p className="legend-label">{slice.category}</p>
                <p className="legend-value">{slice.share.toFixed(1)}%</p>
              </div>
            </div>
            <strong>{formatCurrency(slice.amount)}</strong>
          </article>
        ))}
      </div>

      <button type="button" className="primary-button status-button" onClick={onViewStatus}>View details</button>
    </section>
  );
}

export function InsightsPanel({ insights, role, successRate, onOpenDetails }: InsightsPanelProps) {
  const progress = 2 * Math.PI * 68;
  const offset = progress * (1 - successRate / 100);
  const todayEarned = insights[1]?.value ?? '$150';
  const weeklyEarned = insights[2]?.value ?? '$1,470';

  return (
    <section className="glass-card section-card success-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">Success Rate</h2>
          <p className="section-description">{role === 'admin' ? 'Team performance dashboard' : 'Performance overview'}</p>
        </div>
        <button type="button" className="theme-button" aria-label="Open success details" onClick={onOpenDetails}>
          →
        </button>
      </div>

      <div className="success-ring-wrap" role="img" aria-label="Success rate chart">
        <svg width="220" height="220" viewBox="0 0 220 220" className="success-ring">
          <circle cx="110" cy="110" r="68" fill="none" stroke="rgba(127, 121, 160, 0.14)" strokeWidth="16" />
          <circle
            cx="110"
            cy="110"
            r="68"
            fill="none"
            stroke="url(#successGradient)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={progress}
            strokeDashoffset={offset}
            transform="rotate(-90 110 110)"
          />
          <defs>
            <linearGradient id="successGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#b7a6fb" />
              <stop offset="100%" stopColor="#7f63ea" />
            </linearGradient>
          </defs>
          <text x="110" y="110" textAnchor="middle" className="ring-value">{successRate.toFixed(1)}%</text>
          <text x="110" y="136" textAnchor="middle" className="ring-note">↑ +5%</text>
        </svg>
      </div>

      <p className="success-copy">Hooray you success to earn {todayEarned} today and {weeklyEarned} this week, keep it up.</p>

      <div className="success-metrics">
        <div>
          <p className="metric-title">Peoples</p>
          <p className="success-value">15,110</p>
        </div>
        <div>
          <p className="metric-title">New Users</p>
          <p className="success-value">91,130</p>
        </div>
      </div>
    </section>
  );
}