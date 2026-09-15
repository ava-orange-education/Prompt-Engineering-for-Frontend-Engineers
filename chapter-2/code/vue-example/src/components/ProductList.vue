<script setup lang="ts">
// From the book, section "Single-File Components"
import { ref, computed, onMounted } from 'vue';
import { useProductStore } from '../stores/products';
import { useCartStore } from '../stores/cart';
import ProductCard from './ProductCard.vue';

const store = useProductStore();
const cartStore = useCartStore();
const searchQuery = ref('');
const filtered = computed(() =>
  store.products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);
onMounted(() => store.fetchProducts());
</script>

<template>
  <div class="product-list">
    <input v-model="searchQuery" placeholder="Search products..." />
    <ProductCard
      v-for="product in filtered"
      :key="product.id"
      :product="product"
      @add-to-cart="cartStore.addItem(product)"
    />
    <p v-if="filtered.length === 0">No products found.</p>
  </div>
</template>

<style scoped>
.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}
</style>
