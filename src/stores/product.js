// src/stores/product.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/service/api'

export const useProductStore = defineStore('product', () => {
  const plants = ref({ data: [], links: {}, meta: {} })
  const plant = ref(null)
  const categories = ref([])
  const plantTypes = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Base URL for images
  const image_base_url = import.meta.env.VITE_IMAGE_STORAGE_URL

  async function fetchPlants(params = {}) {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.get('/plants', { params })
      // Backend already includes image_url
      response.data.plants.data = response.data.plants.data.map((p) => ({
        ...p,
        imageUrl: p.image_url || (image_base_url + '/' + p.image),
      }))
      plants.value = response.data.plants
    } catch (e) {
      error.value = 'Gagal memuat tanaman.'
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchPlant(idOrSlug) {
    isLoading.value = true
    plant.value = null
    error.value = null
    try {
      console.log('Meminta data:', `/plants/${idOrSlug}`)
      const response = await apiClient.get(`/plants/${idOrSlug}`)
      console.log('Data diterima:', response.data)
      // Backend already includes image_url, but we can override if needed
      if (response.data.plant.image && !response.data.plant.image_url) {
        response.data.plant.imageUrl = image_base_url + '/' + response.data.plant.image
      } else {
        response.data.plant.imageUrl = response.data.plant.image_url
      }
      plant.value = response.data.plant
    } catch (e) {
      error.value = 'Tanaman tidak ditemukan.'
      console.error('Gagal ambil data tanaman:', e)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchCategories() {
    try {
      const response = await apiClient.get('/categories')
      categories.value = response.data.categories
    } catch (e) {
      console.error('Gagal memuat kategori:', e)
    }
  }

  async function fetchPlantTypes() {
    try {
      const response = await apiClient.get('/plant-types')
      plantTypes.value = response.data.plant_types
    } catch (e) {
      console.error('Gagal memuat tipe tanaman:', e)
    }
  }

  // Fungsi CRUD untuk Admin
  async function createPlant(formData) {
    // API membutuhkan multipart/form-data
    await apiClient.post('/plants', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  async function updatePlant(id, formData) {
    // API menggunakan POST untuk update juga
    formData.append('_method', 'POST') // Sesuai dokumentasi
    await apiClient.post(`/plants/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  async function deletePlant(id) {
    await apiClient.delete(`/plants/${id}`)
    await fetchPlants() // Muat ulang daftar setelah hapus
  }

  // Category CRUD
  async function createCategory(categoryData) {
    try {
      const response = await apiClient.post('/categories', categoryData)
      await fetchCategories()
      return response.data.category
    } catch (e) {
      console.error('Create Category Error:', e.response)
      throw new Error(e.response?.data?.message || 'Gagal membuat kategori.')
    }
  }

  async function updateCategory(id, categoryData) {
    try {
      const response = await apiClient.put(`/categories/${id}`, categoryData)
      await fetchCategories()
      return response.data.category
    } catch (e) {
      console.error('Update Category Error:', e.response)
      throw new Error(e.response?.data?.message || 'Gagal memperbarui kategori.')
    }
  }

  async function deleteCategory(id) {
    try {
      await apiClient.delete(`/categories/${id}`)
      await fetchCategories()
    } catch (e) {
      console.error('Delete Category Error:', e.response)
      throw new Error(e.response?.data?.message || 'Gagal menghapus kategori.')
    }
  }

  // Plant Type CRUD
  async function createPlantType(plantTypeData) {
    try {
      const response = await apiClient.post('/plant-types', plantTypeData)
      await fetchPlantTypes()
      return response.data.plant_type
    } catch (e) {
      console.error('Create Plant Type Error:', e.response)
      throw new Error(e.response?.data?.message || 'Gagal membuat tipe tanaman.')
    }
  }

  async function updatePlantType(id, plantTypeData) {
    try {
      const response = await apiClient.put(`/plant-types/${id}`, plantTypeData)
      await fetchPlantTypes()
      return response.data.plant_type
    } catch (e) {
      console.error('Update Plant Type Error:', e.response)
      throw new Error(e.response?.data?.message || 'Gagal memperbarui tipe tanaman.')
    }
  }

  async function deletePlantType(id) {
    try {
      await apiClient.delete(`/plant-types/${id}`)
      await fetchPlantTypes()
    } catch (e) {
      console.error('Delete Plant Type Error:', e.response)
      throw new Error(e.response?.data?.message || 'Gagal menghapus tipe tanaman.')
    }
  }

  return {
    plants,
    plant,
    categories,
    plantTypes,
    isLoading,
    error,
    fetchPlants,
    fetchPlant,
    fetchCategories,
    fetchPlantTypes,
    createPlant,
    updatePlant,
    deletePlant,
    createCategory,
    updateCategory,
    deleteCategory,
    createPlantType,
    updatePlantType,
    deletePlantType,
    image_base_url,
  }
})
