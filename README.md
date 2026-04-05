# Finance Dashboard

A React + TypeScript finance dashboard built from the provided HTML reference. The UI keeps the same clean, rounded, glassmorphism-inspired look while adding the interactive assignment features: summary cards, charts, transaction management, role-based access, insights, search, filtering, sorting, dark mode, and responsive layout.

## Setup

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` starts the Vite development server.
- `npm run build` runs the TypeScript build and creates a production bundle.
- `npm run preview` serves the production build locally.

## Deploy To GitHub Pages (Branch)

This project is configured for repository GitHub Pages deployment:

- Vite `base` path: `/Finance-Dashboard-UI/`
- Build output folder: `docs/`

Steps:

1. Run `npm install`
2. Run `npm run build` (this creates/updates `docs/`)
3. Commit and push to `main`
4. In GitHub repo settings, go to Pages and set:
  - Source: `Deploy from a branch`
  - Branch: `main`
  - Folder: `/docs`

## Project Structure

```text
src/
  App.tsx
  main.tsx
  styles.css
  types.ts
  data.ts
  utils.ts
  store.tsx
  components/
    layout.tsx
    charts.tsx
    transactions.tsx
```

## Features

- Dashboard overview with summary cards for total balance, income, expenses, and savings rate.
- Time-based balance trend visualization rendered with a custom SVG chart.
- Categorical spending breakdown chart rendered as a donut chart with legend details.
- Transaction list with date, amount, category, account, and transaction type.
- Search, category filtering, and sorting controls for transactions.
- Role-based UI with Viewer and Admin modes.
- Admin transaction editor for creating and updating records.
- Insights section with automatic observations from the current data.
- Context-based state management for role, theme, filters, and transaction data.
- Dark mode support.
- Responsive layout for desktop and mobile.
- Empty-state handling when filters remove all visible transactions.

## Assignment Mapping

- Dashboard Overview with Summary Cards: implemented in `src/components/charts.tsx`.
- Time Based Visualization: implemented in `BalanceTrendChart`.
- Categorical Visualization: implemented in `SpendingBreakdownCard`.
- Transaction List with Details: implemented in `TransactionsPanel`.
- Transaction Filtering: search, category, and sort controls in `TransactionToolbar`.
- Transaction Sorting or Search: sorting and search are both supported.
- Role Based UI: Viewer is read-only, Admin can add/edit/delete transactions.
- Insights Section: implemented in `InsightsPanel`.
- State Management: implemented with React Context and a reducer in `src/store.tsx`.
- Responsive Design: handled in `src/styles.css` with layout breakpoints.

## Notes

- `code.html` is kept as the visual reference source used to match the layout and styling.
- The app uses static mock data so it can run without a backend.
- The transaction editor is intentionally gated to Admin mode only.
