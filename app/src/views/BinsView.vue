<script setup lang="ts">
import { supabase } from "@/lib/supabaseClient";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import AddBinDialog from "@/components/AddBinDialog.vue";

type Bin = {
  uuid: string;
  id: string;
  picker: string;
};

const bins = ref<Bin[]>([]);

async function getBins() {
  const { data } = await supabase.from("bin").select().order("date");
  bins.value = data as Bin[];
}

onMounted(() => {
  getBins();
});
</script>

<template>
  <div class="flex flex-row gap-4 items-center">
    <h1>Bins</h1>
    <AddBinDialog />
  </div>
  <ul>
    <li v-for="bin in bins" :key="bin.uuid">
      {{ bin.id }} (picked by {{ bin.picker }})
    </li>
  </ul>
</template>
