<template>
  <section class="px-4 sm:px-8 lg:px-16 py-10 bg-[#F9F5F2] min-h-screen">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Keranjang Saya</h1>

    <div v-if="cart.items.length === 0" class="text-center bg-white p-10 rounded-lg shadow-md">
      <p class="text-gray-500 text-lg">Keranjang Anda kosong.</p>
      <RouterLink
        to="/"
        class="mt-4 inline-block bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 transition"
      >
        Mulai Belanja
      </RouterLink>
    </div>

    <div v-else class="grid lg:grid-cols-3 gap-8">
      <!-- Cart Items -->
      <div class="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <div
          v-for="item in cart.items"
          :key="item.id"
          class="flex flex-col sm:flex-row items-center justify-between border-b py-4 gap-4"
        >
          <!-- Image + Name -->
          <div class="flex items-center w-full sm:w-2/5">
            <img
              :src="item.image"
              :alt="item.name"
              class="w-20 h-20 object-cover rounded-md mr-4"
            />
            <p class="font-semibold text-gray-800">{{ item.name }}</p>
          </div>

          <!-- Price -->
          <div class="w-full sm:w-1/5 text-center text-gray-700">
            Rp {{ parseFloat(item.price).toLocaleString('id-ID') }}
          </div>

          <!-- Quantity -->
          <div class="w-full sm:w-1/5 flex justify-center items-center gap-2">
            <button
              @click="cart.updateQuantity(item.id, item.quantity - 1)"
              class="px-3 py-1 border rounded text-gray-800 font-bold bg-white hover:bg-gray-200 shadow-sm"
            >
              -
            </button>
            <span class="px-2 text-gray-800 font-medium">{{ item.quantity }}</span>
            <button
              @click="cart.updateQuantity(item.id, item.quantity + 1)"
              class="px-3 py-1 border rounded text-gray-800 font-bold bg-white hover:bg-gray-200 shadow-sm"
            >
              +
            </button>
          </div>

          <!-- Total + Remove -->
          <div
            class="w-full sm:w-1/5 flex justify-center items-center gap-2 font-medium text-gray-800"
          >
            Rp {{ (item.price * item.quantity).toLocaleString('id-ID') }}
            <button @click="cart.removeItem(item.id)" class="text-red-500 hover:text-red-700">
              <TrashIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-bold border-b pb-2 mb-4 text-gray-800">Ringkasan Pesanan</h2>

        <div class="flex justify-between font-semibold text-gray-700 text-lg border-t pt-3">
          <span>Total Harga</span>
          <span>Rp {{ cart.subtotal.toLocaleString('id-ID') }}</span>
        </div>

        <div class="mt-6">
          <label for="shipping_address" class="font-semibold block mb-2 text-gray-700">
            Alamat Pengiriman
          </label>
          <textarea
            v-model="shipping_address"
            id="shipping_address"
            rows="3"
            class="w-full border rounded-md px-3 py-2 bg-white text-gray-900 placeholder-gray-500 focus:ring-green-500 focus:border-green-500 shadow-sm"
            placeholder="Masukkan alamat lengkap Anda"
          ></textarea>
        </div>

        <div class="mt-4">
          <label for="notes" class="font-semibold block mb-2 text-gray-700">
            Catatan (Opsional)
          </label>
          <input
            v-model="notes"
            id="notes"
            type="text"
            class="w-full border rounded-md px-3 py-2 bg-white text-gray-900 placeholder-gray-500 focus:ring-green-500 focus:border-green-500 shadow-sm"
            placeholder="Catatan untuk penjual"
          />
        </div>

        <div v-if="orderStore.error" class="mt-4 text-red-600 text-sm">
          Error: {{ orderStore.error }}
        </div>

        <button
          @click="handleCheckout"
          :disabled="!isCheckoutReady || orderStore.isLoading"
          class="w-full bg-green-600 text-white font-semibold py-3 rounded-lg mt-6 hover:bg-green-700 disabled:bg-gray-400 transition"
        >
          <span v-if="orderStore.isLoading">Memproses...</span>
          <span v-else>Buat Pesanan</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/order'
import { useAuthStore } from '@/stores/auth'
import { TrashIcon } from '@heroicons/vue/24/outline'

const cart = useCartStore()
const orderStore = useOrderStore()
const authStore = useAuthStore()

const shipping_address = ref(authStore.user?.address || '')
const notes = ref('')

const isCheckoutReady = computed(
  () => shipping_address.value.trim() !== '' && cart.items.length > 0,
)

async function handleCheckout() {
  if (!isCheckoutReady.value) {
    alert('Mohon isi alamat pengiriman.')
    return
  }
  await orderStore.createOrder({
    shipping_address: shipping_address.value,
    notes: notes.value,
  })
}
</script>
