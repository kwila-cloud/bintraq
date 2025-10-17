<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  getComponentKey: () => string
  componentMap: Record<string, any>
}

const props = defineProps<Props>()

const currentComponent = computed(() => {
  const componentKey = props.getComponentKey()
  return props.componentMap[componentKey]
})
</script>

<template>
  <component :is="currentComponent" />
</template>