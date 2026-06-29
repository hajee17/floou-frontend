// src/stores/adminUser.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/service/api'

export const useAdminUserStore = defineStore('adminUser', () => {
  const users = ref({ data: [], meta: {}, links: {} })
  const user = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  async function fetchUsers(params = {}) {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.get('/admin/users', { params })
      users.value = response.data.users
    } catch (e) {
      error.value = 'Gagal memuat daftar pengguna.'
      console.error('Fetch Users Error:', e.response)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUser(id) {
    isLoading.value = true
    user.value = null
    error.value = null
    try {
      const response = await apiClient.get(`/admin/users/${id}`)
      user.value = response.data.user
    } catch (e) {
      error.value = 'Gagal memuat detail pengguna.'
      console.error('Fetch User Error:', e.response)
    } finally {
      isLoading.value = false
    }
  }

  async function updateUser(id, userData) {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.put(`/admin/users/${id}`, userData)
      return response.data.user
    } catch (e) {
      error.value = e.response?.data?.message || 'Gagal memperbarui pengguna.'
      console.error('Update User Error:', e.response)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function deleteUser(id) {
    isLoading.value = true
    error.value = null
    try {
      await apiClient.delete(`/admin/users/${id}`)
      users.value.data = users.value.data.filter(u => u.id !== id)
    } catch (e) {
      error.value = e.response?.data?.message || 'Gagal menghapus pengguna.'
      console.error('Delete User Error:', e.response)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    users,
    user,
    isLoading,
    error,
    fetchUsers,
    fetchUser,
    updateUser,
    deleteUser,
  }
})
