<template>
  <div class="container mx-auto px-4 py-4 sm:py-8">
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Riwayat Pesanan Saya</h1>

    <div v-if="orderStore.isLoading" class="text-center text-gray-700 py-8">Memuat pesanan...</div>

    <div v-else-if="orderStore.error" class="text-center text-red-600 font-medium py-8">
      {{ orderStore.error }}
    </div>

    <div v-else-if="orders.length === 0" class="text-center bg-white p-8 sm:p-10 rounded-lg shadow">
      <p class="text-gray-600 text-base sm:text-lg">Anda belum memiliki pesanan.</p>
    </div>

    <!-- Desktop Table View -->
    <div v-else class="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide">
              Order ID
            </th>
            <th class="px-6 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide">
              Tanggal
            </th>
            <th class="px-6 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide">
              Total
            </th>
            <th class="px-6 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide">
              Status
            </th>
            <th class="px-6 py-3 text-right font-semibold text-gray-700 uppercase tracking-wide">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in orders" :key="order.id">
            <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">#{{ order.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-800">
              {{ new Date(order.created_at).toLocaleDateString('id-ID') }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-800">
              Rp {{ parseFloat(order.total_price).toLocaleString('id-ID') }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs font-semibold leading-5 rounded-full"
                :class="statusClass(order.status)"
              >
                {{ order.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <RouterLink
                :to="`/pesanan/${order.id}`"
                class="text-green-600 hover:text-green-800 font-medium"
              >
                Lihat Detail
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Card View -->
    <div v-else class="md:hidden space-y-4">
      <div v-for="order in orders" :key="order.id" class="bg-white rounded-lg shadow-md p-4">
        <div class="flex justify-between items-start mb-3">
          <div>
            <p class="text-sm text-gray-600">Order ID</p>
            <p class="font-bold text-gray-900">#{{ order.id }}</p>
          </div>
          <span
            class="px-2 py-1 text-xs font-semibold rounded-full capitalize"
            :class="statusClass(order.status)"
          >
            {{ order.status }}
          </span>
        </div>

        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Tanggal:</span>
            <span class="text-gray-900 font-medium">
              {{ new Date(order.created_at).toLocaleDateString('id-ID') }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Total:</span>
            <span class="text-gray-900 font-bold">
              Rp {{ parseFloat(order.total_price).toLocaleString('id-ID') }}
            </span>
          </div>
        </div>

        <RouterLink
          :to="`/pesanan/${order.id}`"
          class="mt-4 block w-full text-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors"
        >
          Lihat Detail
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useOrderStore } from '@/stores/order'
import { RouterLink } from 'vue-router'

const orderStore = useOrderStore()
const orders = computed(() => orderStore.orders.data || [])

onMounted(() => {
  orderStore.fetchOrders()
})

const statusClass = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-300'
    case 'confirmed':
      return 'bg-blue-100 text-blue-800 ring-1 ring-blue-300'
    case 'completed':
      return 'bg-green-100 text-green-800 ring-1 ring-green-300'
    case 'canceled':
      return 'bg-red-100 text-red-800 ring-1 ring-red-300'
    default:
      return 'bg-gray-100 text-gray-800 ring-1 ring-gray-300'
  }
}
</script>
