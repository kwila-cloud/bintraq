<script setup lang="ts">
import { computed } from 'vue'
import BinsHistoryView from '@/views/BinsHistoryView.vue'
import DailyCountsHistoryView from '@/views/DailyCountsHistoryView.vue'
import { isDailyCountUiEnabled } from '@/lib/utils'

const currentComponent = computed(() => {
  return isDailyCountUiEnabled() ? DailyCountsHistoryView : BinsHistoryView
})
</script>

<template>
  <component :is="currentComponent" />
</template>