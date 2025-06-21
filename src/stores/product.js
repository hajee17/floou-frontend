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

  // URL dasar untuk gambar, tanpa /api/
  const image_base_url = import.meta.env.VITE_IMAGE_STORAGE_URL + '/'

  async function fetchPlants(params = {}) {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.get('/plants', { params })
      // Menambahkan URL lengkap untuk gambar
      response.data.plants.data = response.data.plants.data.map((p) => ({
        ...p,
        imageUrl: image_base_url + p.image,
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
      response.data.plant.imageUrl = image_base_url + response.data.plant.image
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
    image_base_url,
  }
})
