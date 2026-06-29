# 🚀 Quick Reference: All Backend API Endpoints

## 📖 How to Use This Guide

Setiap endpoint sudah diimplementasikan dalam Pinia stores. Gunakan store functions, jangan call API directly.

---

## 🔐 AUTHENTICATION

### Store: `useAuthStore()`

```javascript
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
```

| Action | Function | Backend Endpoint |
|--------|----------|------------------|
| Login | `authStore.login({ email, password })` | `POST /login` |
| Register | `authStore.register(userData)` | `POST /register` |
| Logout | `authStore.logout()` | `POST /logout` |
| Get Current User | `authStore.fetchCurrentUser()` | `GET /me` |

**Properties:**
- `authStore.user` - Current user object
- `authStore.token` - Auth token
- `authStore.isAuthenticated` - Boolean
- `authStore.isAdmin` - Boolean
- `authStore.isLoading` - Boolean
- `authStore.error` - Error message

---

## 🌱 PLANTS

### Store: `useProductStore()`

```javascript
import { useProductStore } from '@/stores/product'
const productStore = useProductStore()
```

| Action | Function | Backend Endpoint |
|--------|----------|------------------|
| List Plants | `productStore.fetchPlants(params)` | `GET /plants` |
| Get Plant Detail | `productStore.fetchPlant(slugOrId)` | `GET /plants/{slug}` |
| Create Plant | `productStore.createPlant(formData)` | `POST /plants` |
| Update Plant | `productStore.updatePlant(id, formData)` | `POST /plants/{id}` |
| Delete Plant | `productStore.deletePlant(id)` | `DELETE /plants/{id}` |

**Filters for fetchPlants():**
```javascript
productStore.fetchPlants({
  search: 'monstera',
  category_id: 1,
  plant_type_id: 2,
  min_price: 50000,
  max_price: 200000,
  in_stock: 1,
  sort_by: 'price', // name, price, created_at, stock
  sort_order: 'asc', // asc or desc
  per_page: 12
})
```

**Properties:**
- `productStore.plants.data` - Array of plants
- `productStore.plant` - Single plant detail
- `productStore.isLoading`
- `productStore.error`

---

## 📂 CATEGORIES

### Store: `useProductStore()`

| Action | Function | Backend Endpoint |
|--------|----------|------------------|
| List Categories | `productStore.fetchCategories()` | `GET /categories` |
| Create Category | `productStore.createCategory({ name })` | `POST /categories` |
| Update Category | `productStore.updateCategory(id, { name })` | `PUT /categories/{id}` |
| Delete Category | `productStore.deleteCategory(id)` | `DELETE /categories/{id}` |

**Properties:**
- `productStore.categories` - Array of categories

---

## 🏷️ PLANT TYPES

### Store: `useProductStore()`

| Action | Function | Backend Endpoint |
|--------|----------|------------------|
| List Plant Types | `productStore.fetchPlantTypes()` | `GET /plant-types` |
| Create Plant Type | `productStore.createPlantType({ name })` | `POST /plant-types` |
| Update Plant Type | `productStore.updatePlantType(id, { name })` | `PUT /plant-types/{id}` |
| Delete Plant Type | `productStore.deletePlantType(id)` | `DELETE /plant-types/{id}` |

**Properties:**
- `productStore.plantTypes` - Array of plant types

---

## 🛒 ORDERS (User)

### Store: `useOrderStore()`

```javascript
import { useOrderStore } from '@/stores/order'
const orderStore = useOrderStore()
```

| Action | Function | Backend Endpoint |
|--------|----------|------------------|
| List My Orders | `orderStore.fetchOrders(params)` | `GET /orders` |
| Get Order Detail | `orderStore.fetchOrder(id)` | `GET /orders/{id}` |
| Create Order | `orderStore.createOrder(orderData)` | `POST /orders` |
| Cancel Order | `orderStore.cancelOrder(id, reason)` | `POST /orders/{id}/cancel` |
| Get Invoice | `orderStore.getInvoice(id)` | `GET /orders/{id}/invoice` |
| Update Status | `orderStore.updateOrderStatus(id, status)` | `PATCH /orders/{id}/status` |

**Create Order Example:**
```javascript
await orderStore.createOrder({
  items: [
    { plant_id: 1, quantity: 2 },
    { plant_id: 3, quantity: 1 }
  ],
  recipient_name: 'John Doe',
  recipient_phone: '081234567890',
  shipping_address: 'Jl. Example No. 123',
  shipping_method: 'standard', // or 'express'
  notes: 'Deliver in the morning' // optional
})
```

