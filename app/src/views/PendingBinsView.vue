<script setup lang="ts">
import { supabase } from "@/lib/supabaseClient";
import { sendMessages } from "@/lib/smoketreeClient";
import { ref, onMounted } from "vue";
import { getSettings, type Setting } from "@/models/settings";
import type { Bin } from "@/models/bin";
import BinSetting from "@/components/BinSetting.vue";
import { getPickers } from "@/lib/utils";
import { Icon } from "@iconify/vue";

const bins = ref<Bin[]>([]);
const settings = ref<Setting[]>([]);
const isSending = ref(false);

onMounted(() => {
  loadPendingBins();
  getPickers().then((pickers) => (settings.value = getSettings(pickers)));
});

async function loadPendingBins() {
  const { data } = await supabase
    .from("bin")
    .select()
    .eq("isPending", true)
    .order("date");
  bins.value = data as Bin[];
}

async function updateBin(bin: Bin) {
  await supabase.from("bin").update(bin).eq("uuid", bin.uuid).select();
}

async function deleteBin(bin: Bin) {
  if (confirm(`Are you sure you want to delete bin ${bin.id}?`)) {
    await supabase.from("bin").delete().eq("uuid", bin.uuid);
    await loadPendingBins();
  }
}

async function sendBins() {
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

    // Fetch all non-pending daily and weekly bins in bulk
    const { data: allDailyBins } = await supabase
      .from("bin")
      .select("picker", { count: "exact" }) // Only need the picker to count
      .gte("date", startOfDay.toISOString())
      .eq("isPending", false);

    const { data: allWeeklyBins } = await supabase
      .from("bin")
      .select("picker", { count: "exact" }) // Only need the picker to count
      .gte("date", startOfWeek.toISOString())
      .eq("isPending", false);

    const dailyCountsFromDB: Record<string, number> = {};
    allDailyBins?.forEach((bin: { picker: string }) => {
      dailyCountsFromDB[bin.picker] = (dailyCountsFromDB[bin.picker] ?? 0) + 1;
    });

    const weeklyCountsFromDB: Record<string, number> = {};
    allWeeklyBins?.forEach((bin: { picker: string }) => {
      weeklyCountsFromDB[bin.picker] =
        (weeklyCountsFromDB[bin.picker] ?? 0) + 1;
    });

    const messages = [];
    // Add the bins that are getting sent now, because they won't be included
    // in the counts from the DB.
    const countAdjustments: Record<string, number> = {};
    for (const bin of bins.value) {
      countAdjustments[bin.picker] ??= 0;
      countAdjustments[bin.picker] += 1;
      const dayCount =
        (dailyCountsFromDB[bin.picker] ?? 0) +
        (countAdjustments[bin.picker] ?? 0);
      const weekCount =
        (weeklyCountsFromDB[bin.picker] ?? 0) +
        (countAdjustments[bin.picker] ?? 0);

      messages.push({
        to: pickerNumbers[bin.picker],
        content: `ID del Caja: ${bin.id}
Fecha: ${formatDate(new Date(bin.date))}
Recogedor: ${bin.picker}
Bloque: ${bin.block}
Tamaño del Caja: ${bin.size} bushel
Cajas hoy: ${dayCount}
Cajas semana: ${weekCount}
`,
      });
    }
    const results = await sendMessages(messages);
    let i = 0;
    for (const result of results) {
      await supabase
        .from("bin")
        .update({ isPending: false, messageUuid: result.uuid })
        .eq("uuid", bins.value[i].uuid)
        .select();
      i += 1;
    }
    bins.value = [];
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
  <ul v-else-if="bins.length > 0" class="flex flex-col gap-1 p-2">
    <li
      v-for="bin in bins"
      :key="bin.uuid"
      class="bin-row flex flex-row gap-1 justify-stretch"
    >
      <div v-for="setting in settings" :key="setting.id" class="flex-1">
        <BinSetting
          :setting="setting"
          v-model="bin[setting.id] as string"
          @update:modelValue="updateBin(bin)"
        />
      </div>
      <button
        @click="deleteBin(bin)"
        class="bg-red-700 w-16 md:w-20 flex items-center justify-center rounded-md"
      >
        <Icon icon="system-uicons:trash" height="32" />
      </button>
    </li>
    <button @click="sendBins" class="bg-blue-800 rounded-md p-2">Send</button>
  </ul>
  <div v-else class="size-full flex items-center justify-center text-2xl">
    No pending bins
  </div>
</template>
