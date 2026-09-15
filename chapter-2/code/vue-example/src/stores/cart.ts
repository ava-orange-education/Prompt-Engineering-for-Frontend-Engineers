import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { CartItem, Product } from '../types';

// From the book, section "Routing with Vue Router and State with Pinia"
export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);
  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.qty, 0)
  );
  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.qty, 0)
  );
  function addItem(product: Product) {
    const existing = items.value.find((i) => i.id === product.id);
    if (existing) {
      existing.qty++;
    } else {
      items.value.push({ ...product, qty: 1 });
    }
  }
  function removeItem(id: number) {
    items.value = items.value.filter((i) => i.id !== id);
  }
  return { items, totalItems, totalPrice, addItem, removeItem };
});
