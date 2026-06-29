<template>
  <div class="container mx-auto px-4 py-4 sm:py-8">
    <div v-if="orderStore.isLoading" class="text-center p-10 text-gray-800">
      <p>Memuat detail pesanan...</p>
    </div>

    <div v-else-if="orderStore.error" class="text-center p-10 text-red-600 font-medium">
      <p>{{ orderStore.error }}</p>
    </div>

    <div
      v-else-if="order"
      class="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg max-w-4xl mx-auto text-gray-900"
    >
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold">
            {{ order.invoice_number || `Pesanan #${order.id}` }}
          </h1>
          <p class="text-xs sm:text-sm text-gray-700 mt-1">
            Dipesan pada:
            {{
              new Date(order.created_at).toLocaleString('id-ID', {
                dateStyle: 'long',
                timeStyle: 'short',
              })
            }}
          </p>
        </div>
        <span
          class="px-3 py-1 text-sm font-bold rounded-full capitalize"
          :class="statusClass(order.status)"
        >
          {{ statusLabel(order.status) }}
        </span>
      </div>

      <hr class="my-4 sm:my-6" />

      <!-- Shipping Info -->
      <div class="grid sm:grid-cols-2 gap-4 sm:gap-8 mb-4 sm:mb-6">
        <div>
          <h2 class="text-base sm:text-lg font-semibold mb-2">Informasi Penerima</h2>
          <div class="text-sm sm:text-base space-y-1">
            <p class="text-gray-800"><strong>Nama:</strong> {{ order.recipient_name }}</p>
            <p class="text-gray-800"><strong>Telepon:</strong> {{ order.recipient_phone }}</p>
            <p class="text-gray-800 mt-2"><strong>Alamat:</strong></p>
            <p class="text-gray-700">{{ order.shipping_address }}</p>
            <p v-if="order.notes" class="text-sm text-gray-600 mt-2">
              <strong>Catatan:</strong> {{ order.notes }}
            </p>
          </div>
        </div>

        <div>
          <h2 class="text-base sm:text-lg font-semibold mb-2">Info Pengiriman & Pembayaran</h2>
          <div class="text-sm sm:text-base space-y-1">
            <p class="text-gray-800">
              <strong>Metode:</strong>
              <span class="capitalize">{{ order.shipping_method }}</span>
            </p>
            <p class="text-gray-800">
              <strong>Biaya Kirim:</strong>
              Rp {{ parseFloat(order.shipping_cost).toLocaleString('id-ID') }}
            </p>
            <p class="text-gray-900 font-bold text-lg mt-2">
              Total: Rp {{ parseFloat(order.grand_total).toLocaleString('id-ID') }}
            </p>
          </div>

          <div v-if="order.status === 'pending'" class="mt-4 border-t pt-4">
            <p class="text-sm font-semibold text-gray-800 mb-2">
              Silakan pindai kode QRIS:
            </p>
            <img
              src="/images/qris-toko.jpg"
              alt="QRIS Pembayaran"
              class="w-32 h-32 sm:w-48 sm:h-48 border rounded-md"
            />
            <p class="text-xs text-gray-600 mt-2">Transfer sesuai total di atas.</p>
          </div>
        </div>
      </div>

      <hr class="my-4 sm:my-6" />

      <!-- Item List -->
      <div>
        <h2 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Item yang Dipesan</h2>
        <div class="space-y-3 sm:space-y-4">
          <div
            v-for="item in order.order_details"
            :key="item.id"
            class="flex flex-col gap-3 pb-3 border-b last:border-b-0"
          >
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div class="flex items-center gap-3 sm:gap-4">
                <img
                  :src="productStore.image_base_url + item.plant.image"
                  :alt="item.plant.name"
                  class="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md border flex-shrink-0"
                />
                <div>
                  <p class="font-medium text-gray-900 text-sm sm:text-base">{{ item.plant.name }}</p>
                  <p class="text-xs sm:text-sm text-gray-700">
                    {{ item.quantity }} x Rp {{ parseFloat(item.price).toLocaleString('id-ID') }}
                  </p>
                </div>
              </div>
              <p class="font-semibold text-gray-900 text-sm sm:text-base sm:text-right">
                Rp {{ (item.quantity * item.price).toLocaleString('id-ID') }}
              </p>
            </div>

            <!-- Review Button for Completed Order -->
            <button
              v-if="canReview && !hasReviewed(item.plant.id)"
              @click="openReviewModal(item.plant)"
              class="text-sm text-green-600 hover:text-green-700 font-medium text-left"
            >
              ⭐ Tulis Ulasan untuk produk ini
            </button>
            <p v-else-if="canReview && hasReviewed(item.plant.id)" class="text-xs text-gray-500">
              ✅ Anda sudah memberikan ulasan
            </p>
          </div>
        </div>
      </div>

      <hr class="my-4 sm:my-6" />

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          v-if="canCancel"
          @click="handleCancelOrder"
          :disabled="isCanceling"
          class="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ isCanceling ? 'Membatalkan...' : 'Batalkan Pesanan' }}
        </button>

        <button
          v-if="canReview"
          @click="$router.push(`/ulasan-saya`)"
          class="w-full sm:w-auto px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
        >
          Tulis Review
        </button>

        <button
          @click="handleDownloadInvoice"
          :disabled="isDownloadingInvoice"
          class="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ isDownloadingInvoice ? 'Mengunduh...' : 'Unduh Invoice' }}
        </button>
      </div>

      <div v-if="order.cancel_reason" class="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
        <p class="text-sm font-semibold text-red-800">Alasan Pembatalan:</p>
        <p class="text-sm text-red-700 mt-1">{{ order.cancel_reason }}</p>
      </div>
    </div>

    <!-- Review Modal -->
    <div
      v-if="showReviewModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeReviewModal"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-xl font-bold mb-4">Tulis Ulasan</h3>

        <div class="mb-4">
          <p class="text-gray-700 font-medium">{{ reviewPlant?.name }}</p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div class="flex gap-2">
            <button
              v-for="star in 5"
              :key="star"
              @click="reviewData.rating = star"
              :class="[
                'text-3xl transition-colors',
                star <= reviewData.rating ? 'text-yellow-500' : 'text-gray-300'
              ]"
            >
              ★
            </button>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Komentar</label>
          <textarea
            v-model="reviewData.comment"
            rows="4"
            class="w-full border rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Bagikan pengalaman Anda dengan produk ini..."
          ></textarea>
        </div>

        <div v-if="reviewError" class="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded">
          {{ reviewError }}
        </div>

        <div class="flex gap-3">
          <button
            @click="closeReviewModal"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            @click="submitReview"
            :disabled="isSubmittingReview || !reviewData.rating"
            class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {{ isSubmittingReview ? 'Mengirim...' : 'Kirim Ulasan' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useOrderStore } from '@/stores/order'
import { useProductStore } from '@/stores/product'
import { useReviewStore } from '@/stores/review'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
})

