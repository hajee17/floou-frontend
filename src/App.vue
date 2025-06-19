<template>
  <div class="bg-gray-50 min-h-screen font-sans">
    <Navbar v-if="!isAdminRoute" />

    <main>
      <RouterView />
    </main>

    <Footer v-if="!isAdminRoute" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Navbar from './views/components/NavbarView.vue'
import Footer from './views/components/FooterView.vue'

const route = useRoute()

const isAdminRoute = computed(() => route.path.startsWith('/admin'))
</script>
