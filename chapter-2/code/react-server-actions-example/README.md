# React Server Components + Actions API example

Demonstrates the book's Chapter 2 excerpts:
- "Core Architecture: JSX and Functional Components" — `app/products/page.tsx` (Server
  Component, no `'use client'`) rendering `app/products/AddToCartButton.tsx` (Client
  Component) that calls a Server Action through `useTransition`.
- "Hooks and the Actions API" — `app/profile/page.tsx` + `app/profile/ProfileForm.tsx`,
  which binds a `<form>` directly to a Server Action via `useActionState`.

Both Server Actions live in `app/actions.ts`. `lib/db.ts` is a small in-memory stand-in
for the Prisma-style `db.product.findMany` / `db.user.update` calls the book's snippets
use — the book doesn't show a database, so this is just enough to make the pages render.

Stack: Next.js 16 (App Router, Turbopack), React 19.

## Run

```
npm install
npm run dev
```

Then open `/products` and `/profile`.

## Verified

`npm run build` (type-checks + builds successfully) and manual smoke-test of both
routes with `next dev`. No API changes from the book's snippets were needed.
