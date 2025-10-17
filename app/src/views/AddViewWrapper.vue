<script setup lang="ts">
import { computed } from 'vue'
import AddBinView from '@/views/AddBinView.vue'
import AddDailyCountView from '@/views/AddDailyCountView.vue'
import { isDailyCountUiEnabled } from '@/lib/utils'

const currentComponent = computed(() => {
  return isDailyCountUiEnabled() ? AddDailyCountView : AddBinView
})
</script>

<template>
  <component :is="currentComponent" />
</template>