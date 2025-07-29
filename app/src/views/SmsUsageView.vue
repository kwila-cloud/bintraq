<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { MonthlyUsage } from "@/models/monthlyUsage";
import { getAllUsage, getLimit, setLimit } from "@/lib/smoketreeClient";
import ActionButton from "@/components/ActionButton.vue";

const monthlyUsage = ref<(MonthlyUsage & { canUpdateLimit: boolean })[]>([]);
const selectedMonth = ref<MonthlyUsage | null>(null);
const newMonthlyLimit = ref(0);

async function loadUsage() {
  const usage: (MonthlyUsage & { canUpdateLimit: boolean })[] = (
    await getAllUsage()
  ).map((d) => ({ ...d, canUpdateLimit: false }));
  usage[0].canUpdateLimit = true;
  // Add next month so the limit can be set ahead of time.
  const nextMonth = getNextMonth();
  const segmentLimit = await getLimit(nextMonth);
  usage.unshift({
    month: nextMonth,
    totalMessages: 0,
    totalSegments: 0,
    segmentLimit,
    canUpdateLimit: true,
  });
  monthlyUsage.value = usage;
}

const getNextMonth = () => {
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const year = nextMonth.getFullYear();
  const month = String(nextMonth.getMonth() + 1).padStart(2, "0"); // getMonth() is 0-based
  return `${year}-${month}`;
};

onMounted(() => {
  loadUsage();
});

const closeDialog = () => {
  selectedMonth.value = null;
};

const saveNewMonthlyLimit = async () => {
  if (selectedMonth.value == null) {
    return;
  }
  const currentUsage = selectedMonth.value!.totalSegments;
  if (newMonthlyLimit.value >= 0) {
    if (newMonthlyLimit.value < currentUsage) {
      alert(`Limit must be at least ${currentUsage}`);
    } else {
      await setLimit(selectedMonth.value!.month, newMonthlyLimit.value);
      await loadUsage();
    }
  } else {
    alert("Please enter a valid limit");
  }
  closeDialog();
};
</script>

<template>
  <ul class="p-4 flex flex-col gap-2">
    <li
      v-for="month in monthlyUsage"
      :key="month.month"
      class="p-2 rounded-lg bg-slate-800 flex flex-col items-center gap-2"
    >
      <h2 class="text-2xl">{{ month.month }}</h2>
      <div class="flex gap-2 w-full">
        <div class="box">
          <span>Segments</span>
          <span>{{ month.totalSegments }} / {{ month.segmentLimit }}</span>
        </div>
        <div class="box">
          <span>Messages</span>
          <span>{{ month.totalMessages }}</span>
        </div>
      </div>
      <ActionButton
        v-if="month.canUpdateLimit"
        @click="
          selectedMonth = month;
          newMonthlyLimit = month.segmentLimit;
        "
        text="Update Segment Limit"
      />
    </li>
  </ul>

  <div
    v-if="selectedMonth"
    class="fixed top-0 left-0 w-full h-full bg-gray-900/50 flex items-center justify-center"
    @click.self="closeDialog"
  >
    <div class="min-w-[300px] p-4 rounded-md bg-gray-800">
      <h2 class="text-lg font-bold mb-2">Segment Limit</h2>
      <div>
        <input
          type="number"
          min="0"
          v-model="newMonthlyLimit"
          class="w-full p-2 border rounded-md"
        />
      </div>
      <div class="flex justify-end mt-4 gap-2">
        <button @click="closeDialog" class="bg-gray-700 p-2 rounded-md">
          Cancel
        </button>
        <button
          @click="saveNewMonthlyLimit"
          :disabled="newMonthlyLimit < 0"
          class="bg-blue-700 disabled:opacity-50 text-white p-2 rounded-md"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.box {
  padding: var(--spacing) calc(var(--spacing) * 4);
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px var(--color-slate-700) solid;
  border-radius: calc(var(--spacing) * 2);
}
.box :last-child {
  font-size: var(--text-3xl);
}
</style>
