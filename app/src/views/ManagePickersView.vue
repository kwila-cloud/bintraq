<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import ActionButton from "@/components/ActionButton.vue";
import PageLayout from "@/components/PageLayout.vue";
import { getOrganization, getPickers, savePickers } from "@/lib/utils";
import { Icon } from "@iconify/vue";
import { type Picker } from "@/models/picker";

const pickers = ref<Picker[]>([]);
const isLoading = ref(true);
const error = ref(null);

// Only include non-deleted
const displayPickers = computed(() =>
  [...pickers.value].filter((p) => !p.isDeleted),
);

onMounted(async () => {
  await loadPickers();
});

async function loadPickers() {
  try {
    isLoading.value = true;
    pickers.value = await getPickers(true);
    isLoading.value = false;
  } catch (err: any) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
}

async function handleAddPicker() {
  const organization = await getOrganization();
  const name = (prompt("Picker Name") ?? "").trim();
  if (name == "") {
    return;
  }
  const phoneNumber = (prompt("Picker Phone Number") ?? "").trim();
  if (phoneNumber == "") {
    return;
  }
  pickers.value = [
    ...pickers.value,
    {
      uuid: crypto.randomUUID(),
      organizationUuid: organization.uuid,
      name,
      phoneNumber,
      createdAt: new Date().toISOString(),
      isDeleted: false,
    },
  ];
}

async function handleSavePickers() {
  try {
    await savePickers(pickers.value);
    alert("Pickers saved successfully!");
    await loadPickers();
  } catch (err: any) {
    console.error(`Failed to save pickers: ${err.message}`);
    alert(`Failed to save pickers: ${err.message}`);
  }
}

async function handleDeletePicker(pickerUuid: string) {
  if (confirm("Are you sure you want to delete this picker?")) {
    pickers.value = pickers.value.map((p) =>
      p.uuid === pickerUuid ? { ...p, isDeleted: true } : p,
    );
  }
}
</script>

<template>
  <PageLayout title="Pickers" :is-loading="isLoading" :error="error">
    <template #headerActions>
      <ActionButton
        text="New Picker"
        icon="system-uicons:plus"
        color="blue"
        @click="handleAddPicker"
      />
      <ActionButton
        text="Save"
        icon="system-uicons:check"
        color="green"
        @click="handleSavePickers"
      />
    </template>
    <template #description>
      <p>Be sure to include the country code prefix on each phone number.</p>
    </template>
    <div
      v-for="picker in displayPickers"
      :key="picker.uuid"
      class="bg-slate-800 p-4 rounded-lg mb-2 flex flex-col gap-2"
    >
      <div class="flex flex-col gap-1">
        <label :for="`name-${picker.uuid}`" class="text-sm text-slate-300"
          >Name</label
        >
        <input
          :id="`name-${picker.uuid}`"
          type="text"
          v-model="picker.name"
          class="bg-slate-700 p-2 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label :for="`phone-${picker.uuid}`" class="text-sm text-slate-300"
          >Phone Number</label
        >
        <input
          :id="`phone-${picker.uuid}`"
          type="text"
          v-model="picker.phoneNumber"
          class="bg-slate-700 p-2 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="flex flex-row gap-1">
        <ActionButton
          text="Delete"
          icon="system-uicons:trash"
          color="red"
          @click="handleDeletePicker(picker.uuid)"
        />
      </div>
    </div>
  </PageLayout>
</template>
