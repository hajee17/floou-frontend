<template>
  <div class="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#F9F5F2]">
    <!-- Form Section -->
    <div class="flex flex-col justify-center items-center px-6 py-12 bg-white">
      <div class="w-full max-w-md">
        <h2 class="text-3xl font-bold text-gray-900 text-center">Buat Akun Baru</h2>

        <form class="mt-8 space-y-4" @submit.prevent="handleRegister">
          <!-- Error message global -->
          <div
            v-if="typeof authStore.error === 'string'"
            class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          >
            {{ authStore.error }}
          </div>

          <!-- Nama -->
          <div>
            <label class="block text-sm font-medium text-gray-800">Nama Lengkap</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="input-style placeholder-gray-400"
              placeholder="Nama lengkap"
            />
            <p v-if="authStore.error?.name" class="text-red-500 text-xs mt-1">
              {{ authStore.error.name[0] }}
            </p>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-800">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="input-style placeholder-gray-400"
              placeholder="contoh@email.com"
            />
            <p v-if="authStore.error?.email" class="text-red-500 text-xs mt-1">
              {{ authStore.error.email[0] }}
            </p>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-800">Password</label>
            <input
              v-model="form.password"
              type="password"
              required
              class="input-style placeholder-gray-400"
              placeholder="******"
            />
            <p v-if="authStore.error?.password" class="text-red-500 text-xs mt-1">
              {{ authStore.error.password[0] }}
            </p>
          </div>

          <!-- Konfirmasi Password -->
          <div>
            <label class="block text-sm font-medium text-gray-800">Konfirmasi Password</label>
            <input
              v-model="form.password_confirmation"
              type="password"
              required
              class="input-style placeholder-gray-400"
              placeholder="******"
            />
          </div>

          <!-- Nomor Telepon -->
          <div>
            <label class="block text-sm font-medium text-gray-800">Nomor Telepon (Opsional)</label>
            <input
              v-model="form.phone"
              type="text"
              class="input-style placeholder-gray-400"
              placeholder="08xxxxxxxxxx"
            />
          </div>

          <!-- Alamat -->
          <div>
            <label class="block text-sm font-medium text-gray-800">Alamat (Opsional)</label>
            <textarea
              v-model="form.address"
              rows="2"
              class="input-style placeholder-gray-400"
              placeholder="Jl. Mawar No. 123"
            ></textarea>
          </div>

          <!-- Tombol -->
          <div>
            <button
              type="submit"
              :disabled="authStore.isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mt-6"
            >
              <span v-if="authStore.isLoading">Mendaftar...</span>
              <span v-else>Daftar</span>
            </button>
          </div>
        </form>

        <!-- Link ke Login -->
        <p class="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun?
          <RouterLink to="/login" class="text-green-600 font-medium hover:underline"
            >Masuk Sekarang</RouterLink
          >
        </p>
      </div>
    </div>

    <!-- Gambar Section -->
    <div class="hidden md:block">
      <img
        class="h-full w-full object-cover brightness-95"
        src="https://floou.hafidzirham.com/storage/plants/hero-plant.jpg"
        alt="Potted plants"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  phone: '',
  address: '',
})

const handleRegister = async () => {
  await authStore.register(form.value)
}
</script>

<style scoped>
.input-style {
  @apply block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm;
}
</style>
