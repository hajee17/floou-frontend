<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="orderStore.isLoading" class="text-center p-10">
      <p>Memuat detail pesanan...</p>
    </div>
    <div v-else-if="orderStore.error" class="text-center p-10 text-red-500">
      <p>{{ orderStore.error }}</p>
    </div>
    <div v-else-if="order" class="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Detail Pesanan #{{ order.id }}</h1>
          <p class="text-sm text-gray-500">Dipesan pada: {{ new Date(order.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short'}) }}</p>
        </div>
        <span class="px-3 py-1 text-sm font-semibold rounded-full capitalize" :class="statusClass(order.status)">
          {{ order.status }}
        </span>
      </div>

      <hr class="my-6">

      <div class="grid md:grid-cols-2 gap-8">
        <div>
          <h2 class="text-lg font-semibold mb-2">Alamat Pengiriman</h2>
          <p class="text-gray-700">{{ order.shipping_address }}</p>
          <p v-if="order.notes" class="text-sm text-gray-500 mt-2"><strong>Catatan:</strong> {{ order.notes }}</p>
        </div>
        <div>
          <h2 class="text-lg font-semibold mb-2">Info Pembayaran</h2>
          <p class="text-gray-700">Metode: QRIS (Contoh)</p>
          <p class="text-gray-700 font-bold">Total: Rp {{ parseFloat(order.total_price).toLocaleString('id-ID') }}</p>
        </div>
      </div>

      <hr class="my-6">

      <div>
        <h2 class="text-lg font-semibold mb-4">Item yang Dipesan</h2>
        <div class="space-y-4">
          <div v-for="item in order.order_details" :key="item.id" class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <img :src="productStore.image_base_url + item.plant.image" :alt="item.plant.name" class="w-16 h-16 object-cover rounded-md border">
              <div>
                <p class="font-medium text-gray-800">{{ item.plant.name }}</p>
                <p class="text-sm text-gray-600">{{ item.quantity }} x Rp {{ parseFloat(item.price).toLocaleString('id-ID') }}</p>
              </div>
            </div>
            <p class="font-semibold text-gray-800">Rp {{ (item.quantity * item.price).toLocaleString('id-ID') }}</p>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useOrderStore } from '@/stores/order';
import { useProductStore } from '@/stores/product';

const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
});

const orderStore = useOrderStore();
const productStore = useProductStore(); // Untuk base URL gambar
const order = computed(() => orderStore.order);

onMounted(() => {
  orderStore.fetchOrder(props.id);
});

const statusClass = (status) => {
    switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'confirmed': return 'bg-blue-100 text-blue-800';
    case 'completed': return 'bg-green-100 text-green-800';
    case 'canceled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
</script>