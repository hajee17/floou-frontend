// src/stores/review.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/service/api'

export const useReviewStore = defineStore('review', () => {
  const reviews = ref({ data: [], meta: {}, links: {} })
  const myReviews = ref({ data: [], meta: {}, links: {} })
  const isLoading = ref(false)
  const error = ref(null)

  async function fetchPlantReviews(plantId, params = {}) {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.get(`/plants/${plantId}/reviews`, { params })
      reviews.value = response.data.reviews
      return response.data.reviews
    } catch (e) {
      error.value = 'Gagal memuat ulasan.'
      console.error('Fetch Plant Reviews Error:', e.response)
      return { data: [], last_page: 1 }
    } finally {
      isLoading.value = false
    }
  }

  async function createReview(reviewData) {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.post('/reviews', reviewData)
      return response.data.review
    } catch (e) {
      error.value = e.response?.data?.message || 'Gagal membuat ulasan.'
      console.error('Create Review Error:', e.response)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function updateReview(id, reviewData) {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.put(`/reviews/${id}`, reviewData)
      return response.data.review
    } catch (e) {
      error.value = e.response?.data?.message || 'Gagal memperbarui ulasan.'
      console.error('Update Review Error:', e.response)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function deleteReview(id) {
    isLoading.value = true
    error.value = null
    try {
      await apiClient.delete(`/reviews/${id}`)
    } catch (e) {
      error.value = e.response?.data?.message || 'Gagal menghapus ulasan.'
      console.error('Delete Review Error:', e.response)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function fetchMyReviews(params = {}) {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.get('/my-reviews', { params })
      myReviews.value = response.data.reviews
      return response.data.reviews
    } catch (e) {
      error.value = 'Gagal memuat ulasan Anda.'
      console.error('Fetch My Reviews Error:', e.response)
      return { data: [] }
    } finally {
      isLoading.value = false
    }
  }

  return {
    reviews,
    myReviews,
    isLoading,
    error,
    fetchPlantReviews,
    createReview,
    updateReview,
    deleteReview,
    fetchMyReviews,
  }
})
