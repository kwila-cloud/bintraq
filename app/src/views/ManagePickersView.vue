<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import ComingSoon from '@/components/ComingSoon.vue'
import { getPickers } from '@/lib/utils'
import { Icon } from '@iconify/vue'

const pickers = ref([])
const isLoading = ref(true)
const error = ref(null)

const sortedPickers = computed(() => {
  return [...pickers.value].sort((a, b) => a.order - b.order)
})

onMounted(async () => {
  try {
    pickers.value = await getPickers()
  } catch (err: any) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
})

async function handleSavePickers() {
  // AI!: update the pickers in supabase
}

async function handleDeletePicker(pickerUuid: string) {
  if (confirm('Are you sure you want to delete this picker?')) {
    try {
      pickers.value = pickers.value.filter((p) => p.uuid !== pickerUuid)
    } catch (err: any) {
      console.error(`Failed to delete picker: ${err.message}`)
    }
  }
}
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">Error loading pickers: {{ error }}</div>
  <div v-else class="flex flex-col gap-4">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold mb-4">Pickers</h2>
      <button
        class="w-32 bg-blue-800 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2"
        @click="handleSavePickers"
      >
        <Icon icon="system-uicons:check" height="24" />
        Save
      </button>
    </div>
    <ul>
      <li
        v-for="picker in sortedPickers"
        :key="picker.uuid"
        class="bg-slate-800 p-4 rounded-lg mb-2 flex flex-col gap-2"
      >
        <div class="flex flex-col gap-1">
          <label :for="`name-${picker.uuid}`" class="text-sm text-slate-300">Name</label>
          <input
            :id="`name-${picker.uuid}`"
            type="text"
            v-model="picker.name"
            class="bg-slate-700 p-2 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label :for="`phone-${picker.uuid}`" class="text-sm text-slate-300">Phone Number</label>
          <input
            :id="`phone-${picker.uuid}`"
            type="text"
            v-model="picker.phoneNumber"
            class="bg-slate-700 p-2 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label :for="`order-${picker.uuid}`" class="text-sm text-slate-300">Order</label>
          <input
            :id="`order-${picker.uuid}`"
            type="number"
            v-model="picker.order"
            class="bg-slate-700 p-2 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          @click="handleDeletePicker(picker.uuid)"
          class="w-32 bg-red-800 text-white p-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center gap-2"
        >
          <Icon icon="system-uicons:trash" height="24" />
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* Add any specific styles here if needed */
</style>
