# Chapter 9 — Generating a Data-Driven Interface (FormForge)

Generates the same kind of system as Chapter 8 (JSON config → rendered/validated/submitted
form, React 19 + NestJS) but via prompting rather than hand-coding — context engineering,
system context prompts, and file-based prompting workflows.

## What's in this folder

- `prompts/` — the prompts used in the chapter, in order.
- `formforge/` — the full FormForge monorepo.

## Getting started

```bash
cd formforge
npm install
npm run dev
```

This starts the NestJS API on `http://localhost:3000` and the Vite dev server on
`http://localhost:5173` (the dev server proxies `/api/*` to the API). Open
`http://localhost:5173` and pick a form from the list.

## Structure

```
formforge/
  configs/                  # FormConfig JSON files -- one per form (see configs/README.md)
  packages/
    types/                  # shared FormConfig TypeScript types
    api/                    # NestJS backend -- serves configs, accepts submissions
    web/                    # React 19 frontend -- FormList, FormPage, DynamicForm
  tests/                    # Playwright e2e tests
  Dockerfile.api, Dockerfile.web, docker-compose.yml, nginx.conf
  .github/workflows/ci-cd.yml
```

## Running tests

```bash
npm run test                                  # API config tests + web component tests
npx playwright install chromium               # first time only
npm run test:e2e                              # Playwright, against the dev servers
```

All three suites (7 API tests, 6 component tests, 7 e2e tests) pass.

## Docker

```bash
docker compose up --build
```

Builds and runs the API (port 3000) and web (port 80, nginx).

## Divergences from `chapter-9-material/`

- **Config path resolution.** `code-excerpts/claude-response-config-unit-tests-key-tests.md`
  reads the config with a bare relative path,
  `readFileSync('configs/employee-onboarding.json', 'utf-8')`, which only works if the
  test runner's cwd is the repo root. This repo's tests and services resolve the path via
  `join(__dirname, ...)` instead, so they work regardless of which workspace script started
  them (`npm run start:dev -w packages/api` cwd's into `packages/api`, not the root).