**Properties:**
- `orderStore.orders.data` - Array of orders
- `orderStore.order` - Single order detail
- `orderStore.isLoading`
- `orderStore.error`

---

## 🛒 ORDERS (Admin)

### Store: `useOrderStore()`

| Action | Function | Backend Endpoint |
|--------|----------|------------------|
| List All Orders | `orderStore.fetchAdminOrders(params)` | `GET /admin/orders` |
| Update Order Details | `orderStore.updateAdminOrder(id, data)` | `PUT /admin/orders/{id}` |
| Delete Order | `orderStore.deleteAdminOrder(id)` | `DELETE /admin/orders/{id}` |

**Admin Filters:**
```javascript
orderStore.fetchAdminOrders({
  status: 'pending', // pending, confirmed, completed, canceled
  user_id: 2,
  date_from: '2025-01-01',
  date_to: '2025-01-31',
  search: 'INV-20250115', // invoice number, user name, or email
  per_page: 10
})
```

**Update Order Example:**
```javascript
await orderStore.updateAdminOrder(orderId, {
  recipient_name: 'Updated Name',
  recipient_phone: '081234567890',
  shipping_address: 'New Address',
  shipping_method: 'express',
  notes: 'Updated notes'
})
```

---

## ⭐ REVIEWS

### Store: `useReviewStore()`

```javascript
import { useReviewStore } from '@/stores/review'
const reviewStore = useReviewStore()
```

| Action | Function | Backend Endpoint |
|--------|----------|------------------|
| Get Plant Reviews | `reviewStore.fetchPlantReviews(plantId, { page })` | `GET /plants/{plantId}/reviews` |
| Create Review | `reviewStore.createReview(reviewData)` | `POST /reviews` |
| Update Review | `reviewStore.updateReview(id, reviewData)` | `PUT /reviews/{id}` |
| Delete Review | `reviewStore.deleteReview(id)` | `DELETE /reviews/{id}` |
| Get My Reviews | `reviewStore.fetchMyReviews(params)` | `GET /my-reviews` |

**Create Review Example:**
```javascript
await reviewStore.createReview({
  plant_id: 1,
  order_id: 5,
  rating: 5, // 1-5
  comment: 'Tanaman sampai dengan selamat!'
})
```

**Requirements:**
- ✅ Order harus `completed`
- ✅ Order harus milik user yang login
- ✅ Plant harus ada di order tersebut
- ✅ Belum pernah review plant ini untuk order ini

**Properties:**
- `reviewStore.reviews.data` - Array of plant reviews
- `reviewStore.myReviews.data` - Array of my reviews
- `reviewStore.isLoading`
- `reviewStore.error`

---

## 🔔 NOTIFICATIONS

### Store: `useNotificationStore()`

```javascript
import { useNotificationStore } from '@/stores/notification'
const notificationStore = useNotificationStore()
```

| Action | Function | Backend Endpoint |
|--------|----------|------------------|
| Get Notifications | `notificationStore.fetchNotifications(params)` | `GET /notifications` |
| Mark as Read | `notificationStore.markAsRead(id)` | `PATCH /notifications/{id}/read` |
| Mark All as Read | `notificationStore.markAllAsRead()` | `PATCH /notifications/read-all` |
| Delete Notification | `notificationStore.deleteNotification(id)` | `DELETE /notifications/{id}` |
| Delete All | `notificationStore.deleteAllNotifications()` | `DELETE /notifications` |

**Properties:**
- `notificationStore.notifications.data` - Array of notifications
- `notificationStore.unreadCount` - Computed unread count
- `notificationStore.isLoading`
- `notificationStore.error`

**Notification Types:**
- `order_placed` - Order baru dibuat
- `order_status_changed` - Status order berubah
- `order_canceled` - Order dibatalkan

---

## 👥 ADMIN - USER MANAGEMENT

### Store: `useAdminUserStore()`

```javascript
import { useAdminUserStore } from '@/stores/adminUser'
const adminUserStore = useAdminUserStore()
```

| Action | Function | Backend Endpoint |
|--------|----------|------------------|
| List Users | `adminUserStore.fetchUsers(params)` | `GET /admin/users` |
| Get User Detail | `adminUserStore.fetchUser(id)` | `GET /admin/users/{id}` |
| Update User | `adminUserStore.updateUser(id, userData)` | `PUT /admin/users/{id}` |
| Delete User | `adminUserStore.deleteUser(id)` | `DELETE /admin/users/{id}` |

**Filters:**
```javascript
adminUserStore.fetchUsers({
  search: 'john@example.com',
  role: 'user', // 'admin' or 'user'
  per_page: 10
})
```

