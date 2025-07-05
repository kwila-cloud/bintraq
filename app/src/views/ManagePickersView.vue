<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import ActionButton from '@/components/ActionButton.vue'
import { getOrganization, getPickers, savePickers } from '@/lib/utils'
import { Icon } from '@iconify/vue'
import { type Picker } from '@/models/picker'
import MenuModal from '@/components/MenuModal.vue'

const pickers = ref<Picker[]>([])
const isLoading = ref(true)
const error = ref(null)
const showReorderModal = ref(false)
let draggedItemIndex = -1

// Sort by order and only include non-deleted
const displayPickers = computed(() => {
  return [...pickers.value].sort((a, b) => a.order - b.order).filter((p) => !p.isDeleted)
})

onMounted(async () => {
  await loadPickers()
})

async function loadPickers() {
  try {
    isLoading.value = true
    pickers.value = await getPickers(true)
    isLoading.value = false
  } catch (err: any) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

async function handleAddPicker() {
  const organization = await getOrganization()
  pickers.value = [
    ...pickers.value,
    {
      uuid: crypto.randomUUID(),
      organizationUuid: organization.uuid,
      order: pickers.value.length + 1,
      name: 'New Picker',
      phoneNumber: '',
      createdAt: new Date().toISOString(),
      isDeleted: false,
    },
  ]
}

async function handleReorderPickers() {
  showReorderModal.value = true
}

function closeReorderModal() {
  showReorderModal.value = false
}

async function saveReorder(orderedPickers: Picker[]) {
  pickers.value = orderedPickers.map((p, index) => ({
    ...p,
    order: index + 1,
  }))
  await handleSavePickers()
  closeReorderModal()
}

async function handleSavePickers() {
  try {
    await savePickers(pickers.value)
    alert('Pickers saved successfully!')
    await loadPickers()
  } catch (err: any) {
    console.error(`Failed to save pickers: ${err.message}`)
    alert(`Failed to save pickers: ${err.message}`)
  }
}

async function handleDeletePicker(pickerUuid: string) {
  if (confirm('Are you sure you want to delete this picker?')) {
    pickers.value = pickers.value.map((p) =>
      p.uuid === pickerUuid ? { ...p, isDeleted: true } : p,
    )
  }
}

function onDragStart(event: DragEvent, index: number) {
  draggedItemIndex = index
  event.dataTransfer?.effectAllowed = 'move'
}

function onDragOver(event: DragEvent, index: number) {
  event.preventDefault()
  event.dataTransfer!.dropEffect = 'move'
  if (index !== draggedItemIndex) {
    const newPickers = [...displayPickers.value]
    const draggedItem = newPickers.splice(draggedItemIndex, 1)[0]
    newPickers.splice(index, 0, draggedItem)
    pickers.value = newPickers.map((p, i) => ({ ...p, order: i + 1 }))
    draggedItemIndex = index
  }
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  // The actual reordering is handled in onDragOver for immediate visual feedback
  // We just need to reset the draggedItemIndex here
  draggedItemIndex = -1
}

</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">Error loading pickers: {{ error }}</div>
  <div v-else class="flex flex-col md:gap-4 gap-2">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold">Pickers</h2>
      <div class="flex gap-2">
        <ActionButton
          text="New Picker"
          icon="system-uicons:plus"
          color="blue"
          @click="handleAddPicker"
        />
        <ActionButton
          text="Reorder"
          icon="system-uicons:list-numbered"
          color="blue"
          @click="handleReorderPickers"
        />
        <ActionButton
          text="Save"
          icon="system-uicons:check"
          color="green"
          @click="handleSavePickers"
        />
      </div>
    </div>
    <ul>
      <li
        v-for="(picker, index) in displayPickers"
        :key="picker.uuid"
        class="bg-slate-800 p-4 rounded-lg mb-2 flex flex-col gap-2"
        draggable="true"
        @dragstart="onDragStart($event, index)"
        @dragover.prevent="onDragOver($event, index)"
        @drop.prevent="onDrop($event)"
      >
        <div class="flex flex-col gap-1">
          <label :for="`name-${picker.uuid}`" class="text-sm text-slate-300">Name</label>
          <input
            :id="`name-${picker.uuid}`"
            type="text"
            v-model="picker.name"
            class="bg-slate-700 p-2 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label :for="`phone-${picker.uuid}`" class="text-sm text-slate-300">Phone Number</label>
          <input
            :id="`phone-${picker.uuid}`"
            type="text"
            v-model="picker.phoneNumber"
            class="bg-slate-700 p-2 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <ActionButton
          text="Delete"
          icon="system-uicons:trash"
          color="red"
          class="max-w-32"
          @click="handleDeletePicker(picker.uuid)"
        />
      </li>
    </ul>
  </div>

  <MenuModal
    v-if="showReorderModal"
    title="Reorder Pickers"
    @close="closeReorderModal"
    :draggable="true"
  >
    <template v-slot="{ dragStart, dragOver, drop }">
      <div
        v-for="(picker, index) in displayPickers"
        :key="picker.uuid"
        class="p-3 bg-slate-700 rounded-md cursor-grab flex justify-between items-center"
        draggable="true"
        @dragstart="dragStart($event, index)"
        @dragover.prevent="dragOver($event, index)"
        @drop.prevent="drop($event, index)"
      >
        <span>{{ picker.name }}</span>
        <Icon icon="system-uicons:drag" class="text-slate-300" />
      </div>
    </template>
    <template v-slot:footer>
      <ActionButton text="Save Order" color="green" @click="saveReorder(displayPickers)" />
    </template>
  </MenuModal>
</template>

<style scoped>
/* Add any specific styles here if needed */
</style>
