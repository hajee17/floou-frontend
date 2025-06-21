<template>
  <div class="space-y-8 text-gray-800">
    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <h1 class="text-3xl font-bold">Kelola Produk</h1>
      <div class="flex items-center gap-4">
        <div class="relative flex-1">
          <input
            type="text"
            v-model="searchQuery"
            @input="debouncedFetch"
            placeholder="Cari produk..."
            class="w-full md:w-64 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 placeholder-gray-400"
          />
        </div>
        <RouterLink
          :to="{ name: 'admin-product-new' }"
          class="bg-green-600 text-white font-semibold px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <PlusIcon class="h-5 w-5" />
          <span>Buat Baru</span>
        </RouterLink>
      </div>
    </div>

    <div v-if="productStore.isLoading" class="text-center py-10 text-gray-500">
      Memuat produk...
    </div>
    <div v-else-if="productStore.error" class="text-center py-10 text-red-500">
      {{ productStore.error }}
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition"
      >
        <img :src="product.imageUrl" alt="Product Image" class="w-full h-48 object-cover" />
        <div class="p-4 space-y-2">
          <h3 class="font-bold text-lg text-gray-900">{{ product.name }}</h3>
          <p class="text-sm text-gray-600 h-10 overflow-hidden">{{ product.description }}</p>
          <div class="flex justify-between items-center pt-2">
            <div>
              <p class="font-bold text-green-700">
                Rp {{ parseFloat(product.price).toLocaleString('id-ID') }}
              </p>
              <p class="text-xs text-gray-500">Stok: {{ product.stock }}</p>
            </div>
            <div class="flex gap-2">
              <RouterLink
                :to="{ name: 'admin-product-edit', params: { id: product.id } }"
                class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-md transition"
              >
                <PencilSquareIcon class="h-5 w-5" />
              </RouterLink>
              <button
                @click="handleDelete(product.id, product.name)"
                class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-100 rounded-md transition"
              >
                <TrashIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="productStore.plants?.links?.length" class="mt-8 flex justify-center gap-2">
      <button
        v-for="link in productStore.plants.links"
        :key="link.label"
        @click="goToPage(link.url)"
        :disabled="!link.url"
        v-html="link.label"
        class="px-4 py-2 border rounded transition"
        :class="{
          'bg-green-600 text-white': link.active,
          'hover:bg-gray-200 text-gray-700': link.url && !link.active,
          'text-gray-400 cursor-not-allowed': !link.url,
        }"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useProductStore } from '@/stores/product'
import { RouterLink } from 'vue-router'
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'

const productStore = useProductStore()
const products = computed(() => productStore.plants.data)
const searchQuery = ref('')
let debounceTimer

onMounted(() => {
  productStore.fetchPlants()
})

function debouncedFetch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    productStore.fetchPlants({ search: searchQuery.value })
  }, 500)
}

async function handleDelete(id, name) {
  if (confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?`)) {
    await productStore.deletePlant(id)
  }
}

function goToPage(url) {
  if (!url) return
  const pageNumber = new URL(url).searchParams.get('page')
  productStore.fetchPlants({ search: searchQuery.value, page: pageNumber })
}
</script>
