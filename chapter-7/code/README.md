# NovaMart Analytics Dashboard

A responsive analytics dashboard built with React 19, TypeScript, D3.js v7, and
Tailwind CSS v4. All data is synthetic and generated client-side — there is no
backend.

## Stack

- Vite 8
- React 19 + TypeScript (strict mode)
- Tailwind CSS v4 (CSS-first config, class-based dark mode)
- D3.js v7 (charts) + d3-regression (trend line)
- React Router v8
- Vitest + React Testing Library (unit/component tests)
- Playwright (e2e tests)

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Starts the dev server at http://localhost:5173.

## Testing

```bash
npm run test        # Vitest: unit tests (src/data) + component tests (src/components)
npm run test:e2e     # Playwright e2e tests (tests/dashboard.spec.ts)
```

`test:e2e` runs against the dev server locally, and against a production
build (`vite preview`) in CI — see `playwright.config.ts`.

## Linting & formatting

```bash
npm run lint
npm run format
```

## Building

```bash
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build locally
```

## Deployment

The project deploys to [Vercel](https://vercel.com) as a static SPA
(`vercel.json` rewrites all routes to `index.html`).

`.github/workflows/ci.yml` runs on every push/PR to `main`: install, lint,
unit tests, build, then (on `main` only) deploy to Vercel using the
`VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` repo secrets,
followed by a separate job running e2e tests against the production build.

No environment variables are required to run the app itself — see
`.env.example` for the deployment secrets.

## Versions

Built against the current tool versions at generation time (Vite 8.3.0, TypeScript
~6.0.2, React 19.2.8, Tailwind CSS 4.3.3, ESLint 10.10.0, react-router 8.3.1), which are close
to but not always identical to the versions cited in the book. One intentional deviation:

- **No umbrella `d3` package.** After the performance-audit pass (prompt 12),
  chart components import directly from `d3-selection`, `d3-scale`, `d3-axis`,
  `d3-array`, `d3-shape`, `d3-ease`, and `d3-transition` instead of `import * as
d3 from 'd3'`. These are the same D3 v7 packages, just imported individually
  to enable tree-shaking — there's no `"d3": "^7.9.0"` entry in `package.json`.

## Project structure

```
src/
  types/        Shared TypeScript interfaces
  data/         Synthetic data generators + derivation functions
  hooks/        useDashboardData, useDarkMode
  components/
    ui/         KpiCard, OrdersTable, DateRangeFilter, ChartSkeleton
    charts/     RevenueAreaChart, CategoryBarChart, LtvScatterPlot (D3)
    layout/     DashboardHeader, Sidebar
  pages/        Dashboard
tests/          Playwright e2e specs
```
