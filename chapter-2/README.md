# Chapter 2 — The Various Front-End Frameworks and Libraries

Covers the component model, reactivity, the virtual DOM (and alternatives), and the modern
build pipeline — contrasted across React, Angular, Vue, and Svelte.

## What's in this folder

`code/` holds five small, runnable projects. They're separate, side-by-side comparisons —
not one connected app — matching how the book itself contrasts the frameworks. Each covers
one or more of the book's 8 code excerpts:

- **`react-server-actions-example/`** (Next.js) — "Core Architecture: JSX and Functional
  Components" (Server/Client Components) and "Hooks and the Actions API"
  (`useActionState` + Server Actions).
- **`react-compiler-example/`** (Vite) — "The React Compiler: Automatic Optimization" and
  "Tooling and Ecosystem" (a React Testing Library test for the same component).
- **`angular-signals-example/`** (Angular CLI) — "Signal Inputs, Outputs, and model()".
- **`vue-example/`** (Vite) — "Routing with Vue Router and State with Pinia" (the Pinia
  store) and "Single-File Components" (the SFC that consumes it).
- **`svelte-runes-example/`** (Vite) — "Svelte 5 Runes and Component Syntax".

Each project's own README notes which excerpt(s) it demonstrates, how to run it, and what
(if anything) needed adapting to make it runnable in isolation (e.g. a mock in-memory `db`
standing in for the book's Prisma-style calls, since no database is shown in the excerpts).

## Verified against current stable releases

All five were built/tested against the current stable release of each framework as of
2026-09 (React 19.3 / Next.js 16, Angular 22, Vue 3.5 + Pinia 4, Svelte 5.57). No API in
any of the book's snippets has been renamed or removed — every excerpt runs as written.
The one build-tooling detail worth flagging (not an API change in the book's own code):
`@vitejs/plugin-react` v6 now enables the React Compiler via its own `compiler: true`
option rather than manually configuring `babel-plugin-react-compiler` — see
`react-compiler-example/README.md`.
