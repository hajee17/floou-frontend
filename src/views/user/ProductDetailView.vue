<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="productStore.isLoading" class="text-center p-10">
      <p>Memuat produk...</p>
    </div>
    <div v-else-if="productStore.error" class="text-center p-10 text-red-500">
      <p>{{ productStore.error }}</p>
    </div>
    
    <div v-else-if="product" class="grid md:grid-cols-2 gap-8 lg:gap-12">
      <div>
        <img :src="product.imageUrl" :alt="product.name" class="w-full h-auto rounded-lg shadow-lg aspect-square object-cover">
      </div>
      <div>
        <h1 class="text-4xl font-bold mb-2">{{ product.name }}</h1>
        <div class="flex items-center mb-4">
            <span class="text-sm font-medium text-gray-600 mr-2">Kategori:</span>
            <span class="bg-gray-200 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">{{ product.category.name }}</span>
            <span class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">{{ product.plant_type.name }}</span>
        </div>
        <p class="text-3xl text-green-600 font-semibold mb-4">Rp {{ parseFloat(product.price).toLocaleString('id-ID') }}</p>
        
        <p class="text-gray-700 leading-relaxed mb-6">{{ product.description }}</p>
        
        <p class="text-sm text-gray-500 mb-4">Stok tersedia: {{ product.stock }}</p>

        <div class="flex items-center gap-4">
           <input type="number" v-model.number="quantity" min="1" :max="product.stock" class="w-24 border-gray-300 rounded-md shadow-sm text-center py-3">
          <button @click="handleAddToCart" class="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400" :disabled="quantity > product.stock || quantity < 1">
            Tambah ke Keranjang
          </button>
        </div>
        <p v-if="quantity > product.stock" class="text-red-500 text-sm mt-2">Jumlah melebihi stok yang tersedia.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore } from '@/stores/product';
import { useCartStore } from '@/stores/cart';

const route = useRoute();
const productStore = useProductStore(); 
const cartStore = useCartStore();

const product = computed(() => productStore.plant);
const quantity = ref(1);

onMounted(() => {
  productStore.fetchPlant(route.params.slug);
});

function handleAddToCart() {
  if (product.value && quantity.value > 0) {
    cartStore.addItem(product.value, quantity.value);
    alert(`${quantity.value} ${product.value.name} telah ditambahkan ke keranjang!`);
  }
}
</script>