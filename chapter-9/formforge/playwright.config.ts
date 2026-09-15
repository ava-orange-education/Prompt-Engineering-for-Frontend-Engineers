import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  // The web app fetches its form list from the api on load with no retry,
  // so both servers must be verified ready (not just the web port) before
  // any test runs - otherwise the first fetch races the api's startup.
  // Playwright starts array entries in order and waits for each to be
  // ready before starting the next, so @formforge/types is only built
  // once here (in the api entry) - building it again after the api is
  // already up would trigger nest's --watch file watcher and restart it
  // mid-test-run.
  webServer: [
    {
      command: 'npm run build -w packages/types && npm run start:dev -w packages/api',
      url: 'http://localhost:3000/api/forms',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command: 'npm run dev -w packages/web',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ],
});
