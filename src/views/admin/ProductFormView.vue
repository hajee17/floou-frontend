<template>
  <div class="max-w-2xl mx-auto text-gray-800">
    <div class="flex items-center gap-4 mb-8">
      <RouterLink :to="{ name: 'admin-products' }" class="p-2 rounded-full hover:bg-gray-200">
        <ArrowLeftIcon class="h-6 w-6 text-gray-800" />
      </RouterLink>
      <h1 class="text-3xl font-bold">{{ isEditMode ? 'Edit Produk' : 'Tambah Produk Baru' }}</h1>
    </div>

    <form
      @submit.prevent="handleSubmit"
      class="bg-white text-gray-900 p-8 rounded-xl shadow-sm space-y-6"
    >
      <div>
        <label class="label">Nama Produk</label>
        <input type="text" v-model="form.name" class="input-field" required />
      </div>
      <div>
        <label class="label">Deskripsi Produk</label>
        <textarea rows="4" v-model="form.description" class="input-field" required></textarea>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div>
          <label class="label">Kategori Produk</label>
          <select v-model="form.category_id" class="input-field" required>
            <option disabled value="">Pilih Kategori</option>
            <option v-for="cat in productStore.categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="label">Tipe Tanaman</label>
          <select v-model="form.plant_type_id" class="input-field" required>
            <option disabled value="">Pilih Tipe</option>
            <option v-for="type in productStore.plantTypes" :key="type.id" :value="type.id">
              {{ type.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div>
          <label class="label">Harga</label>
          <input type="number" v-model="form.price" class="input-field" required min="0" />
        </div>
        <div>
          <label class="label">Stok Produk</label>
          <input type="number" v-model="form.stock" class="input-field" required min="0" />
        </div>
      </div>

      <div>
        <label class="label">Gambar Produk</label>
        <input
          type="file"
          @change="handleFileChange"
          accept="image/*"
          class="block w-full text-sm text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
        />
        <div v-if="imagePreview" class="mt-4">
          <img
            :src="imagePreview"
            class="w-40 h-40 object-cover rounded-lg border border-gray-300 shadow-sm"
          />
        </div>
      </div>

      <div class="pt-4">
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:text-white"
        >
          <span v-if="isLoading">Menyimpan...</span>
          <span v-else>Simpan Produk</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useProductStore } from '@/stores/product'
import apiClient from '@/service/api'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  id: String,
})

const router = useRouter()
const productStore = useProductStore()
const isEditMode = computed(() => !!props.id)
const isLoading = ref(false)

const form = ref({
  name: '',
  description: '',
  category_id: '',
  plant_type_id: '',
  price: 0,
  stock: 0,
})
const imageFile = ref(null)
const imagePreview = ref(null)

onMounted(async () => {
  await productStore.fetchCategories()
  await productStore.fetchPlantTypes()

  if (isEditMode.value) {
    await productStore.fetchPlant(props.id)
    const product = productStore.plant
    if (product) {
      form.value = {
        name: product.name,
        description: product.description,
        category_id: product.category_id,
        plant_type_id: product.plant_type_id,
        price: parseFloat(product.price),
        stock: product.stock,
      }
      imagePreview.value = product.imageUrl
    }
  }
})

function handleFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

async function handleSubmit() {
  isLoading.value = true
  const formData = new FormData()
  Object.keys(form.value).forEach((key) => {
    formData.append(key, form.value[key])
  })
  if (imageFile.value) {
    formData.append('image', imageFile.value)
  }

  try {
    if (isEditMode.value) {
      formData.append('_method', 'POST')
      await apiClient.post(`/plants/${props.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    } else {
      await apiClient.post('/plants', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }
    alert('Produk berhasil disimpan!')
    router.push({ name: 'admin-products' })
  } catch (error) {
    console.error('Gagal menyimpan produk:', error.response?.data)
    alert('Gagal menyimpan produk. Cek konsol untuk detail.')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.label {
  @apply font-semibold text-sm text-gray-800 block mb-1;
}
.input-field {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900
         focus:outline-none focus:ring-2 focus:ring-green-500;
}
</style>
