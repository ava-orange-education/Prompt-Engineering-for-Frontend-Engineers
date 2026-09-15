# Chapter 7 — Generating a Responsive Dashboard

Prompts Claude Code to generate the "NovaMart" analytics dashboard (React 19, D3.js v7,
Tailwind CSS v4, Vite 8), then iterates via targeted modification prompts, generates a test
suite, and prepares it for deployment to Vercel.

## What's in this folder

- `prompts/` — the prompts used in the chapter, in order:
  - `01`–`07` — scaffold, data layer, KPI card, three D3 charts, and supporting layout
    components (assembled into the full dashboard page).
  - `mod-A`–`mod-D` — axis label rotation, date range filter, blue colour theme, dark/light
    mode toggle. Applied in order on top of the dashboard from `01`–`07`.
  - `08`–`10` — Vitest unit tests for the data layer, React Testing Library component tests,
    Playwright e2e tests.
  - `11`–`12` — Vercel/CI deployment configuration, pre-deployment performance audit (code
    splitting, tree-shaken D3 imports, memoized derivations, PWA manifest).
  - `explain-1`, `explain-2` — optional prompts asking Claude Code to explain its own output;
    not required to build the app.
- `code/` — the full, working dashboard project.

## Getting started

```bash
cd code
npm install
npm run dev
```

Dashboard runs at http://localhost:5173.

## Testing

```bash
cd code
npm run test        # Vitest: unit tests (src/data) + component tests (src/components)
npm run test:e2e     # Playwright e2e tests (tests/dashboard.spec.ts)
```

## Linting & building

```bash
cd code
npm run lint
npm run build
```

## Deployment

`code/vercel.json` and `code/.github/workflows/ci.yml` configure the project to deploy to
Vercel on push to `main`. Actually creating/configuring a Vercel project and wiring up the
`VERCEL_TOKEN` / `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` secrets is a deliberate manual step —
this chapter generates the config but does not deploy anything.

See `code/README.md` for full setup/testing/deployment instructions and a note on D3 being
imported as individual `d3-*` packages instead of the `d3` umbrella package, per the
Chapter 7 performance-audit prompt.
