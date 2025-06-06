<script setup lang="ts">
import { supabase } from "@/lib/supabaseClient";
import { ref, onMounted } from "vue";
import { settings } from "@/models/settings";
import type { Bin } from "@/models/bin";
import BinSetting from "@/components/BinSetting.vue";

const bins = ref<Bin[]>([]);

async function updateBin(bin: Bin) {
  await supabase.from("bin").update(bin).eq("uuid", bin.uuid).select();
}

async function loadPendingBins() {
  const { data } = await supabase
    .from("bin")
    .select()
    .eq("isPending", true)
    .order("date");
  bins.value = data as Bin[];
}

async function sendBins() {
  await supabase
    .from("bin")
    .update({ isPending: false })
    .eq("isPending", true)
    .select();
  bins.value = [];
}

onMounted(() => {
  loadPendingBins();
});
</script>

<template>
  <ul v-if="bins.length > 0" class="flex flex-col gap-1">
    <li
      v-for="bin in bins"
      :key="bin.uuid"
      class="flex flex-row gap-1 justify-stretch"
    >
      <div v-for="setting in settings" :key="setting.id" class="flex-1">
        <BinSetting
          :setting="setting"
          v-model="bin[setting.id]"
          @update:modelValue="updateBin(bin)"
        />
      </div>
    </li>
    <button @click="sendBins" class="bg-blue-800 rounded-md p-2">Send</button>
  </ul>
  <div v-else class="size-full flex items-center justify-center text-2xl">
    No pending bins
  </div>
</template>
