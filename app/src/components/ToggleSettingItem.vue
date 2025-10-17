<script setup lang="ts">
import { Icon } from "@iconify/vue";

interface Props {
  title: string;
  description: string;
  value: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:value": [value: boolean];
}>();

function handleClick() {
  emit("update:value", !props.value);
}
</script>

<template>
  <button
    class="bg-slate-800 p-4 rounded-lg mb-2 cursor-pointer text-left"
    @click="handleClick"
  >
    <div class="flex items-center gap-4">
      <Icon
        :icon="
          value
            ? 'system-uicons:checkbox-checked'
            : 'system-uicons:checkbox-empty'
        "
        :class="value ? 'text-blue-500' : 'text-slate-400'"
        height="48"
      />
      <div class="flex flex-col gap-1">
        <label class="text-sm text-slate-300">{{ title }}</label>
        <span class="text-slate-300">{{ description }}</span>
      </div>
    </div>
  </button>
</template>