const orderStore = useOrderStore()
const productStore = useProductStore()
const reviewStore = useReviewStore()
const order = computed(() => orderStore.order)
const isCanceling = ref(false)
const isDownloadingInvoice = ref(false)

// Review Modal
const showReviewModal = ref(false)
const reviewPlant = ref(null)
const reviewData = ref({
  rating: 5,
  comment: ''
})
const isSubmittingReview = ref(false)
const reviewError = ref(null)
const existingReviews = ref([])

const canCancel = computed(() => {
  return order.value && (order.value.status === 'pending' || order.value.status === 'confirmed')
})

const canReview = computed(() => {
  return order.value && order.value.status === 'completed'
})

const hasReviewed = (plantId) => {
  return existingReviews.value.includes(plantId)
}

const openReviewModal = (plant) => {
  reviewPlant.value = plant
  reviewData.value = {
    rating: 5,
    comment: ''
  }
  reviewError.value = null
  showReviewModal.value = true
}

const closeReviewModal = () => {
  showReviewModal.value = false
  reviewPlant.value = null
  reviewData.value = {
    rating: 5,
    comment: ''
  }
  reviewError.value = null
}

const submitReview = async () => {
  if (!reviewData.value.rating) {
    reviewError.value = 'Rating harus diisi'
    return
  }

  isSubmittingReview.value = true
  reviewError.value = null

  try {
    await reviewStore.createReview({
      plant_id: reviewPlant.value.id,
      order_id: props.id,
      rating: reviewData.value.rating,
      comment: reviewData.value.comment
    })

    // Add to existing reviews to prevent duplicate
    existingReviews.value.push(reviewPlant.value.id)

    alert('Ulasan berhasil dikirim! Terima kasih atas feedback Anda.')
    closeReviewModal()
  } catch {
    reviewError.value = reviewStore.error || 'Gagal mengirim ulasan. Silakan coba lagi.'
  } finally {
    isSubmittingReview.value = false
  }
}

