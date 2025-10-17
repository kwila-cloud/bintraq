<script setup lang="ts">
const countOptions = Array.from({ length: 25 }, (_, i) => i + 1)

defineProps({
  setting: {
    type: Object,
    required: true,
  },
  modelValue: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const selectCount = (count: number) => {
  emit("update:modelValue", count);
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <h1 class="text-md md:text-lg font-medium">{{ setting.name }}</h1>
    <div class="grid grid-cols-5 gap-2">
      <button
        v-for="count in countOptions"
        :key="count"
        @click="selectCount(count)"
        class="h-12 rounded-md cursor-pointer flex items-center justify-center text-lg font-medium transition-colors"
        :class="[
          modelValue === count
            ? 'bg-blue-700 text-white'
            : 'bg-gray-700 hover:bg-gray-600 text-white',
        ]"
      >
        {{ count }}
      </button>
    </div>
  </div>
</template>