// src/stores/order.js
import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "@/service/api";
import { useCartStore } from "./cart";
import router from "@/router";

export const useOrderStore = defineStore("order", () => {
  const orders = ref({ data: [], meta: {} });
  const order = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  async function createOrder(orderDetails) {
    isLoading.value = true;
    error.value = null;
    const cartStore = useCartStore();

    try {
      const payload = {
        shipping_address: orderDetails.shipping_address,
        notes: orderDetails.notes || "",
        items: cartStore.items.map((item) => ({
          plant_id: item.id,
          quantity: item.quantity,
        })),
      };
      const response = await apiClient.post("/orders", payload);
      order.value = response.data.order;

      cartStore.clearCart(); // Kosongkan keranjang setelah berhasil
      // Redirect ke halaman detail pesanan yang baru dibuat
      router.push({ name: "order-detail", params: { id: response.data.order.id } });
    } catch (e) {
      error.value = e.response?.data?.message || "Gagal membuat pesanan.";
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchOrders(params = {}) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get("/orders", { params });
      orders.value = response.data; // API response sudah punya struktur paginasi
    } catch (e) {
      error.value = "Gagal memuat riwayat pesanan.";
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchOrder(id) {
    isLoading.value = true;
    order.value = null;
    error.value = null;
    try {
      const response = await apiClient.get(`/orders/${id}`);
      order.value = response.data.order;
    } catch (e) {
      error.value = "Gagal memuat detail pesanan.";
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function cancelOrder(id) {
    // ... implementasi untuk membatalkan pesanan
  }

  // Admin functions
  async function updateOrderStatus(id, status) {
    await apiClient.patch(`/orders/${id}/status`, { status });
    await fetchOrder(id); // Muat ulang detail
  }

  return {
    orders,
    order,
    isLoading,
    error,
    createOrder,
    fetchOrders,
    fetchOrder,
    cancelOrder,
    updateOrderStatus,
  };
});
