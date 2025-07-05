<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  text: string
  icon?: string
  color?: 'blue' | 'green' | 'red'
}

const props = withDefaults(defineProps<Props>(), {
  icon: '',
  color: 'blue',
})

const emit = defineEmits(['click'])

const colorMap = {
  blue: 'bg-blue-800 text-white hover:bg-blue-600 focus:ring-blue-500',
  green: 'bg-green-800 text-white hover:bg-green-600 focus:ring-green-500',
  red: 'bg-red-800 text-white hover:bg-red-700 focus:ring-red-500',
}

const buttonClasses = computed(() => {
  const baseClasses =
    'p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 flex items-center justify-center gap-2'
  const colorClasses = colorMap[props.color]
  return `${baseClasses} ${colorClasses}`
})
</script>

<template>
  <button :class="buttonClasses" @click="emit('click')">
    <Icon v-if="icon" :icon="icon" height="24" />
    {{ text }}
  </button>
</template>
