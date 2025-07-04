<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient'
import type { Bin } from '@/models/bin'
import { ref, onMounted } from 'vue'

const bins = ref<Bin[]>([])
const messageStatuses = ref<Record<string, string>>({})

async function loadCompletedBins() {
  const { data } = await supabase
    .from('bin')
    .select()
    .eq('isPending', false)
    .order('date', { ascending: false })
  bins.value = data as Bin[]
}

async function loadMessageStatuses() {
  // TODO: load from smoketree
}

async function resend(messageUuid: string) {
  // TODO: resend message with smoketree
}

onMounted(() => {
  loadCompletedBins()
  loadMessageStatuses()
})
</script>

<template>
  <ul>
    <li v-for="bin in bins" :key="bin.uuid">
      <h1>{{ bin.id }}</h1>
      <span>{{ bin.picker }}</span>
      <span>{{ bin.date.toLocaleString() }}</span>
      <span v-if="bin.messageUuid == null || messageStatuses[bin.messageUuid] == undefined"
        >Bin UUID - {{ bin.uuid }}</span
      >
      <template v-if="bin.messageUuid != null">
        <span>Send Status - {{ messageStatuses[bin.messageUuid] ?? 'unknown' }}</span>
        <button
          v-if="messageStatuses[bin.messageUuid] == 'failed'"
          @click="resend(bin.messageUuid)"
        >
          Resend
        </button>
      </template>
    </li>
  </ul>
</template>

<style scoped>
ul {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
li {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  border-radius: 8px;
  background-color: var(--color-slate-800);

  h1 {
    font-size: 2rem;
  }

  button {
    background-color: var(--color-blue-900);
  }
}
</style>
