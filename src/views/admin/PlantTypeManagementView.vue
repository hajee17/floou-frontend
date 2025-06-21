<template>
  <div class="space-y-6 px-4 sm:px-8 lg:px-16 py-10 bg-[#F9F5F2] min-h-screen">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-800">Kelola Tipe Tanaman</h1>
      <button
        @click="openForm()"
        class="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700"
      >
        Tambah Tipe
      </button>
    </div>

    <!-- Form Tambah/Edit -->
    <div v-if="showForm" class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 class="text-xl font-bold text-gray-800 mb-4">
        {{ isEditing ? 'Edit Tipe Tanaman' : 'Tambah Tipe Tanaman Baru' }}
      </h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700">Nama Tipe</label>
          <input
            v-model="form.name"
            type="text"
            id="name"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900"
            required
          />
        </div>
        <div class="flex gap-4">
          <button
            type="submit"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Simpan
          </button>
          <button
            type="button"
            @click="closeForm"
            class="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Batal
          </button>
        </div>
      </form>
    </div>

    <!-- Loading & Tabel -->
    <div v-if="isLoading" class="text-center text-gray-700">Memuat data...</div>
    <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
      <table class="w-full text-left text-sm text-gray-800">
        <thead class="bg-gray-100 text-gray-900 font-semibold">
          <tr class="border-b">
            <th class="p-4">ID</th>
            <th class="p-4">Nama</th>
            <th class="p-4">Slug</th>
            <th class="p-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="type in plantTypes"
            :key="type.id"
            class="border-b hover:bg-gray-50 transition"
          >
            <td class="p-4 font-medium">{{ type.id }}</td>
            <td class="p-4">{{ type.name }}</td>
            <td class="p-4 text-gray-600 italic">{{ type.slug }}</td>
            <td class="p-4 text-right space-x-2">
              <button @click="openForm(type)" class="text-blue-600 hover:text-blue-900">
                Edit
              </button>
              <button
                @click="handleDelete(type.id, type.name)"
                class="text-red-600 hover:text-red-900"
              >
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useProductStore } from '@/stores/product'
import apiClient from '@/service/api'

const productStore = useProductStore()
const plantTypes = computed(() => productStore.plantTypes)
const isLoading = ref(true)

const showForm = ref(false)
const isEditing = ref(false)
const form = ref({ id: null, name: '' })

onMounted(async () => {
  isLoading.value = true
  await productStore.fetchPlantTypes()
  isLoading.value = false
})

function openForm(type = null) {
  if (type) {
    isEditing.value = true
    form.value = { id: type.id, name: type.name }
  } else {
    isEditing.value = false
    form.value = { id: null, name: '' }
  }
  showForm.value = true
}

function closeForm() {
  showForm.value = false
}

async function handleSubmit() {
  try {
    if (isEditing.value) {
      await apiClient.put(`/plant-types/${form.value.id}`, { name: form.value.name })
    } else {
      await apiClient.post('/plant-types', { name: form.value.name })
    }
    await productStore.fetchPlantTypes() // Refresh list
    closeForm()
  } catch (error) {
    console.error('Gagal menyimpan tipe tanaman:', error)
    alert('Gagal menyimpan tipe tanaman.')
  }
}

async function handleDelete(id, name) {
  if (confirm(`Apakah Anda yakin ingin menghapus tipe "${name}"?`)) {
    try {
      await apiClient.delete(`/plant-types/${id}`)
      await productStore.fetchPlantTypes() // Refresh list
    } catch (error) {
      console.error('Gagal menghapus tipe tanaman:', error)
      alert('Gagal menghapus tipe tanaman. Mungkin tipe ini masih digunakan oleh produk.')
    }
  }
}
</script>
