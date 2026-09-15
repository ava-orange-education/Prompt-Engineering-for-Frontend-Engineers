# Chapter 8 — Coding a Data-Driven Interface

Hand-codes FormForge: a JSON-config-driven form system with a React 19 frontend and a NestJS
backend. Unlike Chapters 7 and 9, nothing here is AI-generated — it's a from-scratch build,
covering the FormConfig schema, dynamic Zod validation, ten field-type components, and tests.

## What's in this folder

- `code/` — the full, working monorepo (frontend + NestJS backend).

## Structure

```
code/
  packages/types/   @formforge/types — shared FormConfig types + the buildZodSchemaCore
                     validation engine used by both the browser and the server
  packages/api/     NestJS backend — serves configs from packages/api/configs/*.json and
                     validates submissions against them
  packages/web/     React 19 + Vite frontend — DynamicForm renders any FormConfig
```

## Getting started

```bash
cd code
npm install
npm run dev      # builds @formforge/types, then runs the API (:3000) and the web app (:5173)
```

Open http://localhost:5173 — it loads `configs/registration.json` from the API and renders it.

Other useful commands:

```bash
npm run build     # builds all three packages
npm test          # unit/component tests across all workspaces (vitest)
npm run test:e2e  # NestJS API integration tests (supertest against a real Nest app)
```

## Try the two smoke tests from the book

- **Edit an existing form**: open `packages/api/configs/registration.json`, add the "phone"
  field from "Adding a New Field" or the `emergencyContact` field from "Making a Field
  Conditionally Visible", save, and reload — no component code changes needed.
- **Add a whole new form with no new React code**: `packages/api/configs/feedback.json` is
  already included (the "Creating an Entirely New Form" example). Point `App.tsx`'s
  `formId` at `"feedback"` instead of `"registration"` and reload to see it render — select,
  textarea, rating, and file fields, all from one JSON file.

## Implementation notes

- **Package versions**: the book pins fairly specific forward-looking versions (`zod ^4.5.4`,
  `typescript ^6.0.3`, Tailwind v4, Vite 8 with its now-built-in Rolldown bundler, the
  `@vitejs/plugin-react` React Compiler preset). All of them turned out to be real, current
  npm packages, so they're used as specified.

Everything else — the FormConfig schema, `buildZodSchemaCore`, all ten field components, the
FieldRenderer/FieldWrapper/SectionRenderer/DynamicForm pipeline, and the three test files — is
wired up exactly as the book presents it.
