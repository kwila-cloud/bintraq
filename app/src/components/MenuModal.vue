<script setup lang="ts">
import { Icon } from '@iconify/vue'

const emit = defineEmits(['close'])

function closeModal() {
  emit('close')
}
</script>

<template>
  <div class="modal-backdrop" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">
        <Icon icon="system-uicons:close" height="24" />
      </button>
      <div class="menu-items-container">
        <slot name="menu-items"></slot>
      </div>
    </div>
  </div>
</template>

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

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-white);
}

.menu-items-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

.menu-items-container a,
.menu-items-container button {
  color: var(--color-white);
  text-decoration: none;
  font-size: 1.1rem;
  padding: 10px;
  border-radius: 4px;
  background: var(--color-slate-700);
  text-align: center;
  cursor: pointer;
  border: none;
}

.menu-items-container button {
  background: var(--color-red-600);
}
</style>
