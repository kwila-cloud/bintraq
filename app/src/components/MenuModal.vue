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
  <div class="modal-backdrop" @click.self="closeModal">
    <div class="modal-content">
      <h1 class="text-xl font-bold mb-4">{{ props.title }}</h1>
      <div class="flex flex-col gap-4">
        <slot name="menu-items"></slot>
      </div>
    </div>
  </div>
</template>

// AI!: replace styles with tailwind in the template
<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--color-slate-800);
  padding: 20px;
  border-radius: 8px;
  position: relative;
  min-width: 250px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
