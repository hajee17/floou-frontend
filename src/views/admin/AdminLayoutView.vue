<template>
  <div class="flex h-screen bg-gray-100 font-sans">
    <aside class="w-64 flex-shrink-0 bg-gray-800 text-white flex flex-col">
      <div class="h-20 flex items-center justify-center px-4 border-b border-gray-700">
        <h1 class="text-2xl font-bold">Floou Admin</h1>
      </div>
      <nav class="flex-1 px-4 py-4 space-y-2">
        <RouterLink
          v-for="item in navigation"
          :key="item.name"
          :to="{ name: item.routeName }"
          class="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors"
          :class="[
            $route.name === item.routeName || $route.path.startsWith(item.path)
              ? 'bg-green-600 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
          ]"
        >
          <component :is="item.icon" class="h-6 w-6" />
          <span>{{ item.name }}</span>
        </RouterLink>
      </nav>
      <div class="px-4 py-4 border-t border-gray-700">
        <div class="mb-4">
          <p class="text-sm font-semibold">{{ authStore.user?.name }}</p>
          <p class="text-xs text-gray-400">{{ authStore.user?.email }}</p>
        </div>
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left text-red-400 hover:bg-red-500 hover:text-white transition-colors"
        >
          <ArrowRightStartOnRectangleIcon class="h-6 w-6" />
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden">
      <main class="flex-1 overflow-y-auto p-8 md:p-10">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  ChartBarIcon,
  ArchiveBoxIcon,
  ShoppingCartIcon,
  TagIcon,
  SparklesIcon,
  // UserGroupIcon dihapus dari sini karena sudah tidak digunakan
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const route = useRoute()

const navigation = [
  { name: 'Dashboard', routeName: 'admin-dashboard', path: '/admin/dashboard', icon: ChartBarIcon },
  {
    name: 'Kelola Produk',
    routeName: 'admin-products',
    path: '/admin/produk',
    icon: ArchiveBoxIcon,
  },
  {
    name: 'Kelola Pesanan',
    routeName: 'admin-orders',
    path: '/admin/pesanan',
    icon: ShoppingCartIcon,
  },
  { name: 'Kategori', routeName: 'admin-categories', path: '/admin/kategori', icon: TagIcon },
  {
    name: 'Tipe Tanaman',
    routeName: 'admin-plant-types',
    path: '/admin/tipe-tanaman',
    icon: SparklesIcon,
  },
  // {  <-- Objek untuk menu "Kelola Akun" telah dihapus dari array ini
  //   name: "Kelola Akun",
  //   routeName: "admin-accounts",
  //   path: "/admin/kelola-akun",
  //   icon: UserGroupIcon,
  // },
]

const handleLogout = () => {
  if (confirm('Apakah Anda yakin ingin logout?')) {
    authStore.logout()
  }
}
</script>

<style scoped>
/* Scoped styles jika diperlukan, tetapi Tailwind sudah mencakup sebagian besar */
.router-link-exact-active {
  /* Contoh jika Anda ingin styling yang lebih spesifik untuk link aktif */
}
</style>
