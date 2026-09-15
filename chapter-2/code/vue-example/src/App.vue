<script setup lang="ts">
import { useCartStore } from './stores/cart';
import ProductList from './components/ProductList.vue';

const cartStore = useCartStore();
</script>

<template>
  <header>
    <h1>Vue example — Pinia store + SFC</h1>
    <p>Cart: {{ cartStore.totalItems }} items — ${{ cartStore.totalPrice.toFixed(2) }}</p>
  </header>
  <ProductList />
</template>
