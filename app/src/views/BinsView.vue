<script setup lang="ts">
import { supabase } from "@/lib/supabaseClient";
import { ref, onMounted } from "vue";

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
  <h1>Bins</h1>
  <ul>
    <li v-for="bin in bins" :key="bin.uuid">
      {{ bin.id }} (picked by {{ bin.picker }})
    </li>
  </ul>
</template>
