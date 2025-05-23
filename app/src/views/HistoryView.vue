<script setup lang="ts">
import { supabase } from "@/lib/supabaseClient";
import { ref, onMounted } from "vue";

type Bin = {
  uuid: string;
  id: string;
  picker: string;
};

const bins = ref<Bin[]>([]);

async function loadCompletedBins() {
  const { data } = await supabase
    .from("bin")
    .select()
    .eq("isPending", false)
    .order("date");
  bins.value = data as Bin[];
}

onMounted(() => {
  loadCompletedBins();
});
</script>

<template>
  <ul>
    <li v-for="bin in bins" :key="bin.uuid">
      {{ bin.id }} (picked by {{ bin.picker }})
    </li>
  </ul>
</template>
