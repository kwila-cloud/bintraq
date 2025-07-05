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
        class="bg-slate-800 p-4 rounded-lg mb-2 flex flex-col gap-2"
      >
        <div class="flex flex-col gap-1">
          <label :for="`name-${picker.id}`" class="text-sm text-slate-300">Name</label>
          <input
            :id="`name-${picker.id}`"
            type="text"
            v-model="picker.name"
            class="bg-slate-700 p-2 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label :for="`phone-${picker.id}`" class="text-sm text-slate-300">Phone Number</label>
          <input
            :id="`phone-${picker.id}`"
            type="text"
            v-model="picker.phoneNumber"
            class="bg-slate-700 p-2 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label :for="`order-${picker.id}`" class="text-sm text-slate-300">Order</label>
          <input
            :id="`order-${picker.id}`"
            type="number"
            v-model="picker.order"
            class="bg-slate-700 p-2 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* Add any specific styles here if needed */
</style>
