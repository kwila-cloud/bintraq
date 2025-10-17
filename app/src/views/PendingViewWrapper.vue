<script setup lang="ts">
import { computed } from 'vue'
import PendingBinsView from '@/views/PendingBinsView.vue'
import PendingDailyCountsView from '@/views/PendingDailyCountsView.vue'
import { isDailyCountUiEnabled } from '@/lib/utils'

const currentComponent = computed(() => {
  return isDailyCountUiEnabled() ? PendingDailyCountsView : PendingBinsView
})
</script>

<template>
  <component :is="currentComponent" />
</template>