// Load existing reviews when order loads
const loadExistingReviews = async () => {
  if (!order.value) return

  try {
    const myReviewsData = await reviewStore.fetchMyReviews()
    const orderReviews = myReviewsData.data?.filter(r => r.order_id === order.value.id) || []
    existingReviews.value = orderReviews.map(r => r.plant_id)
  } catch (error) {
    console.error('Error loading existing reviews:', error)
  }
}

onMounted(async () => {
  await orderStore.fetchOrder(props.id)
  if (canReview.value) {
    loadExistingReviews()
  }
})

const statusClass = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20'
    case 'confirmed':
      return 'bg-blue-50 text-blue-800 ring-1 ring-inset ring-blue-600/20'
    case 'completed':
      return 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-600/20'
    case 'canceled':
      return 'bg-red-100 text-red-800 ring-1 ring-inset ring-red-600/20'
    default:
      return 'bg-gray-100 text-gray-800 ring-1 ring-inset ring-gray-600/20'
  }
}

const statusLabel = (status) => {
  const labels = {
    pending: 'Menunggu Konfirmasi',
    confirmed: 'Dikonfirmasi',
    completed: 'Selesai',
    canceled: 'Dibatalkan'
  }
  return labels[status] || status
}

const handleCancelOrder = async () => {
  if (!confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
    return
  }

  const reason = prompt('Silakan berikan alasan pembatalan:')
  if (!reason || reason.trim() === '') {
    alert('Alasan pembatalan harus diisi.')
    return
  }

  isCanceling.value = true
  try {
    await orderStore.cancelOrder(props.id, reason.trim())
    alert('Pesanan berhasil dibatalkan.')
  } catch {
    alert(orderStore.error || 'Gagal membatalkan pesanan.')
  } finally {
    isCanceling.value = false
  }
}

const handleDownloadInvoice = async () => {
  isDownloadingInvoice.value = true
  try {
    const invoice = await orderStore.getInvoice(props.id)

    // Create a simple invoice display
    const invoiceContent = `
      INVOICE - ${invoice.invoice_number}
      =====================================

      Penerima: ${invoice.recipient_name}
      Telepon: ${invoice.recipient_phone}
      Alamat: ${invoice.shipping_address}

      Items:
      ${invoice.order_details.map(item =>
        `${item.plant.name} (${item.quantity}x) - Rp ${parseFloat(item.price).toLocaleString('id-ID')}`
      ).join('\n')}

      Subtotal: Rp ${parseFloat(invoice.total_price).toLocaleString('id-ID')}
      Biaya Kirim: Rp ${parseFloat(invoice.shipping_cost).toLocaleString('id-ID')}

      TOTAL: Rp ${parseFloat(invoice.grand_total).toLocaleString('id-ID')}

      Status: ${statusLabel(invoice.status)}
      Tanggal: ${new Date(invoice.created_at).toLocaleString('id-ID')}
    `

    // Download as text file
    const blob = new Blob([invoiceContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Invoice-${invoice.invoice_number}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

  } catch {
    alert(orderStore.error || 'Gagal mengunduh invoice.')
  } finally {
    isDownloadingInvoice.value = false
  }
}
</script>
