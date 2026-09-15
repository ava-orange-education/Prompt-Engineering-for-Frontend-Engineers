<script setup lang="ts">
import type { Product } from '../types';

defineProps<{ product: Product }>();
defineEmits<{ 'add-to-cart': [] }>();
</script>

<template>
  <div class="product-card">
    <h3>{{ product.name }}</h3>
    <p>${{ product.price.toFixed(2) }}</p>
    <button @click="$emit('add-to-cart')">Add to cart</button>
  </div>
</template>

<style scoped>
.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
}
</style>
