# Prompt — Playwright E2E Tests

```
Generate Playwright end-to-end tests in tests/dashboard.spec.ts.

Scenarios to test:
  1. Page load: dashboard loads within 3 seconds, all 4 KPI cards visible
  2. Loading state: skeleton elements visible during the 800ms loading window
  3. Charts render: SVG elements present for all three charts
  4. Orders table: at least 5 rows visible after load
  5. Refresh button: clicking refresh shows loading state then data
  6. Responsive: at 375px viewport, sidebar hidden, KPI cards single column
  7. Dark mode toggle: clicking toggle adds "dark" class to <html>

Use page.waitForSelector and expect(locator).toBeVisible().
Add a playwright.config.ts targeting localhost:5173.
Each test should be independent — no shared state.
```
