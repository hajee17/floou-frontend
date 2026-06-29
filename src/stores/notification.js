// src/stores/notification.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '@/service/api'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref({ data: [], meta: {}, links: {} })
  const isLoading = ref(false)
  const error = ref(null)

  const unreadCount = computed(() => {
    return notifications.value.data.filter(n => !n.is_read).length
  })

  async function fetchNotifications(params = {}) {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.get('/notifications', { params })
      notifications.value = response.data.notifications
    } catch (e) {
      error.value = 'Gagal memuat notifikasi.'
      console.error('Fetch Notifications Error:', e.response)
    } finally {
      isLoading.value = false
    }
  }

  async function markAsRead(id) {
    try {
      await apiClient.patch(`/notifications/${id}/read`)
      const notification = notifications.value.data.find(n => n.id === id)
      if (notification) {
        notification.is_read = true
      }
    } catch (e) {
      console.error('Mark as Read Error:', e.response)
      throw new Error(e.response?.data?.message || 'Gagal menandai notifikasi sebagai dibaca.')
    }
  }

  async function markAllAsRead() {
    try {
      await apiClient.patch('/notifications/read-all')
      notifications.value.data.forEach(n => {
        n.is_read = true
      })
    } catch (e) {
      console.error('Mark All as Read Error:', e.response)
      throw new Error(e.response?.data?.message || 'Gagal menandai semua notifikasi sebagai dibaca.')
    }
  }

  async function deleteNotification(id) {
    try {
      await apiClient.delete(`/notifications/${id}`)
      notifications.value.data = notifications.value.data.filter(n => n.id !== id)
    } catch (e) {
      console.error('Delete Notification Error:', e.response)
      throw new Error(e.response?.data?.message || 'Gagal menghapus notifikasi.')
    }
  }

  async function deleteAllNotifications() {
    try {
      await apiClient.delete('/notifications')
      notifications.value.data = []
    } catch (e) {
      console.error('Delete All Notifications Error:', e.response)
      throw new Error(e.response?.data?.message || 'Gagal menghapus semua notifikasi.')
    }
  }

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  }
})
