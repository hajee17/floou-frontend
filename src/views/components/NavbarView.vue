<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <nav class="container mx-auto px-4 lg:px-6 py-3 flex justify-between items-center">
      <RouterLink to="/" class="flex items-center space-x-2">
        <svg width="32" height="32" viewBox="0 0 24 24" class="text-green-600">
          <path
            fill="currentColor"
            d="M12.9 4.8c-.7-.1-1.3.4-1.4 1.1c-1.1 5.4-4.5 9.4-9.3 11.5c-.6.2-1 .8-.8 1.4c.2.6.8 1 1.4.8c5.4-2.3 9.2-6.8 10.4-12.8c.1-.7-.4-1.3-1.1-1.4c-.1 0-.3 0-.3 0m7.1.3c-.7-.4-1.5-.2-1.9.5c-2.3 4.2-6.3 7.3-11.1 8.5c-.7.1-1.1.7-1 1.4c.1.7.7 1.1 1.4 1c5.3-1.2 9.8-4.8 12.3-9.5c.4-.7.2-1.5-.5-1.9Z"
          />
        </svg>
        <span class="text-2xl font-bold text-gray-800">Floou</span>
      </RouterLink>

      <div class="flex items-center space-x-4">
        <RouterLink to="/keranjang" class="relative">
          <ShoppingCartIcon class="h-6 w-6 text-gray-600 hover:text-green-600" />
          <span
            v-if="cartStore.totalItems > 0"
            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
          >
            {{ cartStore.totalItems }}
          </span>
        </RouterLink>

        <div v-if="authStore.isAuthenticated" class="flex items-center space-x-4">
          <RouterLink
            v-if="authStore.isAdmin"
            to="/admin"
            class="text-sm font-medium text-gray-700 hover:text-green-600"
            >Admin Panel</RouterLink
          >
          <RouterLink
            v-else
            to="/pesanan"
            class="text-sm font-medium text-gray-700 hover:text-green-600"
            >Pesanan Saya</RouterLink
          >
          <button
            @click="authStore.logout()"
            class="text-sm font-medium text-red-600 hover:text-red-800"
          >
            Logout
          </button>
        </div>

        <div v-else>
          <RouterLink to="/login" class="text-sm font-medium text-gray-700 hover:text-green-600"
            >Login</RouterLink
          >
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { ShoppingCartIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const cartStore = useCartStore()
</script>
