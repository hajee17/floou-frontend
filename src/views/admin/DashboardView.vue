<template>
  <div class="space-y-10">
    <h1 class="text-3xl font-bold">Dashboard</h1>
    <div v-if="isLoading" class="text-center">Loading dashboard data...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="stats" class="space-y-10">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-green-600 rounded-xl p-6 text-white flex items-center gap-6">
          <div class="bg-white/30 p-3 rounded-lg"><UsersIcon class="h-8 w-8" /></div>
          <div>
            <p class="text-sm">Total Pengguna</p>
            <p class="text-2xl font-bold">{{ stats.statistics.total_users }}</p>
          </div>
        </div>
        <div class="bg-blue-600 rounded-xl p-6 text-white flex items-center gap-6">
          <div class="bg-white/30 p-3 rounded-lg"><ArchiveBoxIcon class="h-8 w-8" /></div>
          <div>
            <p class="text-sm">Total Tanaman</p>
            <p class="text-2xl font-bold">{{ stats.statistics.total_plants }}</p>
          </div>
        </div>
        <div class="bg-yellow-500 rounded-xl p-6 text-white flex items-center gap-6">
          <div class="bg-white/30 p-3 rounded-lg"><ShoppingCartIcon class="h-8 w-8" /></div>
          <div>
            <p class="text-sm">Total Pesanan</p>
            <p class="text-2xl font-bold">{{ stats.statistics.total_orders }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
          <h2 class="font-bold text-lg mb-4">Pesanan Terbaru</h2>
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b">
                <th class="py-2">Order ID</th>
                <th class="py-2">Status</th>
                <th class="py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in stats.recent_orders" :key="order.id" class="border-b">
                <td class="py-2 font-medium">#{{ order.id }}</td>
                <td class="py-2">
                  <span class="px-2 py-1 text-xs rounded-full" :class="statusClass(order.status)">{{
                    order.status
                  }}</span>
                </td>
                <td class="py-2">Rp {{ parseFloat(order.total_price).toLocaleString("id-ID") }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm">
          <h2 class="font-bold text-lg mb-4">Stok Menipis</h2>
          <ul>
            <li
              v-for="plant in stats.low_stock_plants"
              :key="plant.id"
              class="flex justify-between items-center py-2 border-b"
            >
              <span>{{ plant.name }}</span>
              <span class="font-bold text-red-500">{{ plant.stock }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import apiClient from "@/service/api";
import { UsersIcon, ArchiveBoxIcon, ShoppingCartIcon } from "@heroicons/vue/24/outline";

const stats = ref(null);
const isLoading = ref(true);
const error = ref(null);

async function fetchDashboardData() {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await apiClient.get("/dashboard");
    stats.value = response.data;
  } catch (e) {
    error.value = "Gagal memuat data dashboard.";
    console.error(e);
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchDashboardData);

const statusClass = (status) => {
  // Sama seperti di OrderHistory.vue
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "canceled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
</script>
