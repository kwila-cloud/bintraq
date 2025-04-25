<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabaseClient'

type Bin = {
  uuid: string
  id: string
  picker: string
}

const bins = ref<Bin[]>([])

async function getBins() {
  const { data } = await supabase.from('bin').select().order('date')
  bins.value = data as Bin[]
}

onMounted(() => {
  getBins()
})
</script>

<template>
  <h1>BinTraq - Bins</h1>
  <ul>
    <li v-for="bin in bins" :key="bin.uuid">{{ bin.id }} (picked by {{ bin.picker }})</li>
  </ul>
  <p style="padding-top: 16px">Authentication guard coming soon...</p>
</template>
