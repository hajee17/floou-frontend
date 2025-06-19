<template>
  <div class="min-h-screen bg-[#F9F5F2] md:grid md:grid-cols-2">
    <div class="flex flex-col justify-center items-center px-6 py-12 lg:px-8 bg-white">
      <div class="w-full max-w-sm">
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Buat Akun Baru
        </h2>
        <form class="mt-8 space-y-4" @submit.prevent="handleRegister">
          <div v-if="typeof authStore.error === 'string'" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              {{ authStore.error }}
          </div>

          <div>
            <label for="name" class="font-semibold text-sm">Nama Lengkap</label>
            <input v-model="form.name" type="text" required class="mt-1 w-full input-style">
            <p v-if="authStore.error?.name" class="text-red-500 text-xs mt-1">{{ authStore.error.name[0] }}</p>
          </div>
          <div>
            <label for="email-address" class="font-semibold text-sm">Email</label>
            <input v-model="form.email" type="email" required class="mt-1 w-full input-style">
             <p v-if="authStore.error?.email" class="text-red-500 text-xs mt-1">{{ authStore.error.email[0] }}</p>
          </div>
          <div>
            <label for="password" class="font-semibold text-sm">Password</label>
            <input v-model="form.password" type="password" required class="mt-1 w-full input-style">
             <p v-if="authStore.error?.password" class="text-red-500 text-xs mt-1">{{ authStore.error.password[0] }}</p>
          </div>
          <div>
            <label for="password_confirmation" class="font-semibold text-sm">Konfirmasi Password</label>
            <input v-model="form.password_confirmation" type="password" required class="mt-1 w-full input-style">
          </div>
          <div>
            <label for="phone" class="font-semibold text-sm">Nomor Telepon (Opsional)</label>
            <input v-model="form.phone" type="text" class="mt-1 w-full input-style">
          </div>
          <div>
            <label for="address" class="font-semibold text-sm">Alamat (Opsional)</label>
            <textarea v-model="form.address" rows="2" class="mt-1 w-full input-style"></textarea>
          </div>

          <div>
            <button type="submit" :disabled="authStore.isLoading"
              class="group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 mt-6">
              <span v-if="authStore.isLoading">Mendaftar...</span>
              <span v-else>Daftar</span>
            </button>
          </div>
        </form>

        <p class="mt-10 text-center text-sm text-gray-500">
          Sudah punya akun?
          <RouterLink to="/login" class="font-medium text-green-600 hover:text-green-500">Masuk Sekarang</RouterLink>
        </p>
      </div>
    </div>
    <div class="hidden md:block">
      <img class="h-full w-full object-cover" src="https://floou.hafidzirham.com/storage/plants/hero-plant.jpg" alt="Potted plants">
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  phone: '',
  address: ''
});

const handleRegister = async () => {
  await authStore.register(form.value);
};
</script>

<style scoped>
.input-style {
  @apply relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm;
}
</style>