**Update User Example:**
```javascript
await adminUserStore.updateUser(userId, {
  name: 'Updated Name',
  email: 'new@example.com',
  role: 'admin', // or 'user'
  phone: '081234567890',
  address: 'New Address',
  password: 'newpassword123' // optional
})
```

**Properties:**
- `adminUserStore.users.data` - Array of users
- `adminUserStore.user` - Single user detail
- `adminUserStore.isLoading`
- `adminUserStore.error`

---

## 📊 ADMIN - DASHBOARD

### Store: `useDashboardStore()`

```javascript
import { useDashboardStore } from '@/stores/dashboard'
const dashboardStore = useDashboardStore()
```

| Action | Function | Backend Endpoint |
|--------|----------|------------------|
| Get Dashboard Data | `dashboardStore.fetchDashboardData()` | `GET /dashboard` |

**Properties:**
```javascript
dashboardStore.statistics = {
  total_users: 150,
  total_plants: 75,
  total_orders: 250,
  order_status_counts: {
    pending: 10,
    confirmed: 15,
    completed: 200,
    canceled: 25
  }
}

dashboardStore.lowStockPlants = [
  { id: 5, name: 'Plant Name', stock: 3, price: 50000 }
]

dashboardStore.recentOrders = [
  { id: 1, invoice_number: 'INV-...', user: {...}, ... }
]

dashboardStore.salesStats = [
  { date: '2025-11-30', total_sales: 5000000 }
]
```

---

## 🛠️ COMMON PATTERNS

### Error Handling

```javascript
try {
  await orderStore.createOrder(orderData)
  // Success
  alert('Order berhasil dibuat!')
} catch (error) {
  // Error handling
  alert(error.message || 'Gagal membuat order')
}
```

### Loading States

```vue
<template>
  <div v-if="orderStore.isLoading">Loading...</div>
  <div v-else-if="orderStore.error">{{ orderStore.error }}</div>
  <div v-else>
    <!-- Your content -->
  </div>
</template>
```

### Pagination

```vue
<template>
  <div>
    <!-- Show results -->
    <div v-for="item in orderStore.orders.data" :key="item.id">
      {{ item.name }}
    </div>
    
    <!-- Pagination controls -->
    <button 
      v-for="link in orderStore.orders.links" 
      :key="link.label"
      @click="goToPage(link.url)"
      :disabled="!link.url"
    >
      {{ link.label }}
    </button>
  </div>
</template>

<script setup>
function goToPage(url) {
  if (!url) return
  const page = new URL(url).searchParams.get('page')
  orderStore.fetchOrders({ page })
}
</script>
```

---

## 📋 Status Reference

### Order Status Flow
```
pending → confirmed → completed
   ↓
canceled
```

**Status Meanings:**
- `pending` - Menunggu konfirmasi admin
- `confirmed` - Sudah dikonfirmasi, sedang diproses
- `completed` - Selesai dikirim (user bisa review)
- `canceled` - Dibatalkan (stock dikembalikan)

### Shipping Methods
- `standard` - Rp 20.000 (7-14 hari)
- `express` - Rp 50.000 (3-5 hari)

### Review Ratings
- `1` - ⭐ Sangat Buruk
- `2` - ⭐⭐ Buruk
- `3` - ⭐⭐⭐ Cukup
- `4` - ⭐⭐⭐⭐ Baik
- `5` - ⭐⭐⭐⭐⭐ Sangat Baik

---

## 🎯 Best Practices

### DO ✅
```javascript
// Use store functions
await productStore.createCategory({ name: 'New Category' })

// Check loading state
if (!productStore.isLoading) {
  // Safe to access data
}

// Handle errors properly
try {
  await orderStore.createOrder(data)
} catch (error) {
  showErrorNotification(error.message)
}
```

### DON'T ❌
```javascript
// Don't call API directly
await apiClient.post('/categories', data) // ❌

// Don't ignore loading states
productStore.plants.data.map(...) // ❌ Could be undefined

// Don't ignore errors
await orderStore.createOrder(data) // ❌ No error handling
```

---

## 🔧 Environment Setup

Make sure your `.env` file is configured:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_IMAGE_STORAGE_URL=http://127.0.0.1:8000/storage
```

---

## 📞 Need Help?

**Documentation Files:**
- `API_AUDIT_REPORT.md` - Complete endpoint audit
- `API_INTEGRATION_COMPLETE.md` - Update summary
- `INTEGRATION_SUMMARY.md` - Overall integration docs
- `REVIEW_FEATURE_UPDATE.md` - Review feature guide

**Backend API Docs:**
- Located at project root or backend repo
- Full endpoint specs with request/response examples

---

**Last Updated:** December 11, 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
