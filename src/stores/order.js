// src/stores/order.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/service/api'
import { useCartStore } from './cart'
import router from '@/router'

export const useOrderStore = defineStore('order', () => {
  const orders = ref({ data: [], meta: {}, links: {} })
  const order = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // ... (fungsi createOrder, dll. tidak perlu diubah)
  async function createOrder(orderDetails) {
    isLoading.value = true
    error.value = null
    const cartStore = useCartStore()

    try {
      const payload = {
        shipping_address: orderDetails.shipping_address,
        notes: orderDetails.notes || '',
        items: cartStore.items.map((item) => ({
          plant_id: item.id,
          quantity: item.quantity,
        })),
      }
      const response = await apiClient.post('/orders', payload)
      order.value = response.data.order

      cartStore.clearCart()
      router.push({ name: 'order-detail', params: { id: response.data.order.id } })
    } catch (e) {
      error.value = e.response?.data?.message || 'Gagal membuat pesanan.'
      console.error('Create Order Error:', e.response)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchOrders(params = {}) {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.get('/orders', { params })

      // ==================================================================
      // PERUBAHAN UTAMA DI SINI:
      // Kita mengambil data dari dalam properti "orders" sesuai struktur API Anda.
      // ==================================================================
      orders.value = response.data.orders || { data: [], meta: {}, links: {} }
    } catch (e) {
      error.value = 'Gagal memuat riwayat pesanan.'
      console.error('Fetch Orders Error:', e.response)
      orders.value = { data: [], meta: {}, links: {} }
    } finally {
      isLoading.value = false
    }
  }

  async function fetchOrder(id) {
    isLoading.value = true
    order.value = null
    error.value = null
    try {
      const response = await apiClient.get(`/orders/${id}`)
      order.value = response.data.order
    } catch (e) {
      error.value = 'Gagal memuat detail pesanan atau pesanan tidak ditemukan.'
      console.error('Fetch Order Error:', e.response)
    } finally {
      isLoading.value = false
    }
  }

  async function updateOrderStatus(id, status) {
    try {
      const response = await apiClient.patch(`/orders/${id}/status`, { status })
      const updatedOrder = response.data.order

      if (orders.value.data && orders.value.data.length > 0) {
        const index = orders.value.data.findIndex((o) => o.id === updatedOrder.id)
        if (index !== -1) {
          orders.value.data[index] = updatedOrder
        }
      }

      if (order.value && order.value.id === updatedOrder.id) {
        order.value = updatedOrder
      }
    } catch (e) {
      console.error('Update Order Status Error:', e.response)
      throw new Error(e.response?.data?.message || 'Gagal memperbarui status pesanan.')
    }
  }

  // ... (fungsi cancelOrder tidak perlu diubah)
  async function cancelOrder(id) {
    isLoading.value = true
    try {
      await updateOrderStatus(id, 'canceled')
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
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
  }
})
