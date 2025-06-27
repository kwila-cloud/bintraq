<script setup lang="ts">
import { supabase } from "@/lib/supabaseClient";
import { ref, onMounted } from "vue";
import { settings } from "@/models/settings";
import type { Bin } from "@/models/bin";
import BinSetting from "@/components/BinSetting.vue";
import { getOrganization, getPickers } from "@/lib/utils";
import { Icon } from "@iconify/vue";
import {
  MessagesApi,
  Configuration,
  PostMessageCreateRequest,
} from "smoketree-ts";

const bins = ref<Bin[]>([]);

onMounted(() => {
  loadPendingBins();
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
  await supabase.from("bin").delete().eq("uuid", bin.uuid).select();
  await loadPendingBins();
}

async function sendBins() {
  const organization = await getOrganization();
  const pickers = await getPickers();
  const pickerNumbers = Object.fromEntries(
    pickers.map((picker) => [picker.name, picker.phoneNumber]),
  );
  const configuration = new Configuration({
    apiKey: organization.smoketreeAdminApiKey,
  });
  const smokeTree = new MessagesApi(configuration);

  const messages = [];
  for (const bin of bins.value) {
    // TODO: calculate day count
    const dayCount = 0;
    // TODO: calculate week count
    const weekCount = 0;
    messages.push({
      to: pickerNumbers[bin.picker],
      content: `ID del Caja: ${bin.id}
Fecha: ${new Date(bin.date).toDateString()}
Recogedor: ${bin.picker}
Bloque: ${bin.block}
Tamaño del Caja: ${bin.size} bushel
Cantidad Diaria de Cajas: ${dayCount}
Cantidad Semanal de Cajas: ${weekCount}
`,
    });
  }
  const { status, data } = await smokeTree.postMessageCreate({ messages });
  let i = 0;
  for (const result of data.results) {
    await supabase
      .from("bin")
      .update({ isPending: false, messageUuid: result.uuid })
      .eq("uuid", bins.value[i].uuid)
      .select();
    i += 1;
  }
  bins.value = [];
}
</script>

<template>
  <ul v-if="bins.length > 0" class="flex flex-col gap-1">
    <li
      v-for="bin in bins"
      :key="bin.uuid"
      class="bin-row flex flex-row gap-1 justify-stretch"
    >
      <div v-for="setting in settings" :key="setting.id" class="flex-1">
        <BinSetting
          :setting="setting"
          v-model="bin[setting.id]"
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
