import { defineConfig } from '@playwright/test'

// Locally, tests run against the dev server for fast iteration. In CI, the
// production build is served via `vite preview` so e2e tests exercise the
// same artifact that gets deployed.
const isCI = !!process.env.CI
const port = isCI ? 4173 : 5173
const baseURL = `http://localhost:${port}`

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: {
    command: isCI ? `npm run preview -- --port ${port}` : `npm run dev -- --port ${port}`,
    url: baseURL,
    reuseExistingServer: !isCI,
  },
})
