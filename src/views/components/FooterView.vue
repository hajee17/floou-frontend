<template>
  <footer class="bg-gray-800 text-white mt-12">
    <div class="container mx-auto px-6 py-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <div class="col-span-1">
          <div class="flex items-center space-x-2 mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" class="text-green-500"><path fill="currentColor" d="M12.9 4.8c-.7-.1-1.3.4-1.4 1.1c-1.1 5.4-4.5 9.4-9.3 11.5c-.6.2-1 .8-.8 1.4c.2.6.8 1 1.4.8c5.4-2.3 9.2-6.8 10.4-12.8c.1-.7-.4-1.3-1.1-1.4c-.1 0-.3 0-.3 0m7.1.3c-.7-.4-1.5-.2-1.9.5c-2.3 4.2-6.3 7.3-11.1 8.5c-.7.1-1.1.7-1 1.4c.1.7.7 1.1 1.4 1c5.3-1.2 9.8-4.8 12.3-9.5c.4-.7.2-1.5-.5-1.9Z"/></svg>
            <span class="text-2xl font-bold">Floou</span>
          </div>
          <p class="text-gray-400 text-sm">
            Bring Nature Closer to You! Menghadirkan kesegaran alam ke dalam setiap ruangan Anda.
          </p>
        </div>

        <div class="col-span-1">
          <h3 class="font-bold text-lg mb-4">Jelajahi</h3>
          <nav class="space-y-2">
            <RouterLink to="/" class="block text-gray-400 hover:text-white transition-colors">Beranda</RouterLink>
            <RouterLink to="/pesanan" class="block text-gray-400 hover:text-white transition-colors">Pesanan Saya</RouterLink>
          </nav>
        </div>

        <div class="col-span-1">
          <h3 class="font-bold text-lg mb-4">Bantuan</h3>
          <nav class="space-y-2">
            <a href="#" class="block text-gray-400 hover:text-white transition-colors">FAQ</a>
            <a href="#" class="block text-gray-400 hover:text-white transition-colors">Kebijakan Privasi</a>
          </nav>
        </div>

        <div class="col-span-1">
          <h3 class="font-bold text-lg mb-4">Ikuti Kami</h3>
          <div class="flex space-x-4">
            <a href="#" aria-label="Instagram" class="text-gray-400 hover:text-white transition-colors">
              </a>
            <a href="#" aria-label="Facebook" class="text-gray-400 hover:text-white transition-colors">
              </a>
          </div>
        </div>

      </div>

      <div class="mt-10 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm">
        <p>&copy; {{ new Date().getFullYear() }} Floou. All rights reserved.</p>
      </div>

    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>