<script setup lang="ts">
import { Icon } from "@iconify/vue";

interface Props {
  title: string;
  isLoading?: boolean;
  error?: string | null;
}

defineProps<Props>();

const slots = defineSlots<{
  headerActions?: any;
  description?: any;
  default: any;
}>();
</script>

<template>
  <div v-if="isLoading" class="h-full p-4 flex items-center justify-center">
    <Icon icon="svg-spinners:90-ring-with-bg" height="36" class="text-white" />
  </div>
  <div v-else-if="error" class="p-4">Error loading: {{ error }}</div>
  <div v-else class="flex flex-col md:gap-4 gap-2 p-4">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold">{{ title }}</h2>
      <div v-if="$slots.headerActions" class="flex gap-2">
        <slot name="headerActions" />
      </div>
    </div>
    <div v-if="$slots.description" class="text-slate-300">
      <slot name="description" />
    </div>
    <slot />
  </div>
</template>
