// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AdminLayoutView from '../views/admin/AdminLayoutView.vue'
import HomeView from '../views/user/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProductDetailView from '../views/user/ProductDetailView.vue'

import CartView from '../views/user/CartView.vue'
import OrderHistoryView from '../views/user/OrderHistoryView.vue'
import OrderDetailView from '../views/user/OrderDetailView.vue'

import DashboardView from '../views/admin/DashboardView.vue'
import ProductManagementView from '../views/admin/ProductManagementView.vue'
import ProductFormView from '../views/admin/ProductFormView.vue'
import OrderManagementView from '../views/admin/OrderManagementView.vue'
import CategoryManagementView from '../views/admin/CategoryManagementView.vue'
import PlantTypeManagementView from '../views/admin/PlantTypeManagementView.vue'
// Import KelolaAkunView dihapus dari sini
// import KelolaAkunView from '../views/admin/KelolaAkunView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Rute Publik & Pengguna
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
    { path: '/register', name: 'register', component: RegisterView, meta: { guestOnly: true } },
    { path: '/produk/:id', name: 'product-detail', component: ProductDetailView, props: true },
    { path: '/keranjang', name: 'cart', component: CartView, meta: { requiresAuth: true } },
    {
      path: '/pesanan',
      name: 'order-history',
      component: OrderHistoryView,
      meta: { requiresAuth: true },
    },
    {
      path: '/pesanan/:id',
      name: 'order-detail',
      component: OrderDetailView,
      meta: { requiresAuth: true },
      props: true,
    },

    // Rute Admin
    {
      path: '/admin',
      component: AdminLayoutView,
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        { path: '', redirect: { name: 'admin-dashboard' } },
        { path: 'dashboard', name: 'admin-dashboard', component: DashboardView },
        { path: 'produk', name: 'admin-products', component: ProductManagementView },
        { path: 'produk/baru', name: 'admin-product-new', component: ProductFormView },
        {
          path: 'produk/edit/:id',
          name: 'admin-product-edit',
          component: ProductFormView,
          props: true,
        },
        { path: 'pesanan', name: 'admin-orders', component: OrderManagementView },
        { path: 'kategori', name: 'admin-categories', component: CategoryManagementView },
        { path: 'tipe-tanaman', name: 'admin-plant-types', component: PlantTypeManagementView },
        // Route untuk 'kelola-akun' telah dihapus dari array children ini
        // { path: 'kelola-akun', name: 'admin-accounts', component: KelolaAkunView },
      ],
    },

    // Fallback Route
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ name: 'home' })
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
