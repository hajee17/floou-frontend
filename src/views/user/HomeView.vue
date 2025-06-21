<template>
  <div class="bg-[#F9F5F2] min-h-screen">
    <!-- HERO IMAGE FULL WIDTH WITH TEXT OVERLAY -->
    <section class="relative w-full h-[500px] md:h-[600px] rounded-b-3xl overflow-hidden mb-12">
      <!-- Background Gambar -->
      <img
        src="https://floou.hafidzirham.com/storage/plants/hero-plant.jpg"
        alt="Tanaman Hero"
        class="absolute inset-0 w-full h-full object-cover"
      />

      <!-- Overlay Gelap Transparan (opsional) -->
      <div class="absolute inset-0 bg-black/20"></div>

      <!-- Teks Overlay -->
      <div
        class="relative z-10 max-w-4xl mx-auto h-full flex flex-col justify-center px-6 text-white"
      >
        <h1 class="text-4xl md:text-5xl font-bold mb-4 leading-tight drop-shadow-lg">
          Natural Plants,<br />
          Happier Places
        </h1>
        <p class="text-lg mb-6 drop-shadow">
          Tanaman hias segar untuk mempercantik ruangan dan menenangkan hati.
        </p>
        <button
          @click="scrollToProduk"
          class="bg-white text-black font-semibold px-6 py-2 rounded-lg w-max hover:bg-gray-800 transition hover:text-white"
        >
          Beli Sekarang →
        </button>
      </div>
    </section>

    <!-- PRODUK -->
    <section id="produk" class="px-4 sm:px-8 lg:px-16 pb-12">
      <!-- Header -->
      <div class="text-center mb-10">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Tanaman Favorit Pilihan</h2>
        <p class="text-sm md:text-base text-gray-600 max-w-xl mx-auto">
          Jelajahi tanaman hias terlaris yang dipilih langsung oleh pecinta alam. Indah,
          menenangkan, dan cocok untuk mempercantik ruang harian Anda.
        </p>
      </div>

      <!-- Loading / Error -->
      <div v-if="productStore.isLoading" class="text-center py-10">Loading products...</div>
      <div v-else-if="productStore.error" class="text-center py-10 text-red-500">
        {{ productStore.error }}
      </div>

      <!-- Produk Grid -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <ProductCard
          v-for="product in productStore.plants.data"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- Pagination -->
      <div class="mt-10 flex justify-center flex-wrap gap-2">
        <button
          v-for="link in productStore.plants.links"
          :key="link.label"
          @click="goToPage(link.url)"
          :disabled="!link.url"
          v-html="link.label"
          class="px-4 py-2 text-sm border rounded transition"
          :class="{
            'bg-green-600 text-white': link.active,
            'hover:bg-gray-200': link.url,
            'text-gray-400 cursor-default': !link.url,
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
function scrollToProduk() {
  const produkSection = document.getElementById('produk')
  if (produkSection) {
    produkSection.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>
