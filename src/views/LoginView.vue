<template>
  <div class="min-h-screen bg-[#F9F5F2] md:grid md:grid-cols-2">
    <div class="flex flex-col justify-center items-center px-6 py-12 lg:px-8 bg-white">
      <div class="w-full max-w-sm">
        <div>
          <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Welcome to Floou
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Bring Nature Closer to You!
          </p>
        </div>

        <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
          <div v-if="authStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span class="block sm:inline">{{ authStore.error }}</span>
          </div>
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email-address" class="font-semibold text-sm">Email</label>
              <input v-model="email" id="email-address" name="email" type="email" autocomplete="email" required
                class="mt-1 relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                placeholder="Masukkan email anda">
            </div>
            <div class="pt-4">
              <label for="password" class="font-semibold text-sm">Password</label>
              <input v-model="password" id="password" name="password" type="password" autocomplete="current-password"
                required
                class="mt-1 relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                placeholder="Masukkan password anda">
            </div>
          </div>

          <div>
            <button type="submit" :disabled="authStore.isLoading"
              class="group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400">
              <span v-if="authStore.isLoading">Loading...</span>
              <span v-else>Masuk</span>
            </button>
          </div>
        </form>

        <p class="mt-10 text-center text-sm text-gray-500">
          Belum punya akun?
          <RouterLink to="/register" class="font-medium text-green-600 hover:text-green-500">Daftar Sekarang
          </RouterLink>
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
const email = ref('');
const password = ref('');

const handleLogin = async () => {
  await authStore.login({
    email: email.value,
    password: password.value,
  });
};
</script>