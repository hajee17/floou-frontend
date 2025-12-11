<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Notifikasi</h1>
        <div class="flex gap-2">
          <button
            @click="handleMarkAllAsRead"
            :disabled="unreadCount === 0"
            class="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
          >
            Tandai Semua Dibaca
          </button>
          <button
            @click="handleDeleteAll"
            :disabled="notifications.data.length === 0"
            class="px-4 py-2 text-sm text-red-600 hover:text-red-800 disabled:text-gray-400"
          >
            Hapus Semua
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="text-center py-12">
        <p class="text-gray-500">Memuat notifikasi...</p>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-500">{{ error }}</p>
      </div>

      <div v-else-if="notifications.data.length === 0" class="text-center py-12">
        <p class="text-gray-500">Tidak ada notifikasi</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="notification in notifications.data"
          :key="notification.id"
          :class="[
            'bg-white p-4 rounded-lg shadow',
            !notification.is_read ? 'border-l-4 border-blue-500' : '',
          ]"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <p class="text-gray-800">{{ notification.message }}</p>
              <p class="text-sm text-gray-500 mt-1">
                {{ formatDate(notification.created_at) }}
              </p>
            </div>
            <div class="flex gap-2 ml-4">
              <button
                v-if="!notification.is_read"
                @click="handleMarkAsRead(notification.id)"
                class="text-sm text-blue-600 hover:text-blue-800"
              >
                Tandai Dibaca
              </button>
              <button
                @click="handleDelete(notification.id)"
                class="text-sm text-red-600 hover:text-red-800"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="notifications.data.length > 0" class="mt-6 flex justify-center">
        <nav class="flex gap-2">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="loadPage(page)"
            :class="[
              'px-4 py-2 rounded',
              page === currentPage
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100',
            ]"
          >
            {{ page }}
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()
const { notifications, unreadCount, isLoading, error } = notificationStore

const currentPage = computed(() => notifications.value.meta?.current_page || 1)
const totalPages = computed(() => notifications.value.meta?.last_page || 1)

onMounted(() => {
  notificationStore.fetchNotifications()
})

function loadPage(page) {
  notificationStore.fetchNotifications({ page })
}

async function handleMarkAsRead(id) {
  try {
    await notificationStore.markAsRead(id)
  } catch {
    alert('Gagal menandai notifikasi sebagai dibaca')
  }
}

async function handleMarkAllAsRead() {
  try {
    await notificationStore.markAllAsRead()
  } catch {
    alert('Gagal menandai semua notifikasi sebagai dibaca')
  }
}

async function handleDelete(id) {
  if (confirm('Apakah Anda yakin ingin menghapus notifikasi ini?')) {
    try {
      await notificationStore.deleteNotification(id)
    } catch {
      alert('Gagal menghapus notifikasi')
    }
  }
}

async function handleDeleteAll() {
  if (confirm('Apakah Anda yakin ingin menghapus semua notifikasi?')) {
    try {
      await notificationStore.deleteAllNotifications()
    } catch {
      alert('Gagal menghapus semua notifikasi')
    }
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
