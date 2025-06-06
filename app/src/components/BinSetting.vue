<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  setting: {
    type: Object,
    required: true,
  },
  modelValue: {
    type: String,
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
      class="fixed top-0 left-0 w-full h-full bg-gray-900/50 flex items-center justify-center"
      @click.self="closeDialog"
    >
      <div class="min-w-[300px] p-4 rounded-md bg-gray-800">
        <h2 class="text-lg font-bold mb-2">{{ setting.name }}</h2>

        <div v-if="setting.type === 'select'">
          <select
            v-model="newValue"
            class="w-full p-2 border rounded-md bg-gray-800"
          >
            <option
              v-for="option in setting.options"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </div>

        <div v-else-if="setting.type === 'text'">
          <input
            type="text"
            v-model="newValue"
            class="w-full p-2 border rounded-md"
          />
        </div>

        <div class="flex justify-end mt-4 gap-2">
          <button @click="closeDialog" class="bg-gray-700 p-2 rounded-md">
            Cancel
          </button>
          <button
            @click="saveValue"
            :disabled="newValue === ''"
            class="bg-blue-700 disabled:opacity-50 text-white p-2 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
