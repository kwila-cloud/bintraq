<script setup lang="ts">
import { supabase } from "@/lib/supabaseClient";
import { getMessages, getMessage, resendMessage } from "@/lib/smoketreeClient";
import type { DailyCount } from "@/models/dailyCount";
import type { Picker } from "@/models/picker";
import { getPickers } from "@/lib/utils";
import { ref, onMounted, computed } from "vue";

const dailyCounts = ref<DailyCount[]>([]);
const messageStatuses = ref<Record<string, string>>({});
const pickers = ref<Picker[]>([]);
const selectedPicker = ref<string | null>(null);

async function loadCompletedDailyCounts() {
  try {
    let query = supabase
      .from("dailyCount")
      .select()
      .eq("isPending", false)
      .order("date", { ascending: false });

    if (selectedPicker.value) {
      query = query.eq("picker", selectedPicker.value);
    }

    const { data, error } = await query;
    if (error) {
      throw error;
    }
    dailyCounts.value = data as DailyCount[];
  } catch (error) {
    console.error("Failed to load completed daily counts:", error);
  }
}

async function loadMessageStatuses() {
  try {
    const messages = await getMessages();
    messageStatuses.value = Object.fromEntries(
      messages.map((m) => [m.uuid, m.currentStatus]),
    );
  } catch (error) {
    console.error("Failed to load message statuses:", error);
  }
}

async function refresh(messageUuid: string) {
  try {
    messageStatuses.value = {
      ...messageStatuses.value,
      [messageUuid]: "refreshing",
    };
    const message = await getMessage(messageUuid);
    messageStatuses.value = {
      ...messageStatuses.value,
      [messageUuid]: message.currentStatus,
    };
  } catch (error) {
    console.error("Failed to refresh message status:", error);
  }
}

async function resend(messageUuid: string) {
  try {
    messageStatuses.value = {
      ...messageStatuses.value,
      [messageUuid]: "pending",
    };
    await resendMessage(messageUuid);
  } catch (error) {
    console.error("Failed to resend message:", error);
  }
}

async function loadPickers() {
  try {
    pickers.value = await getPickers();
  } catch (error) {
    console.error("Failed to load pickers:", error);
  }
}

const weeklyCount = computed(() => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, etc.
  const diff = dayOfWeek; // Days since Sunday
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - diff);
  sunday.setHours(0, 0, 0, 0);

  return dailyCounts.value
    .filter((dailyCount) => new Date(dailyCount.date) >= sunday)
    .reduce((sum, dailyCount) => sum + dailyCount.count, 0);
});

const dailyCountsArray = computed(() => {
  const today = new Date();
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const dailyCountsList = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - today.getDay() + i);
    date.setHours(0, 0, 0, 0);

    const dayCounts = dailyCounts.value.filter(
      (dailyCount) =>
        new Date(dailyCount.date).toDateString() === date.toDateString(),
    );
    const count = dayCounts.reduce(
      (sum, dailyCount) => sum + dailyCount.count,
      0,
    );

    dailyCountsList.push({ day: days[i], count });
  }

  return dailyCountsList;
});

onMounted(() => {
  loadPickers();
  loadCompletedDailyCounts();
  loadMessageStatuses();
});
</script>

<template>
  <div class="flex flex-col gap-4 items-center py-4">
    <div class="flex gap-4 items-center">
      <label>Picker</label>
      <select
        v-model="selectedPicker"
        @change="loadCompletedDailyCounts"
        class="p-2 border rounded-md bg-gray-800"
      >
        <option :value="null">All</option>
        <option
          v-for="picker in pickers"
          :key="picker.uuid"
          :value="picker.name"
        >
          {{ picker.name }}
        </option>
      </select>
    </div>
    <div class="flex flex-col gap-2 w-[300px]">
      <div
        class="flex-1 flex flex-col items-center gap-1 bg-blue-900 rounded-lg p-4"
      >
        <span>Weekly Count</span>
        <span class="text-4xl">{{ weeklyCount }}</span>
      </div>
      <div class="flex gap-1">
        <div
          v-for="dayData in dailyCountsArray"
          :key="dayData.day"
          class="flex-1 flex flex-col items-center bg-blue-900 rounded-lg p-1"
        >
          <span class="text-xs">{{ dayData.day }}</span>
          <span class="text-lg">{{ dayData.count }}</span>
        </div>
      </div>
    </div>
    <ul class="flex flex-col items-center gap-2">
      <li
        v-for="dailyCount in dailyCounts"
        :key="dailyCount.uuid"
        class="w-[300px] flex flex-col gap-1 p-2 rounded-lg bg-slate-800"
      >
        <div class="flex justify-between items-center">
          <h1 class="text-2xl">{{ dailyCount.picker }}</h1>
          <span
            class="bg-blue-700 text-white font-bold text-lg rounded-lg px-2 py-1"
            >{{ dailyCount.count }}</span
          >
        </div>
        <span>{{ new Date(dailyCount.date).toLocaleString() }}</span>
        <template v-if="dailyCount.messageUuid == null">
          <span>Send Status - lost</span>
        </template>
        <template v-else>
          <span
            >Send Status -
            {{ messageStatuses[dailyCount.messageUuid] ?? "unknown" }}</span
          >
          <button
            v-if="
              ['failed', 'rate_limited'].includes(
                messageStatuses[dailyCount.messageUuid],
              )
            "
            @click="resend(dailyCount.messageUuid)"
            class="bg-blue-900 rounded-lg"
          >
            Resend
          </button>
          <button
            v-else-if="messageStatuses[dailyCount.messageUuid] != 'sent'"
            @click="refresh(dailyCount.messageUuid)"
            class="bg-blue-900 rounded-lg"
          >
            Refresh
          </button>
        </template>
      </li>
    </ul>
  </div>
</template>
