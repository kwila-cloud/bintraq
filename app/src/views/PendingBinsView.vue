<script setup lang="ts">
import { supabase } from "@/lib/supabaseClient";
import { ref, onMounted, watch } from "vue";
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

onMounted(() => {
  loadPendingBins();
});
</script>

<template>
  <ul class="flex flex-col gap-1">
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
  </ul>
</template>
