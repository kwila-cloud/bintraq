<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabaseClient'

const bins = ref([])

async function getBins() {
  const { data } = await supabase.from('bin').select()
  bins.value = data
}

onMounted(() => {
  getBins()
})
</script>

<template>
  <ul>
    <li v-for="bin in bins" :key="bin.uuid">{{ bin.id }} (picked by {{ bin.picker }})</li>
  </ul>
</template>
