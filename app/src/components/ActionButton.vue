<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  text: string
  icon?: string
  color?: 'blue' | 'green' | 'red'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: '',
  color: 'blue',
  disabled: false,
})

const emit = defineEmits(['click'])

const colorMap = {
  blue: 'bg-blue-800 text-white enabled:hover:bg-blue-600 focus:ring-blue-500',
  green: 'bg-green-800 text-white enabled:hover:bg-green-600 focus:ring-green-500',
  red: 'bg-red-800 text-white enabled:hover:bg-red-700 focus:ring-red-500',
}

const buttonClasses = computed(() => {
  const baseClasses =
    'p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 flex items-center justify-center gap-2'
  const colorClasses = colorMap[props.color]
  const opacityClasses = props.disabled ? 'opacity-50' : ''
  return `${baseClasses} ${colorClasses} ${opacityClasses}`
})
</script>

<template>
  <button :class="buttonClasses" @click="emit('click')" :disabled="props.disabled">
    <Icon v-if="props.icon" :icon="props.icon" height="24" />
    {{ props.text }}
  </button>
</template>
