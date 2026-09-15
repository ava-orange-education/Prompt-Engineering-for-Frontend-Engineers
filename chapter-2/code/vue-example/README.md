# Vue SFC + Pinia store example

Demonstrates the book's Chapter 2 excerpts:
- "Routing with Vue Router and State with Pinia" — `src/stores/cart.ts`, a Pinia store
  defined with the `defineStore('cart', () => { ... })` setup-function form.
- "Single-File Components" — `src/components/ProductList.vue`, the `<script setup>` SFC
  with `v-model` search filtering and a `computed` list, wired to the cart store above.

`src/stores/products.ts` and `src/components/ProductCard.vue` aren't from the book —
the SFC excerpt imports a `useProductStore` whose own implementation isn't shown, so
these are the minimum needed to make it runnable. `ProductList.vue`'s
`@add-to-cart="store.addToCart(product)"` call is likewise rewired to the actual cart
store's `addItem` action.

Stack: Vite 8, Vue 3.5, Pinia 4.

Note: this excerpt's section title mentions Vue Router, but no router code appears in
the excerpt itself, so this example doesn't include one.

## Run

```
npm install
npm run dev
npm run build   # type-checks (vue-tsc) + production build
```

## Verified

`vue-tsc -b` and `vite build` both succeed. No API changes from the book's snippets
were needed.
