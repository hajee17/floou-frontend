<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="orderStore.isLoading" class="text-center p-10 text-gray-800">
      <p>Memuat detail pesanan...</p>
    </div>

    <div v-else-if="orderStore.error" class="text-center p-10 text-red-600 font-medium">
      <p>{{ orderStore.error }}</p>
    </div>

    <div
      v-else-if="order"
      class="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-4xl mx-auto text-gray-900"
    >
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 class="text-2xl font-bold">Detail Pesanan #{{ order.id }}</h1>
          <p class="text-sm text-gray-700">
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
          {{ order.status }}
        </span>
      </div>

      <hr class="my-6" />

      <!-- Shipping + Payment -->
      <div class="grid md:grid-cols-2 gap-8">
        <div>
          <h2 class="text-lg font-semibold mb-2">Alamat Pengiriman</h2>
          <p class="text-gray-800 whitespace-pre-line">{{ order.shipping_address }}</p>
          <p v-if="order.notes" class="text-sm text-gray-700 mt-2">
            <strong>Catatan:</strong> {{ order.notes }}
          </p>
        </div>
        <div>
        <h2 class="text-lg font-semibold mb-2">Info Pembayaran</h2>
        <p class="text-gray-800">Metode: <span class="font-medium">QRIS</span></p>
        <p class="text-gray-900 font-bold mt-1">
          Total: Rp {{ parseFloat(order.total_price).toLocaleString('id-ID') }}
        </p>

        <div v-if="order.status === 'pending'" class="mt-4 border-t pt-4">
          <p class="text-sm font-semibold text-gray-800 mb-2">
              Silakan pindai kode di bawah ini untuk membayar:
          </p>
          <img src="/images/qris-toko.jpg" alt="QRIS Pembayaran" class="w-48 h-48 border rounded-md" />
          <p class="text-xs text-gray-600 mt-2">
              PENTING: Mohon transfer sesuai jumlah total di atas.
          </p>
        </div>
        </div>

      </div>

      <hr class="my-6" />

      <!-- Item List -->
      <div>
        <h2 class="text-lg font-semibold mb-4">Item yang Dipesan</h2>
        <div class="space-y-4">
          <div
            v-for="item in order.order_details"
            :key="item.id"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-4">
              <img
                :src="productStore.image_base_url + item.plant.image"
                :alt="item.plant.name"
                class="w-16 h-16 object-cover rounded-md border"
              />
              <div>
                <p class="font-medium text-gray-900">{{ item.plant.name }}</p>
                <p class="text-sm text-gray-700">
                  {{ item.quantity }} x Rp {{ parseFloat(item.price).toLocaleString('id-ID') }}
                </p>
              </div>
            </div>
            <p class="font-semibold text-gray-900">
              Rp {{ (item.quantity * item.price).toLocaleString('id-ID') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useOrderStore } from '@/stores/order'
import { useProductStore } from '@/stores/product'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
})

const orderStore = useOrderStore()
const productStore = useProductStore()
const order = computed(() => orderStore.order)

onMounted(() => {
  orderStore.fetchOrder(props.id)
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
</script>
