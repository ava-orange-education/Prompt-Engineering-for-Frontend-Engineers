# Angular signal inputs/outputs/model() example

Demonstrates the book's Chapter 2 excerpt "Signal Inputs, Outputs, and model()" —
`src/app/product-card.ts`, a standalone component using `input()`, `input.required()`,
`output()`, `model()`, `computed()`, and `effect()`. `src/app/app.ts` / `app.html` mount
it with sample data.

Stack: Angular 22.

## Run

```
npm install
npm start   # dev server
npm test    # unit tests (Vitest, via `ng test`)
npm run build
```

## Verified

`ng build` and `ng test` both pass. No API changes from the book's snippet were
needed — `input()`, `output()`, and `model()` are unchanged in Angular 22.

Implementation note (not a book divergence): current `ng new` scaffolds no longer add
`standalone: true` to the `@Component` decorator, since standalone components have
been the default since Angular 19 — the flag still works but is redundant, so it's
omitted here.
