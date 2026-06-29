<template>
  <div class="space-y-6 px-4 sm:px-8 lg:px-16 py-10 bg-[#F9F5F2] min-h-screen">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-800">Kelola Akun Pengguna</h1>
    </div>

    <!-- Search and Filter -->
    <div class="bg-white p-4 rounded-lg shadow flex gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari berdasarkan nama atau email..."
        class="flex-1 border rounded-lg px-4 py-2"
        @input="handleSearch"
      />
      <select
        v-model="roleFilter"
        class="border rounded-lg px-4 py-2"
        @change="handleFilter"
      >
        <option value="">Semua Role</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
    </div>

    <div v-if="isLoading" class="text-center py-12">
      <p class="text-gray-500">Memuat data pengguna...</p>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-500">{{ error }}</p>
    </div>

    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full text-left text-sm">
        <thead class="bg-gray-100 text-gray-700 border-b">
          <tr>
            <th class="py-3 px-4">ID</th>
            <th class="py-3 px-4">Nama</th>
            <th class="py-3 px-4">Email</th>
            <th class="py-3 px-4">Role</th>
            <th class="py-3 px-4">Telepon</th>
            <th class="py-3 px-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users.data"
            :key="user.id"
            class="border-b hover:bg-gray-50 transition"
          >
            <td class="py-3 px-4">{{ user.id }}</td>
            <td class="py-3 px-4">{{ user.name }}</td>
            <td class="py-3 px-4">{{ user.email }}</td>
            <td class="py-3 px-4">
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-semibold',
                  user.role === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800',
                ]"
              >
                {{ user.role }}
              </span>
            </td>
            <td class="py-3 px-4">{{ user.phone || '-' }}</td>
            <td class="py-3 px-4 flex gap-2">
              <button
                @click="editUser(user)"
                class="text-green-600 hover:text-green-800"
              >
                Edit
              </button>
              <button
                @click="deleteUser(user.id)"
                class="text-red-600 hover:text-red-800"
              >
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="p-4 flex justify-center gap-2">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="loadPage(page)"
          :class="[
            'px-4 py-2 rounded',
            page === currentPage
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          {{ page }}
        </button>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="editingUser"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-xl font-bold mb-4">Edit Pengguna</h3>
        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nama</label>
            <input
              v-model="editData.name"
              type="text"
              required
              class="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input
              v-model="editData.email"
              type="email"
              required
              class="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Role</label>
            <select
              v-model="editData.role"
              required
              class="w-full border rounded-lg px-3 py-2"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Telepon</label>
            <input
              v-model="editData.phone"
              type="text"
              class="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Alamat</label>
            <textarea
              v-model="editData.address"
              rows="3"
              class="w-full border rounded-lg px-3 py-2"
            ></textarea>
          </div>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="cancelEdit"
              class="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAdminUserStore } from '@/stores/adminUser'

const adminUserStore = useAdminUserStore()
const { users, isLoading, error } = adminUserStore

const searchQuery = ref('')
const roleFilter = ref('')
const editingUser = ref(null)
const editData = ref({
  name: '',
  email: '',
  role: 'user',
  phone: '',
  address: '',
})

const currentPage = computed(() => users.value.meta?.current_page || 1)
const totalPages = computed(() => users.value.meta?.last_page || 1)

onMounted(() => {
  adminUserStore.fetchUsers()
})

function loadPage(page) {
  const params = { page }
  if (searchQuery.value) params.search = searchQuery.value
  if (roleFilter.value) params.role = roleFilter.value
  adminUserStore.fetchUsers(params)
}

function handleSearch() {
  loadPage(1)
}

function handleFilter() {
  loadPage(1)
}

function editUser(user) {
  editingUser.value = user
  editData.value = {
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || '',
    address: user.address || '',
  }
}

function cancelEdit() {
  editingUser.value = null
  editData.value = {
    name: '',
    email: '',
    role: 'user',
    phone: '',
    address: '',
  }
}

async function saveUser() {
  try {
    await adminUserStore.updateUser(editingUser.value.id, editData.value)
    await adminUserStore.fetchUsers()
    cancelEdit()
    alert('Pengguna berhasil diperbarui')
  } catch {
    alert('Gagal memperbarui pengguna')
  }
}

async function deleteUser(id) {
  if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
    try {
      await adminUserStore.deleteUser(id)
      alert('Pengguna berhasil dihapus')
    } catch {
      alert('Gagal menghapus pengguna')
    }
  }
}
</script>
