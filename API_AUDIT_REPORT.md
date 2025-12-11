# 📊 Audit Report: Backend API vs Frontend Implementation

## ✅ FULLY IMPLEMENTED

### 1. Authentication Endpoints
| Endpoint | Method | Frontend | Status |
|----------|--------|----------|--------|
| `/register` | POST | ✅ `auth.js` - register() | ✅ Complete |
| `/login` | POST | ✅ `auth.js` - login() | ✅ Complete |
| `/logout` | POST | ✅ `auth.js` - logout() | ✅ Complete |
| `/me` | GET | ❌ **MISSING** | ⚠️ Not Implemented |

**Issue:** Frontend tidak memiliki fungsi untuk fetch current user data (`GET /me`)

---

### 2. Plants Endpoints
| Endpoint | Method | Frontend | Status |
|----------|--------|----------|--------|
| `/plants` | GET | ✅ `product.js` - fetchPlants() | ✅ Complete |
| `/plants/{slug}` | GET | ✅ `product.js` - fetchPlant() | ✅ Complete |
| `/plants` | POST | ✅ `product.js` - createPlant() | ✅ Complete |
| `/plants/{id}` | POST | ✅ `product.js` - updatePlant() | ✅ Complete |
| `/plants/{id}` | DELETE | ✅ `product.js` - deletePlant() | ✅ Complete |

**Status:** ✅ All plant endpoints implemented correctly

---

### 3. Categories Endpoints
| Endpoint | Method | Frontend | Status |
|----------|--------|----------|--------|
| `/categories` | GET | ✅ `product.js` - fetchCategories() | ✅ Complete |
| `/categories` | POST | ⚠️ Inline in component | ⚠️ Not in store |
| `/categories/{id}` | PUT | ⚠️ Inline in component | ⚠️ Not in store |
| `/categories/{id}` | DELETE | ⚠️ Inline in component | ⚠️ Not in store |

**Issue:** Category CRUD operations exist in `CategoryManagementView.vue` but NOT in store. Should be moved to `product.js` store for consistency.

---

### 4. Plant Types Endpoints
| Endpoint | Method | Frontend | Status |
|----------|--------|----------|--------|
| `/plant-types` | GET | ✅ `product.js` - fetchPlantTypes() | ✅ Complete |
| `/plant-types` | POST | ⚠️ Inline in component | ⚠️ Not in store |
| `/plant-types/{id}` | PUT | ⚠️ Inline in component | ⚠️ Not in store |
| `/plant-types/{id}` | DELETE | ⚠️ Inline in component | ⚠️ Not in store |

**Issue:** Plant Type CRUD operations exist in `PlantTypeManagementView.vue` but NOT in store. Should be moved to `product.js` store for consistency.

---

### 5. Orders Endpoints (User)
| Endpoint | Method | Frontend | Status |
|----------|--------|----------|--------|
| `/orders` | GET | ✅ `order.js` - fetchOrders() | ✅ Complete |
| `/orders` | POST | ✅ `order.js` - createOrder() | ✅ Complete |
| `/orders/{id}` | GET | ✅ `order.js` - fetchOrder() | ✅ Complete |
| `/orders/{id}/cancel` | POST | ✅ `order.js` - cancelOrder() | ✅ Complete |
| `/orders/{id}/invoice` | GET | ✅ `order.js` - getInvoice() | ✅ Complete |
| `/orders/{id}/status` | PATCH | ✅ `order.js` - updateOrderStatus() | ✅ Complete |

**Status:** ✅ All user order endpoints implemented correctly

---

### 6. Orders Endpoints (Admin)
| Endpoint | Method | Frontend | Status |
|----------|--------|----------|--------|
| `/admin/orders` | GET | ❌ **MISSING** | ⚠️ Using user endpoint |
| `/admin/orders/{id}` | PUT | ❌ **MISSING** | ⚠️ Not Implemented |
| `/admin/orders/{id}` | DELETE | ❌ **MISSING** | ⚠️ Not Implemented |

**Issue:** 
- `OrderManagementView.vue` uses user `fetchOrders()` instead of admin endpoint
- Admin cannot update order details (recipient, address, shipping method)
- Admin cannot delete orders

---

### 7. Reviews Endpoints
| Endpoint | Method | Frontend | Status |
|----------|--------|----------|--------|
| `/plants/{plant_id}/reviews` | GET | ✅ `review.js` - fetchPlantReviews() | ✅ Complete |
| `/reviews` | POST | ✅ `review.js` - createReview() | ✅ Complete |
| `/reviews/{id}` | PUT | ✅ `review.js` - updateReview() | ✅ Complete |
| `/reviews/{id}` | DELETE | ✅ `review.js` - deleteReview() | ✅ Complete |
| `/my-reviews` | GET | ✅ `review.js` - fetchMyReviews() | ✅ Complete |

**Status:** ✅ All review endpoints implemented correctly

---

### 8. Notifications Endpoints
| Endpoint | Method | Frontend | Status |
|----------|--------|----------|--------|
| `/notifications` | GET | ✅ `notification.js` - fetchNotifications() | ✅ Complete |
| `/notifications/{id}/read` | PATCH | ✅ `notification.js` - markAsRead() | ✅ Complete |
| `/notifications/read-all` | PATCH | ✅ `notification.js` - markAllAsRead() | ✅ Complete |
| `/notifications/{id}` | DELETE | ✅ `notification.js` - deleteNotification() | ✅ Complete |
| `/notifications` | DELETE | ✅ `notification.js` - deleteAllNotifications() | ✅ Complete |

