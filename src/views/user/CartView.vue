<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Keranjang Saya</h1>
    <div v-if="cart.items.length === 0" class="text-center bg-white p-10 rounded-lg shadow">
        <p class="text-gray-500 text-lg">Keranjang Anda kosong.</p>
        <RouterLink to="/" class="mt-4 inline-block bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700">Mulai Belanja</RouterLink>
    </div>
    <div v-else class="grid lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 bg-white p-6 rounded-lg shadow">
        <div v-for="item in cart.items" :key="item.id" class="flex items-center border-b py-4">
          <div class="w-2/5 flex items-center">
            <img :src="item.image" :alt="item.name" class="w-20 h-20 object-cover rounded-md mr-4">
            <p class="font-bold">{{ item.name }}</p>
          </div>
          <div class="w-1/5 text-center">Rp {{ parseFloat(item.price).toLocaleString('id-ID') }}</div>
          <div class="w-1/5 flex justify-center items-center">
            <button @click="cart.updateQuantity(item.id, item.quantity - 1)" class="px-2 border rounded">-</button>
            <span class="px-4">{{ item.quantity }}</span>
            <button @click="cart.updateQuantity(item.id, item.quantity + 1)" class="px-2 border rounded">+</button>
          </div>
          <div class="w-1/5 text-center font-semibold">Rp {{ (item.price * item.quantity).toLocaleString('id-ID') }}</div>
          <button @click="cart.removeItem(item.id)" class="text-red-500 ml-4 hover:text-red-700">
             <TrashIcon class="h-6 w-6"/>
          </button>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-bold border-b pb-2 mb-4">Ringkasan Pesanan</h2>
          <div class="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total Harga</span>
            <span>Rp {{ cart.subtotal.toLocaleString('id-ID') }}</span>
          </div>
          
          <div class="mt-6">
            <label for="shipping_address" class="font-semibold block mb-2">Alamat Pengiriman</label>
            <textarea v-model="shipping_address" id="shipping_address" rows="3" class="w-full border rounded-md px-3 py-2" placeholder="Masukkan alamat lengkap Anda"></textarea>
          </div>

          <div class="mt-4">
            <label for="notes" class="font-semibold block mb-2">Catatan (Opsional)</label>
            <input v-model="notes" id="notes" type="text" class="w-full border rounded-md px-3 py-2" placeholder="Catatan untuk penjual">
          </div>

          <div v-if="orderStore.error" class="mt-4 text-red-600 text-sm">
              Error: {{ orderStore.error }}
          </div>
          
          <button @click="handleCheckout" :disabled="!isCheckoutReady || orderStore.isLoading" class="w-full bg-green-600 text-white font-bold py-3 rounded-lg mt-6 hover:bg-green-700 disabled:bg-gray-400">
            <span v-if="orderStore.isLoading">Memproses...</span>
            <span v-else>Buat Pesanan</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useOrderStore } from '@/stores/order';
import { useAuthStore } from '@/stores/auth';
import { TrashIcon } from '@heroicons/vue/24/outline';

const cart = useCartStore();
const orderStore = useOrderStore();
const authStore = useAuthStore();

const shipping_address = ref(authStore.user?.address || '');
const notes = ref('');

const isCheckoutReady = computed(() => shipping_address.value.trim() !== '' && cart.items.length > 0);

async function handleCheckout() {
    if (!isCheckoutReady.value) {
        alert("Mohon isi alamat pengiriman.");
        return;
    }
    await orderStore.createOrder({
        shipping_address: shipping_address.value,
        notes: notes.value
    });
}
</script>