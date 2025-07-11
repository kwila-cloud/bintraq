<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient'
import { getMessages, getMessage, resendMessage } from '@/lib/smoketreeClient'
import type { Bin } from '@/models/bin'
import type { Picker } from '@/models/picker'
import { getPickers } from '@/lib/utils'
import { ref, onMounted } from 'vue'

const bins = ref<Bin[]>([])
const messageStatuses = ref<Record<string, string>>({})
const pickers = ref<Picker[]>([])
const selectedPicker = ref<string | null>(null)

async function loadCompletedBins() {
  let query = supabase
    .from('bin')
    .select()
    .eq('isPending', false)
    .order('date', { ascending: false })

  if (selectedPicker.value) {
    query = query.eq('picker', selectedPicker.value)
  }

  const { data } = await query
  bins.value = data as Bin[]
}

async function loadMessageStatuses() {
  const messages = await getMessages()
  messageStatuses.value = Object.fromEntries(messages.map((m) => [m.uuid, m.currentStatus]))
}

async function refresh(messageUuid: string) {
  messageStatuses.value = { ...messageStatuses.value, [messageUuid]: 'refreshing' }
  const message = await getMessage(messageUuid)
  messageStatuses.value = { ...messageStatuses.value, [messageUuid]: message.currentStatus }
}

async function resend(messageUuid: string) {
  messageStatuses.value = { ...messageStatuses.value, [messageUuid]: 'pending' }
  await resendMessage(messageUuid)
}

async function loadPickers() {
  pickers.value = await getPickers()
}

onMounted(() => {
  loadPickers()
  loadCompletedBins()
  loadMessageStatuses()
})
</script>

<template>
  <div class="flex flex-col gap-4 items-center">
    <div class="flex gap-4 items-center">
      <label>Picker</label>
      <select
        v-model="selectedPicker"
        @change="loadCompletedBins"
        class="p-2 border rounded-md bg-gray-800"
      >
        <option :value="null">All</option>
        <option v-for="picker in pickers" :key="picker.uuid" :value="picker.name">
          {{ picker.name }}
        </option>
      </select>
    </div>
    <ul>
      <li v-for="bin in bins" :key="bin.uuid">
        <h1>{{ bin.id }}</h1>
        <span>{{ bin.picker }}</span>
        <span>{{ new Date(bin.date).toLocaleString() }}</span>
        <template v-if="bin.messageUuid == null">
          <span>Send Status - lost</span>
        </template>
        <template v-else>
          <span>Send Status - {{ messageStatuses[bin.messageUuid] ?? 'unknown' }}</span>
          <button
            v-if="['failed', 'rate_limited'].includes(messageStatuses[bin.messageUuid])"
            @click="resend(bin.messageUuid)"
          >
            Resend
          </button>
          <button
            v-else-if="messageStatuses[bin.messageUuid] != 'sent'"
            @click="refresh(bin.messageUuid)"
          >
            Refresh
          </button>
        </template>
      </li>
    </ul>
  </div>
</template>

<style scoped>
ul {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
li {
  width: 300px;
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
    border-radius: 8px;
  }
}
</style>
