<template>
  <div>
    <section class="bg-floou-brown text-white rounded-lg p-12 flex items-center mb-10">
      <div class="w-1/2">
        <h1 class="text-4xl font-bold mb-4">
          Natural Plants, <br />
          Happier Places
        </h1>
        <p class="mb-6">
          Hiasi ruanganmu dengan tanaman agar lebih segar, tenang, dan dekat dengan alam.
        </p>
        <button
          class="bg-white text-floou-brown font-bold py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Beli Sekarang
        </button>
      </div>
      <div class="w-1/2 flex justify-center">
        <img
          src="https://floou.hafidzirham.com/storage/plants/hero-plant.jpg"
          alt="Hero Plants"
          class="max-h-64"
        />
      </div>
    </section>

    <section>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-gray-800">Teman Hijau untuk Hari-Harimu</h2>
      </div>

      <div v-if="productStore.isLoading" class="text-center py-10">
        <p>Loading products...</p>
      </div>
      <div v-else-if="productStore.error" class="text-center py-10 text-red-500">
        <p>{{ productStore.error }}</p>
      </div>
      <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <ProductCard
          v-for="product in productStore.plants.data"
          :key="product.id"
          :product="product"
        />
      </div>
      <div class="mt-8 flex justify-center gap-2">
        <button
          v-for="link in productStore.plants.links"
          :key="link.label"
          @click="goToPage(link.url)"
          :disabled="!link.url"
          v-html="link.label"
          class="px-4 py-2 border rounded"
          :class="{
            'bg-green-600 text-white': link.active,
            'hover:bg-gray-200': link.url,
            'text-gray-400': !link.url,
          }"
        ></button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProductStore } from '@/stores/product'
import ProductCard from '../components/ProductCardView.vue'
const productStore = useProductStore()

onMounted(() => {
  productStore.fetchPlants()
})

function goToPage(url) {
  if (!url) return
  const pageNumber = new URL(url).searchParams.get('page')
  productStore.fetchPlants({ page: pageNumber })
}
</script>
