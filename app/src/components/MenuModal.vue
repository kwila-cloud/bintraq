<script setup lang="ts">
import { Icon } from '@iconify/vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Menu',
  },
  draggable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

function closeModal() {
  emit('close')
}

// Drag and drop handlers to be passed to the slot
function dragStart(event: DragEvent, index: number) {
  event.dataTransfer?.setData('text/plain', index.toString())
  event.dataTransfer!.effectAllowed = 'move'
}

function dragOver(event: DragEvent, index: number) {
  event.preventDefault()
  event.dataTransfer!.dropEffect = 'move'
}

function drop(event: DragEvent, index: number) {
  event.preventDefault()
  const draggedIndex = parseInt(event.dataTransfer!.getData('text/plain'))
  emit('drop', { draggedIndex, targetIndex: index })
}
</script>

<template>
  <div
    class="fixed top-0 left-0 w-full h-full bg-black/60 flex justify-center items-center z-1000"
    @click.self="closeModal"
  >
    <div class="bg-slate-800 p-5 rounded-lg relative min-w-[250px] shadow-lg">
      <h1 class="text-xl font-bold mb-4 text-center">{{ props.title }}</h1>
      <div class="flex flex-col gap-2">
        <slot :dragStart="dragStart" :dragOver="dragOver" :drop="drop"></slot>
      </div>
      <div v-if="$slots.footer" class="mt-4 pt-4 border-t border-slate-700">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>
