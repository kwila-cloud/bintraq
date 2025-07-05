<script setup lang="ts">
import { Icon } from '@iconify/vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Menu',
  },
})

const emit = defineEmits(['close'])

function closeModal() {
  emit('close')
}
</script>

<template>
  <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex justify-center items-center z-1000" @click.self="closeModal">
    <div class="bg-slate-800 p-5 rounded-lg relative min-w-[250px] shadow-lg">
      <h1 class="text-xl font-bold mb-4 text-center">{{ props.title }}</h1>
      <div class="flex flex-col gap-4">
        <slot name="menu-items"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* All styles have been moved to the template using Tailwind CSS */
</style>
