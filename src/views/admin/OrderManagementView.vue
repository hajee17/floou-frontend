<template>
    <div class="space-y-6">
        <h1 class="text-3xl font-bold">Manajemen Pesanan</h1>

        <div v-if="orderStore.isLoading" class="text-center">Memuat pesanan...</div>
        <div v-else-if="orderStore.error" class="text-center text-red-500">{{ orderStore.error }}</div>
        <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead class="bg-green-100 text-green-800 font-semibold">
                        <tr>
                            <th class="p-4">Order ID</th>
                            <th class="p-4">Pengguna</th>
                            <th class="p-4">Alamat</th>
                            <th class="p-4">Total</th>
                            <th class="p-4">Tanggal</th>
                            <th class="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="order in orders" :key="order.id" class="border-b hover:bg-gray-50">
                            <td class="p-4 font-medium text-gray-800">#{{ order.id }}</td>
                            <td class="p-4 text-gray-600">{{ order.user.name }}<br><span class="text-xs text-gray-400">{{ order.user.email }}</span></td>
                            <td class="p-4 text-gray-600 max-w-xs truncate">{{ order.shipping_address }}</td>
                            <td class="p-4 font-medium text-gray-800">Rp {{ parseFloat(order.total_price).toLocaleString('id-ID') }}</td>
                            <td class="p-4 text-gray-600">{{ new Date(order.created_at).toLocaleString('id-ID') }}</td>
                            <td class="p-4">
                                <select v-model="order.status" @change="handleStatusChange(order.id, $event.target.value)" class="p-1 rounded-md border-gray-300 text-xs">
                                    <option value="pending">pending</option>
                                    <option value="confirmed">confirmed</option>
                                    <option value="completed">completed</option>
                                    <option value="canceled">canceled</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="p-4 flex justify-between items-center text-sm text-gray-600">
                <p>Menampilkan {{ orderStore.orders.from }} - {{ orderStore.orders.to }} dari {{ orderStore.orders.total }} data</p>
                <div class="flex gap-1">
                    <button v-for="link in orderStore.orders.links" :key="link.label" @click="goToPage(link.url)" :disabled="!link.url" v-html="link.label" class="px-3 py-1 border rounded" :class="{ 'bg-green-600 text-white': link.active, 'hover:bg-gray-200': link.url, 'text-gray-400': !link.url }"></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useOrderStore } from '@/stores/order';

const orderStore = useOrderStore();
const orders = computed(() => orderStore.orders.data || []);

onMounted(() => {
    orderStore.fetchOrders();
});

async function handleStatusChange(orderId, newStatus) {
    try {
        await orderStore.updateOrderStatus(orderId, newStatus);
        alert(`Status pesanan #${orderId} berhasil diubah menjadi ${newStatus}.`);
        // Refresh the list to reflect changes for all data
        orderStore.fetchOrders({ page: orderStore.orders.current_page });
    } catch (error) {
        alert('Gagal mengubah status pesanan.');
        console.error(error);
    }
}

function goToPage(url) {
    if (!url) return;
    const pageNumber = new URL(url).searchParams.get('page');
    orderStore.fetchOrders({ page: pageNumber });
}
</script>