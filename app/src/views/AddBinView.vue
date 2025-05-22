<script setup lang="ts">
import type { Bin } from "@/models/bin";
import { blockOptions, sizeOptions } from "@/models/bin";
import { ref, onMounted } from "vue";
import BinSetting from "@/components/BinSetting.vue";

const pendingBin = ref<Bin>({
  uuid: "",
  date: new Date(),
  picker: "",
  block: "",
  size: "",
  id: "",
  isPending: true,
  messageUuid: null,
});
// TODO: load pickers from supabase
const pickers = ref(["Addison", "Milo"]);
const blocks = ref(blockOptions);
const sizes = ref(sizeOptions);
const settings = ref([
  { id: "picker", name: "Picker", options: pickers, type: "select" },
  { id: "block", name: "Block", options: blocks, type: "select" },
  { id: "size", name: "Bin Size", options: sizes, type: "select" },
  { id: "id", name: "Bin ID", type: "text" },
]);
</script>

<template>
  <h1>Add Bin</h1>
  <div class="flex flex-col gap-2">
    <div v-for="setting in settings" :key="setting.id">
      <BinSetting :setting="setting" v-model="pendingBin[setting.id]">
      </BinSetting>
    </div>
  </div>
</template>
