<template>
  <div class="bg-[#F9F5F2] min-h-screen">
    <div class="container mx-auto px-4 py-4 sm:py-8">
      <div v-if="productStore.isLoading" class="text-center p-10">
        <p class="text-green-700 font-semibold text-lg">Memuat produk...</p>
      </div>

      <div v-else-if="productStore.error" class="text-center p-10 text-red-600 font-semibold">
        <p>{{ productStore.error }}</p>
      </div>

      <div
        v-else-if="product"
        class="grid md:grid-cols-2 gap-6 lg:gap-10 bg-white rounded-3xl p-4 sm:p-6 shadow-xl mb-8"
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
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-green-900 mb-3">
            {{ product.name }}
          </h1>

          <div class="flex items-center mb-4 sm:mb-5 flex-wrap gap-2">
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

          <!-- Rating Display -->
          <div v-if="product.reviews_count > 0" class="flex items-center gap-2 mb-4">
            <div class="flex items-center">
              <span class="text-yellow-500 text-lg">★</span>
              <span class="text-lg font-bold text-gray-900 ml-1">
                {{ product.average_rating.toFixed(1) }}
              </span>
            </div>
            <span class="text-sm text-gray-600">
              ({{ product.reviews_count }} ulasan)
            </span>
          </div>

          <p class="text-2xl sm:text-3xl text-green-700 font-bold mb-4 sm:mb-6">
            Rp {{ parseFloat(product.price).toLocaleString('id-ID') }}
          </p>

          <p class="text-sm sm:text-base text-gray-700 leading-relaxed mb-4 sm:mb-6 text-justify">
            {{ product.description }}
          </p>

          <p class="text-sm text-gray-600 mb-4 font-medium">Stok tersedia: {{ product.stock }}</p>

          <div v-if="authStore.isAuthenticated" class="flex items-center gap-3 sm:gap-4">
            <input
              type="number"
              v-model.number="quantity"
              min="1"
              :max="product.stock"
              class="w-20 sm:w-24 bg-white text-gray-800 border border-gray-300 rounded-md shadow-sm text-center py-2 sm:py-3 focus:ring-green-500 focus:border-green-600"
            />
            <button
              @click="handleAddToCart"
              class="flex-1 bg-green-700 text-white font-bold py-2 sm:py-3 rounded-lg hover:bg-green-800 transition-colors disabled:bg-gray-400 text-sm sm:text-base"
              :disabled="quantity > product.stock || quantity < 1"
            >
              Tambah ke Keranjang
            </button>
          </div>

          <div v-else>
            <RouterLink
              to="/login"
              class="block w-full text-center bg-green-600 text-white font-bold py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Login Terlebih Dahulu
            </RouterLink>
          </div>

          <p v-if="quantity > product.stock && authStore.isAuthenticated" class="text-red-600 text-sm mt-2">
            Jumlah melebihi stok yang tersedia.
          </p>
        </div>
      </div>

      <!-- Reviews Section -->
      <div v-if="product" class="bg-white rounded-3xl p-4 sm:p-6 shadow-xl">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
          Ulasan Produk ({{ reviews.length }})
        </h2>

        <!-- Loading Reviews -->
        <div v-if="loadingReviews" class="text-center py-8 text-gray-600">
          Memuat ulasan...
        </div>

        <!-- No Reviews -->
        <div v-else-if="reviews.length === 0" class="text-center py-8 text-gray-600">
          Belum ada ulasan untuk produk ini.
        </div>

        <!-- Reviews List -->
        <div v-else class="space-y-4">
          <div
            v-for="review in reviews"
            :key="review.id"
            class="border-b last:border-b-0 pb-4 last:pb-0"
          >
            <div class="flex items-start justify-between mb-2">
              <div>
                <p class="font-semibold text-gray-900">{{ review.user.name }}</p>
                <div class="flex items-center gap-1 mt-1">
                  <span
                    v-for="star in 5"
                    :key="star"
                    class="text-lg"
                    :class="star <= review.rating ? 'text-yellow-500' : 'text-gray-300'"
                  >
                    ★
                  </span>
                </div>
              </div>
              <span class="text-xs text-gray-500">
                {{ new Date(review.created_at).toLocaleDateString('id-ID') }}
              </span>
            </div>
            <p class="text-sm text-gray-700 mt-2">{{ review.comment }}</p>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-6">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="loadReviews(page)"
            class="px-3 py-1 rounded-md text-sm font-medium transition-colors"
            :class="currentPage === page
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
          >
            {{ page }}
          </button>
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
import { useReviewStore } from '@/stores/review'

const route = useRoute()
const productStore = useProductStore()
const cartStore = useCartStore()
const authStore = useAuthStore()
const reviewStore = useReviewStore()

const product = computed(() => productStore.plant)
const quantity = ref(1)
const productImage = ref(null)
const reviews = ref([])
const loadingReviews = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)

function onImageError(event) {
  event.target.src = '/default-image.jpg'
}

async function loadReviews(page = 1) {
  loadingReviews.value = true
  currentPage.value = page
  try {
    const response = await reviewStore.fetchPlantReviews(route.params.id, page)
    reviews.value = response.data || []
    totalPages.value = response.last_page || 1
  } catch (error) {
    console.error('Error loading reviews:', error)
    reviews.value = []
  } finally {
    loadingReviews.value = false
  }
}

onMounted(async () => {
  await productStore.fetchPlant(route.params.id)
  loadReviews()
})

function handleAddToCart() {
  if (product.value && quantity.value > 0) {
    cartStore.addItem(product.value, quantity.value)
    alert(`${quantity.value} ${product.value.name} telah ditambahkan ke keranjang!`)
  }
}
</script>
