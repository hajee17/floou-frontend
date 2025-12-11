// src/stores/dashboard.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/service/api'

export const useDashboardStore = defineStore('dashboard', () => {
  const statistics = ref({
    total_users: 0,
    total_plants: 0,
    total_orders: 0,
    order_status_counts: {
      pending: 0,
      confirmed: 0,
      completed: 0,
      canceled: 0,
    },
  })
  const lowStockPlants = ref([])
  const recentOrders = ref([])
  const salesStats = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  async function fetchDashboardData() {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.get('/dashboard')
      statistics.value = response.data.statistics
      lowStockPlants.value = response.data.low_stock_plants || []
      recentOrders.value = response.data.recent_orders || []
      salesStats.value = response.data.sales_stats || []
    } catch (e) {
      error.value = 'Gagal memuat data dashboard.'
      console.error('Fetch Dashboard Error:', e.response)
    } finally {
      isLoading.value = false
    }
  }

  return {
    statistics,
    lowStockPlants,
    recentOrders,
    salesStats,
    isLoading,
    error,
    fetchDashboardData,
  }
})
