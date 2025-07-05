<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ComingSoon from '@/components/ComingSoon.vue'
import { getPickers } from '@/lib/utils'

const pickers = ref([])
const isLoading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    pickers.value = await getPickers()
  } catch (err: any) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">Error loading pickers: {{ error }}</div>
  <div v-else-if="pickers.length === 0">
    <ComingSoon />
  </div>
  <div v-else class="flex flex-col gap-4">
    <h2 class="text-2xl font-bold mb-4">Pickers</h2>
    <ul>
      <li
        v-for="picker in pickers"
        :key="picker.id"
        class="bg-slate-800 p-4 rounded-lg mb-2 flex justify-between items-center"
      >
        <div>
          <span class="font-semibold">{{ picker.name }}</span>
          <p class="text-sm text-slate-300">{{ picker.phoneNumber }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* Add any specific styles here if needed */
</style>
