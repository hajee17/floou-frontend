<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Profil Saya</h1>

      <div class="bg-white rounded-lg shadow p-6">
        <div v-if="!isEditing" class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-500">Nama</label>
            <p class="text-lg">{{ user?.name }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">Email</label>
            <p class="text-lg">{{ user?.email }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">Telepon</label>
            <p class="text-lg">{{ user?.phone || '-' }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">Alamat</label>
            <p class="text-lg">{{ user?.address || '-' }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">Role</label>
            <p class="text-lg capitalize">{{ user?.role }}</p>
          </div>
          <button
            @click="startEdit"
            class="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Edit Profil
          </button>
        </div>

        <form v-else @submit.prevent="saveProfile" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="formData.email"
              type="email"
              required
              class="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
            <input
              v-model="formData.phone"
              type="text"
              class="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
            <textarea
              v-model="formData.address"
              rows="3"
              class="w-full border rounded-lg px-3 py-2"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Password Baru (opsional)
            </label>
            <input
              v-model="formData.password"
              type="password"
              class="w-full border rounded-lg px-3 py-2"
              placeholder="Kosongkan jika tidak ingin mengubah"
            />
          </div>
          <div v-if="formData.password">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Konfirmasi Password
            </label>
            <input
              v-model="formData.password_confirmation"
              type="password"
              class="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div class="flex gap-2">
            <button
              type="submit"
              :disabled="isLoading"
              class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {{ isLoading ? 'Menyimpan...' : 'Simpan' }}
            </button>
            <button
              type="button"
              @click="cancelEdit"
              class="px-6 py-2 text-gray-600 hover:text-gray-800"
            >
              Batal
            </button>
          </div>
          <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import apiClient from '@/service/api'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const isEditing = ref(false)
const isLoading = ref(false)
const error = ref(null)

const formData = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  password_confirmation: '',
})

function startEdit() {
  formData.value = {
    name: user.value?.name || '',
    email: user.value?.email || '',
    phone: user.value?.phone || '',
    address: user.value?.address || '',
    password: '',
    password_confirmation: '',
  }
  isEditing.value = true
  error.value = null
}

function cancelEdit() {
  isEditing.value = false
  error.value = null
}

async function saveProfile() {
  isLoading.value = true
  error.value = null
  try {
    const payload = {
      name: formData.value.name,
      email: formData.value.email,
      phone: formData.value.phone,
      address: formData.value.address,
    }

    if (formData.value.password) {
      payload.password = formData.value.password
      payload.password_confirmation = formData.value.password_confirmation
    }

    const response = await apiClient.put(`/admin/users/${user.value.id}`, payload)

    // Update local user data
    localStorage.setItem('user', JSON.stringify(response.data.user))
    authStore.user = response.data.user

    isEditing.value = false
    alert('Profil berhasil diperbarui')
  } catch (e) {
    error.value = e.response?.data?.message || 'Gagal memperbarui profil'
    console.error('Update Profile Error:', e.response)
  } finally {
    isLoading.value = false
  }
}
</script>
