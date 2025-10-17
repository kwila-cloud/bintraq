<script setup lang="ts">
import type { DailyCount } from "@/models/dailyCount";
import { computed, onMounted, ref } from "vue";
import DailyCountSetting from "@/components/DailyCountSetting.vue";
import BinSetting from "@/components/BinSetting.vue";
import { supabase } from "@/lib/supabaseClient";
import type { Setting } from "@/models/settings";
import { getOrganization, getPickers, appVersion } from "@/lib/utils";

const pendingDailyCount = ref<Partial<DailyCount>>({
  organizationUuid: "",
  picker: "",
  count: 0,
  isPending: true,
  messageUuid: null,
});
const dailyCounts = ref<DailyCount[]>([]);
const pendingDailyCounts = computed(() =>
  dailyCounts.value.filter(({ isPending }) => isPending),
);
const mostRecentPicker = computed(() => dailyCounts.value[0]?.picker);
const pickerSetting: Setting = {
  id: "picker",
  name: "Picker",
  type: "select",
  options: [],
};

async function getOrganizationUuid() {
  const organization = await getOrganization();
  pendingDailyCount.value.organizationUuid = organization.uuid;
}

async function getDailyCounts() {
  const { data } = await supabase
    .from("dailyCount")
    .select()
    .eq("organizationUuid", pendingDailyCount.value.organizationUuid)
    .order("date", { ascending: false });
  dailyCounts.value = data as DailyCount[];
  // Use the most recent picker as default value
  if (dailyCounts.value.length > 0) {
    pendingDailyCount.value.picker = dailyCounts.value[0].picker;
  }
}

onMounted(async () => {
  await getOrganizationUuid();
  getDailyCounts();
  getPickers().then((pickers) => {
    pickerSetting.options = pickers.map((p) => p.name);
  });
});

const addDailyCount = async () => {
  if (!pendingDailyCount.value.picker) {
    alert("Please select a picker");
    return;
  }
  if (!pendingDailyCount.value.count || pendingDailyCount.value.count <= 0) {
    alert("Please select a daily count");
    return;
  }

  // Check for uniqueness - ensure picker doesn't already have a daily count for today
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  ).toISOString();
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1,
  ).toISOString();

  const { data: existingCount } = await supabase
    .from("dailyCount")
    .select()
    .eq("picker", pendingDailyCount.value.picker)
    .gte("date", startOfDay)
    .lt("date", endOfDay);

  if (existingCount && existingCount.length > 0) {
    alert(
      `${pendingDailyCount.value.picker} already has a daily count for today`,
    );
    return;
  }

  // Set the date for the new daily count
  pendingDailyCount.value.date = today.toISOString();

  // Add the new daily count
  await supabase.from("dailyCount").insert(pendingDailyCount.value);
  // Clear the selected count
  pendingDailyCount.value.count = 0;
  // Refresh the list of daily counts
  getDailyCounts();
};
</script>

<template>
  <div class="flex flex-col gap-2 justify-end h-full p-4">
    <p class="!p-0 italic">v{{ appVersion }}</p>
    <div class="flex flex-row justify-between gap-2">
      <RouterLink
        to="/pending"
        class="bg-blue-500 !text-white rounded-xl w-fit !px-4 font-bold"
      >
        Pending Daily Counts: {{ pendingDailyCounts.length }}
      </RouterLink>
      <div
        v-if="mostRecentPicker"
        class="bg-gray-500 !text-white rounded-xl w-fit !px-4 py-1 font-bold"
      >
        Most Recent Picker: {{ mostRecentPicker }}
      </div>
    </div>
    <div>
      <BinSetting :setting="pickerSetting" v-model="pendingDailyCount.picker" />
    </div>
    <DailyCountSetting
      :setting="{ id: 'count', name: 'Daily Count', type: 'select' }"
      v-model="pendingDailyCount.count"
    />
    <button
      @click="addDailyCount"
      class="bg-blue-800 rounded-md h-16 flex items-center justify-center text-lg"
    >
      Add Daily Count
    </button>
  </div>
</template>
