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
          <!-- Notification Icon -->
          <RouterLink to="/notifikasi" class="relative">
            <BellIcon class="h-6 w-6 text-gray-600 hover:text-green-600" />
            <span
              v-if="notificationStore.unreadCount > 0"
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            >
              {{ notificationStore.unreadCount }}
            </span>
          </RouterLink>

          <!-- User Menu -->
          <div class="relative" @click="toggleUserMenu">
            <button class="flex items-center space-x-2 text-gray-700 hover:text-green-600">
              <UserCircleIcon class="h-6 w-6" />
              <span class="text-sm font-medium">{{ authStore.user?.name }}</span>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50"
            >
              <RouterLink
                v-if="authStore.isAdmin"
                to="/admin"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="showUserMenu = false"
              >
                Admin Panel
              </RouterLink>
              <RouterLink
                to="/profil"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="showUserMenu = false"
              >
                Profil Saya
              </RouterLink>
              <RouterLink
                to="/pesanan"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="showUserMenu = false"
              >
                Pesanan Saya
              </RouterLink>
              <RouterLink
                to="/ulasan-saya"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="showUserMenu = false"
              >
                Ulasan Saya
              </RouterLink>
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
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
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useNotificationStore } from '@/stores/notification'
import { ShoppingCartIcon, BellIcon, UserCircleIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const cartStore = useCartStore()
const notificationStore = useNotificationStore()

const showUserMenu = ref(false)

onMounted(() => {
  if (authStore.isAuthenticated) {
    notificationStore.fetchNotifications()
  }
})

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
}

function handleLogout() {
  showUserMenu.value = false
  authStore.logout()
}

// Close menu when clicking outside
if (typeof window !== 'undefined') {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showUserMenu.value = false
    }
  })
}
</script>
