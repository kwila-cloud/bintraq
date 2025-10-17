<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import SettingItem from '@/components/SettingItem.vue'

const dailyCountUiEnabled = ref(false)

onMounted(() => {
  const stored = localStorage.getItem('dailyCountUiEnabled')
  dailyCountUiEnabled.value = stored === 'true'
})

// Watch for changes to save to localStorage
watch(dailyCountUiEnabled, (newValue) => {
  localStorage.setItem('dailyCountUiEnabled', newValue.toString())
})
</script>

<template>
  <div class="flex flex-col md:gap-4 gap-2 p-4">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold">Settings</h2>
    </div>
    <ul>
      <SettingItem
        title="Enable Daily Count UI (Experimental)"
        description="Use daily count interface instead of individual bin entry"
        :enabled="dailyCountUiEnabled"
        @toggle="dailyCountUiEnabled = !dailyCountUiEnabled"
      />
    </ul>
  </div>
</template>