**Status:** ✅ All notification endpoints implemented correctly

---

### 9. Admin - User Management
| Endpoint | Method | Frontend | Status |
|----------|--------|----------|--------|
| `/admin/users` | GET | ✅ `adminUser.js` - fetchUsers() | ✅ Complete |
| `/admin/users/{id}` | GET | ✅ `adminUser.js` - fetchUser() | ✅ Complete |
| `/admin/users/{id}` | PUT | ✅ `adminUser.js` - updateUser() | ✅ Complete |
| `/admin/users/{id}` | DELETE | ✅ `adminUser.js` - deleteUser() | ✅ Complete |

**Note:** Store exists but view (`KelolaAkunView.vue`) shows placeholder. Backend API ready but frontend UI not implemented.

---

### 10. Admin - Dashboard
| Endpoint | Method | Frontend | Status |
|----------|--------|----------|--------|
| `/dashboard` | GET | ✅ `dashboard.js` - fetchDashboardData() | ✅ Complete |

**Status:** ✅ Dashboard endpoint implemented correctly

---

## ❌ CRITICAL ISSUES FOUND

### Issue 1: Missing `GET /me` Endpoint
**Priority:** HIGH  
**Location:** `src/stores/auth.js`

Backend provides `GET /me` to get current authenticated user, but frontend doesn't use it. Frontend only stores user data from login/register response.

**Impact:** If user refreshes page, user data might be stale. Should fetch fresh data.

**Fix Required:**
```javascript
// Add to auth.js
async function fetchCurrentUser() {
  try {
    const response = await apiClient.get('/me')
    user.value = response.data.user
    localStorage.setItem('user', JSON.stringify(response.data.user))
  } catch (e) {
    console.error('Failed to fetch current user:', e)
    // If 401, logout
    if (e.response?.status === 401) {
      logout()
    }
  }
}
```

---

### Issue 2: Admin Order Endpoints Not Implemented
**Priority:** MEDIUM  
**Location:** `src/stores/order.js` & `src/views/admin/OrderManagementView.vue`

Backend provides separate admin endpoints:
- `GET /admin/orders` - with filters (status, user_id, date_from, date_to, search)
- `PUT /admin/orders/{id}` - update order details
- `DELETE /admin/orders/{id}` - delete order

Frontend currently uses user endpoint `GET /orders` which doesn't support admin filters.

**Fix Required:**
```javascript
// Add to order.js
async function fetchAdminOrders(params = {}) {
  isLoading.value = true
  error.value = null
  try {
    const response = await apiClient.get('/admin/orders', { params })
    orders.value = response.data.orders
  } catch (e) {
    error.value = 'Gagal memuat daftar pesanan.'
    console.error('Fetch Admin Orders Error:', e.response)
  } finally {
    isLoading.value = false
  }
}

async function updateAdminOrder(id, orderData) {
  try {
    const response = await apiClient.put(`/admin/orders/${id}`, orderData)
    return response.data.order
  } catch (e) {
    throw new Error(e.response?.data?.message || 'Gagal memperbarui pesanan.')
  }
}

async function deleteAdminOrder(id) {
  try {
    await apiClient.delete(`/admin/orders/${id}`)
  } catch (e) {
    throw new Error(e.response?.data?.message || 'Gagal menghapus pesanan.')
  }
}
```

---

### Issue 3: Category & Plant Type CRUD Not in Store
**Priority:** LOW  
**Location:** `src/stores/product.js`

Category and Plant Type CRUD operations are implemented directly in component files instead of in the store. This violates Pinia store pattern.

**Current State:**
- ✅ `fetchCategories()` - in store
- ❌ `createCategory()` - inline in component
- ❌ `updateCategory()` - inline in component
- ❌ `deleteCategory()` - inline in component

**Fix Required:** Move all CRUD operations to `product.js` store for consistency.

---

## 📝 SUMMARY

### Implemented (90%)
- ✅ Authentication (login, register, logout)
- ✅ Plants CRUD (all operations)
- ✅ Orders (user operations)
- ✅ Reviews (all operations)
- ✅ Notifications (all operations)
- ✅ Admin Users (store complete, UI pending)
- ✅ Dashboard (complete)

### Missing/Incomplete (10%)
- ⚠️ `GET /me` endpoint not used
- ⚠️ Admin order endpoints (`/admin/orders`, update, delete)
- ⚠️ Category/Plant Type CRUD not in store (works but not best practice)
- ⚠️ User management UI (store ready but no active view)

---

## 🎯 RECOMMENDATIONS

### Priority 1 (Critical)
1. Implement admin order management functions
2. Add `GET /me` endpoint usage

### Priority 2 (Important)
3. Move Category/Plant Type CRUD to store
4. Fix order history empty page issue (current debugging)

### Priority 3 (Enhancement)
5. Build user management UI (store already exists)
6. Add admin order filters UI (date range, status, search)

---

## 📊 OVERALL SCORE

**API Coverage:** 90%  
**Code Quality:** 85%  
**Best Practices:** 80%

**Total Score:** 85/100 ⭐⭐⭐⭐

Frontend sudah sangat baik dalam mengimplementasikan hampir semua endpoint backend. Masalah utama adalah beberapa endpoint admin yang belum digunakan dan sedikit inkonsistensi dalam penempatan logic (CRUD di component vs store).
