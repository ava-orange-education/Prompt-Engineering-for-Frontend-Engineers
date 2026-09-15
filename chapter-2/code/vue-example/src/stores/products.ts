import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Product } from '../types';

// Not shown in the book excerpt — a minimal products store, just so
// ProductList.vue (which calls `useProductStore`) has something to import.
export const useProductStore = defineStore('products', () => {
  const products = ref<Product[]>([]);

  async function fetchProducts() {
    products.value = [
      { id: 1, name: 'Wireless Headphones', price: 79.99 },
      { id: 2, name: 'Mechanical Keyboard', price: 129.0 },
      { id: 3, name: 'USB-C Hub', price: 39.5 },
    ];
  }

  return { products, fetchProducts };
});
