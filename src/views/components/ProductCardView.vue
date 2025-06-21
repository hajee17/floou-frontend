<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden text-center group border">
    <RouterLink :to="`/produk/${product.id}`">
      <img
        :src="product.imageUrl"
        :alt="product.name"
        class="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
      />
    </RouterLink>
    <div class="p-4">
      <h3 class="font-semibold text-gray-800 truncate">{{ product.name }}</h3>
      <p class="text-green-600 font-bold my-2">
        Rp {{ parseFloat(product.price).toLocaleString('id-ID') }}
      </p>
      <button
        @click="handleAddToCart"
        class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
      >
        <PlusIcon class="h-5 w-5" />
        Keranjang
      </button>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { PlusIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const cartStore = useCartStore()

function handleAddToCart() {
  cartStore.addItem(props.product, 1)
  alert(`${props.product.name} telah ditambahkan ke keranjang!`)
}
</script>
