# React Compiler example

Demonstrates the book's Chapter 2 excerpts:
- "The React Compiler: Automatic Optimization" — `src/ProductList.tsx` /
  `src/ProductCard.tsx`, written with no `useMemo`, `useCallback`, or `React.memo`;
  the compiler memoizes automatically. Compiled by the `compiler: true` option on
  `@vitejs/plugin-react` (see "Verified" below).
- "Tooling and Ecosystem" — `src/ProductList.test.tsx`, a React Testing Library test
  for the same component, run with Vitest.

Stack: Vite 8, React 19.

## Run

```
npm install
npm run dev    # view the app
npm test       # run the RTL test
npm run build  # type-check + production build
```

## Verified

`npm run build` and `npm test` both pass.

Implementation note (not a book divergence — the excerpt shows component code only,
not build configuration): `@vitejs/plugin-react` v6 switched from a Babel-based
transform to an Oxc-based one. Wiring in the React Compiler is now done via the
plugin's own `compiler: true` option (backed by the `oxc-transform-react` package)
rather than adding `babel-plugin-react-compiler` to a Babel config — see
`vite.config.ts`.
