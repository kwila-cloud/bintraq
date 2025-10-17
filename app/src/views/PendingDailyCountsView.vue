<script setup lang="ts">
import { supabase } from "@/lib/supabaseClient";
import { sendMessages } from "@/lib/smoketreeClient";
import { ref, onMounted, computed } from "vue";
import { getSettings, type Setting } from "@/models/settings";
import type { DailyCount } from "@/models/dailyCount";
import { getOrganization, getPickers } from "@/lib/utils";
import { Icon } from "@iconify/vue";

const dailyCounts = ref<DailyCount[]>([]);
const settings = ref<Setting[]>([]);
const isSending = ref(false);
const editingCount = ref<DailyCount | null>(null);
const tempCount = ref<number>(0);

const totalCounts = computed(() =>
  dailyCounts.value.reduce((sum, count) => sum + count.count, 0),
);

onMounted(() => {
  loadPendingDailyCounts();
  getPickers().then((pickers) => (settings.value = getSettings(pickers)));
});

async function loadPendingDailyCounts() {
  const { data } = await supabase
    .from("dailyCount")
    .select()
    .eq("isPending", true)
    .order("picker");
  dailyCounts.value = data as DailyCount[];
}

async function updateDailyCount(dailyCount: DailyCount) {
  await supabase
    .from("dailyCount")
    .update(dailyCount)
    .eq("uuid", dailyCount.uuid)
    .select();
}

async function deleteDailyCount(dailyCount: DailyCount) {
  if (
    confirm(
      `Are you sure you want to delete daily count for ${dailyCount.picker}?`,
    )
  ) {
    await supabase.from("dailyCount").delete().eq("uuid", dailyCount.uuid);
    await loadPendingDailyCounts();
  }
}

function openEditDialog(dailyCount: DailyCount) {
  editingCount.value = dailyCount;
  tempCount.value = dailyCount.count;
}

async function updateCount() {
  if (editingCount.value) {
    editingCount.value.count = tempCount.value;
    await updateDailyCount(editingCount.value);
    await loadPendingDailyCounts();
    editingCount.value = null;
  }
}

function cancelEdit() {
  editingCount.value = null;
  tempCount.value = 0;
}

async function sendDailyCounts() {
  isSending.value = true;

  try {
    const pickers = await getPickers();
    const pickerNumbers = Object.fromEntries(
      pickers.map((picker) => [picker.name, picker.phoneNumber]),
    );

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Fetch all non-pending daily and weekly counts in bulk
    const { data: allDailyCounts } = await supabase
      .from("dailyCount")
      .select("picker, count")
      .gte("date", startOfDay.toISOString())
      .eq("isPending", false);

    const { data: allWeeklyCounts } = await supabase
      .from("dailyCount")
      .select("picker, count")
      .gte("date", startOfWeek.toISOString())
      .eq("isPending", false);

    const dailyCountsFromDB: Record<string, number> = {};
    allDailyCounts?.forEach((count: { picker: string; count: number }) => {
      dailyCountsFromDB[count.picker] =
        (dailyCountsFromDB[count.picker] ?? 0) + count.count;
    });

    const weeklyCountsFromDB: Record<string, number> = {};
    allWeeklyCounts?.forEach((count: { picker: string; count: number }) => {
      weeklyCountsFromDB[count.picker] =
        (weeklyCountsFromDB[count.picker] ?? 0) + count.count;
    });

    const messages = [];
    // Add the counts that are getting sent now, because they won't be included
    // in the counts from the DB.
    const countAdjustments: Record<string, number> = {};
    for (const dailyCount of dailyCounts.value) {
      countAdjustments[dailyCount.picker] ??= 0;
      countAdjustments[dailyCount.picker] += dailyCount.count;
      const dayCount =
        (dailyCountsFromDB[dailyCount.picker] ?? 0) +
        (countAdjustments[dailyCount.picker] ?? 0);
      const weekCount =
        (weeklyCountsFromDB[dailyCount.picker] ?? 0) +
        (countAdjustments[dailyCount.picker] ?? 0);

      messages.push({
        to: pickerNumbers[dailyCount.picker],
        content: `Fecha: ${formatDate(new Date(dailyCount.date))}
Recogedor: ${dailyCount.picker}
Cajas hoy: ${dailyCount.count}
Cajas semana: ${weekCount}
`,
      });
    }
    const results = await sendMessages(messages);
    let i = 0;
    for (const result of results) {
      await supabase
        .from("dailyCount")
        .update({ isPending: false, messageUuid: result.uuid })
        .eq("uuid", dailyCounts.value[i].uuid)
        .select();
      i += 1;
    }
    dailyCounts.value = [];
  } finally {
    isSending.value = false;
  }
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}
</script>

<template>
  <div
    v-if="isSending"
    class="size-full flex items-center justify-center text-2xl"
  >
    <div class="p-2 flex items-center justify-center gap-2">
      <Icon
        icon="svg-spinners:90-ring-with-bg"
        height="36"
        class="text-white"
      />
      <span class="ml-2 text-white">Sending...</span>
    </div>
  </div>
  <div v-else-if="dailyCounts.length > 0" class="flex flex-col">
    <!-- Sticky Header -->
    <div class="sticky px-4 py-2 top-0">
      <div class="bg-slate-800 p-4 rounded-lg z-10 shadow-lg shadow-black/50">
        <div class="flex justify-between items-center">
          <div class="text-white text-lg font-semibold">
            Total Bins: {{ totalCounts }}
          </div>
          <button @click="sendDailyCounts" class="bg-blue-800 rounded-md p-2">
            Send
          </button>
        </div>
      </div>
    </div>

    <ul class="flex flex-col gap-1 p-2">
      <li
        v-for="dailyCount in dailyCounts"
        :key="dailyCount.uuid"
        class="daily-count-row flex flex-row gap-1 justify-stretch items-center"
      >
        <div class="flex-1 text-white p-1">{{ dailyCount.picker }}</div>
        <button
          @click="openEditDialog(dailyCount)"
          class="flex-1 bg-slate-700 text-white p-3 rounded-md hover:bg-slate-600"
        >
          {{ dailyCount.count }}
        </button>
        <button
          @click="deleteDailyCount(dailyCount)"
          class="bg-red-700 w-16 p-2 md:w-20 flex items-center justify-center rounded-md"
        >
          <Icon icon="system-uicons:trash" height="32" />
        </button>
      </li>
    </ul>
  </div>
  <div v-else class="size-full flex items-center justify-center text-2xl">
    No pending daily counts
  </div>

  <!-- Edit Dialog -->
  <div
    v-if="editingCount"
    class="fixed top-0 left-0 w-full h-full bg-gray-900/50 flex items-center justify-center z-50"
    @click.self="cancelEdit"
  >
    <div class="min-w-[300px] p-4 rounded-md bg-gray-800">
      <h2 class="text-lg font-bold mb-2">
        Edit Count for {{ editingCount.picker }}
      </h2>

      <input
        v-model.number="tempCount"
        type="number"
        min="0"
        class="h-16 p-4 lg:h-12 w-full border rounded-md"
      />

      <div class="flex justify-end mt-4 gap-2">
        <button @click="cancelEdit" class="bg-gray-700 p-2 rounded-md">
          Cancel
        </button>
        <button
          @click="updateCount"
          :disabled="tempCount < 0 || !Number.isInteger(tempCount)"
          class="bg-blue-700 disabled:opacity-50 text-white p-2 rounded-md"
        >
          Update
        </button>
      </div>
    </div>
  </div>
</template>
