<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  title: string
  description: string
  enabled: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  toggle: []
}>()

function handleClick() {
  emit('toggle')
}
</script>

<template>
  <li class="bg-slate-800 p-4 rounded-lg mb-2 cursor-pointer" @click="handleClick">
    <div class="flex items-center gap-4">
      <Icon
        :icon="enabled ? 'system-uicons:checkbox-checked' : 'system-uicons:checkbox-empty'"
        :class="enabled ? 'text-blue-500' : 'text-slate-400'"
        height="48"
      />
      <div class="flex flex-col gap-1">
        <label class="text-sm text-slate-300">{{ title }}</label>
        <span class="text-slate-300">{{ description }}</span>
      </div>
    </div>
  </li>
</template>
