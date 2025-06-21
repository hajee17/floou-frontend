<template>
  <div class="bg-[#F9F5F2] min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <div v-if="productStore.isLoading" class="text-center p-10">
        <p class="text-green-700 font-semibold text-lg">Memuat produk...</p>
      </div>

      <div v-else-if="productStore.error" class="text-center p-10 text-red-600 font-semibold">
        <p>{{ productStore.error }}</p>
      </div>

      <div
        v-else-if="product"
        class="grid md:grid-cols-2 gap-10 lg:gap-16 bg-white rounded-3xl p-6 shadow-xl"
      >
        <div>
          <img
            :src="product.imageUrl"
            :alt="product.name"
            @error="onImageError"
            ref="productImage"
            class="w-full h-auto rounded-xl shadow-lg aspect-square object-cover border border-gray-200"
          />
        </div>

        <div>
          <h1 class="text-4xl font-bold text-green-900 mb-3">{{ product.name }}</h1>

          <div class="flex items-center mb-5 flex-wrap gap-2">
            <span class="text-sm font-medium text-gray-700">Kategori:</span>
            <span class="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
              {{ product.category.name }}
            </span>
            <span
              class="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full"
            >
              {{ product.plant_type.name }}
            </span>
          </div>

          <p class="text-3xl text-green-700 font-bold mb-6">
            Rp {{ parseFloat(product.price).toLocaleString('id-ID') }}
          </p>

          <p class="text-gray-700 leading-relaxed mb-6 text-justify">{{ product.description }}</p>

          <p class="text-sm text-gray-600 mb-4 font-medium">Stok tersedia: {{ product.stock }}</p>

          <div v-if="authStore.isAuthenticated" class="flex items-center gap-4">
            <input
              type="number"
              v-model.number="quantity"
              min="1"
              :max="product.stock"
              class="w-24 bg-white text-gray-800 border border-gray-300 rounded-md shadow-sm text-center py-3 focus:ring-green-500 focus:border-green-600"
            />
            <button
              @click="handleAddToCart"
              class="w-full bg-green-700 text-white font-bold py-3 rounded-lg hover:bg-green-800 transition-colors disabled:bg-gray-400"
              :disabled="quantity > product.stock || quantity < 1"
            >
              Tambah ke Keranjang
            </button>
          </div>

          <div v-else>
            <RouterLink
              to="/login"
              class="block w-full text-center bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login Terlebih Dahulu
            </RouterLink>
          </div>

          <p v-if="quantity > product.stock && authStore.isAuthenticated" class="text-red-600 text-sm mt-2">
            Jumlah melebihi stok yang tersedia.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const productStore = useProductStore()
const cartStore = useCartStore()
const authStore = useAuthStore()

const product = computed(() => productStore.plant)
const quantity = ref(1)
const productImage = ref(null)

function onImageError(event) {
  event.target.src = '/default-image.jpg'
}

onMounted(() => {
  productStore.fetchPlant(route.params.id)
})

function handleAddToCart() {
  if (product.value && quantity.value > 0) {
    cartStore.addItem(product.value, quantity.value)
    alert(`${quantity.value} ${product.value.name} telah ditambahkan ke keranjang!`)
  }
}
</script>
