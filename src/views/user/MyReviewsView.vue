<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Ulasan Saya</h1>

      <div v-if="isLoading" class="text-center py-12">
        <p class="text-gray-500">Memuat ulasan...</p>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-500">{{ error }}</p>
      </div>

      <div v-else-if="myReviews.data.length === 0" class="text-center py-12">
        <p class="text-gray-500">Anda belum memberikan ulasan</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="review in myReviews.data"
          :key="review.id"
          class="bg-white p-6 rounded-lg shadow"
        >
          <div class="flex items-start gap-4">
            <img
              v-if="review.plant?.image_url"
              :src="review.plant.image_url"
              :alt="review.plant.name"
              class="w-20 h-20 object-cover rounded"
            />
            <div class="flex-1">
              <h3 class="font-semibold text-lg">{{ review.plant?.name }}</h3>
              <div class="flex items-center gap-1 my-2">
                <span
                  v-for="star in 5"
                  :key="star"
                  :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                >
                  ★
                </span>
              </div>
              <p class="text-gray-700">{{ review.comment }}</p>
              <p class="text-sm text-gray-500 mt-2">
                {{ formatDate(review.created_at) }}
              </p>
              <div class="flex gap-2 mt-4">
                <button
                  @click="startEdit(review)"
                  class="text-sm text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  @click="handleDelete(review.id)"
                  class="text-sm text-red-600 hover:text-red-800"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="myReviews.data.length > 0" class="mt-6 flex justify-center">
        <nav class="flex gap-2">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="loadPage(page)"
            :class="[
              'px-4 py-2 rounded',
              page === currentPage
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100',
            ]"
          >
            {{ page }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="editingReview"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-xl font-bold mb-4">Edit Ulasan</h3>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div class="flex gap-2">
            <button
              v-for="star in 5"
              :key="star"
              @click="editData.rating = star"
              :class="[
                'text-3xl',
                star <= editData.rating ? 'text-yellow-400' : 'text-gray-300',
              ]"
            >
              ★
            </button>
          </div>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Komentar</label>
          <textarea
            v-model="editData.comment"
            rows="4"
            class="w-full border rounded-lg px-3 py-2"
          ></textarea>
        </div>
        <div class="flex justify-end gap-2">
          <button
            @click="cancelEdit"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Batal
          </button>
          <button
            @click="saveEdit"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useReviewStore } from '@/stores/review'

const reviewStore = useReviewStore()
const { myReviews, isLoading, error } = reviewStore

const editingReview = ref(null)
const editData = ref({ rating: 5, comment: '' })

const currentPage = computed(() => myReviews.value.meta?.current_page || 1)
const totalPages = computed(() => myReviews.value.meta?.last_page || 1)

onMounted(() => {
  reviewStore.fetchMyReviews()
})

function loadPage(page) {
  reviewStore.fetchMyReviews({ page })
}

function startEdit(review) {
  editingReview.value = review
  editData.value = {
    rating: review.rating,
    comment: review.comment,
  }
}

function cancelEdit() {
  editingReview.value = null
  editData.value = { rating: 5, comment: '' }
}

async function saveEdit() {
  try {
    await reviewStore.updateReview(editingReview.value.id, editData.value)
    await reviewStore.fetchMyReviews()
    cancelEdit()
  } catch {
    alert('Gagal memperbarui ulasan')
  }
}

async function handleDelete(id) {
  if (confirm('Apakah Anda yakin ingin menghapus ulasan ini?')) {
    try {
      await reviewStore.deleteReview(id)
      await reviewStore.fetchMyReviews()
    } catch {
      alert('Gagal menghapus ulasan')
    }
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
