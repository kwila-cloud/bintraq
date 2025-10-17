<script setup lang="ts">
import { ref } from "vue";
import { countOptions } from '@/models/dailyCount'

const props = defineProps({
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

const dialogOpen = ref(false);
const newValue = ref(props.modelValue);

const openDialog = () => {
  newValue.value = props.modelValue;
  dialogOpen.value = true;
};

const closeDialog = () => {
  dialogOpen.value = false;
};

const saveValue = () => {
  emit("update:modelValue", newValue.value);
  closeDialog();
};

const selectCount = (count: number) => {
  newValue.value = count;
  saveValue();
};
</script>

<template>
  <div class="h-full">
    <button
      @click="openDialog"
      class="h-full bg-gray-800 p-1 md:p-2 rounded-lg w-full flex flex-col items-center justify-center"
    >
      <h1 class="text-md md:text-lg">{{ setting.name }}</h1>
      <div class="value text-lg md:text-xl leading-normal">
        {{ modelValue || "-" }}
      </div>
    </button>

    <div
      v-if="dialogOpen"
      class="fixed top-0 left-0 w-full h-full bg-gray-900/50 flex items-center justify-center p-4"
      @click.self="closeDialog"
    >
      <div class="min-w-[300px] max-w-md p-4 rounded-md bg-gray-800">
        <h2 class="text-lg font-bold mb-4">{{ setting.name }}</h2>

        <div class="grid grid-cols-5 gap-2 max-h-[60vh] overflow-y-auto">
          <button
            v-for="count in countOptions"
            :key="count"
            @click="selectCount(count)"
            class="h-12 rounded-md cursor-pointer flex items-center justify-center text-lg font-medium transition-colors"
            :class="[
              newValue === count
                ? 'bg-blue-700 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-white',
            ]"
          >
            {{ count }}
          </button>
        </div>

        <div class="flex justify-end mt-4 gap-2">
          <button @click="closeDialog" class="bg-gray-700 text-white p-2 rounded-md">
            Cancel
          </button>
          <button
            @click="saveValue"
            :disabled="newValue === 0"
            class="bg-blue-700 disabled:opacity-50 text-white p-2 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>