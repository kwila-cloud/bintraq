<script setup lang="ts">
import type { DailyCount } from '@/models/dailyCount'
import { computed, onMounted, ref } from 'vue'
import DailyCountSetting from '@/components/DailyCountSetting.vue'
import BinSetting from '@/components/BinSetting.vue'
import { supabase } from '@/lib/supabaseClient'
import { getSettings, type Setting } from '@/models/settings'
import { getOrganization, getPickers, appVersion } from '@/lib/utils'

const pendingDailyCount = ref<Partial<DailyCount>>({
  organizationUuid: '',
  picker: '',
  count: 0,
  isPending: true,
  messageUuid: null,
})
const dailyCounts = ref<DailyCount[]>([])
const pendingDailyCounts = computed(() => dailyCounts.value.filter(({ isPending }) => isPending))
const mostRecentCount = computed(() => dailyCounts.value[0]?.count)
const settings = ref<Setting[]>([])

async function getOrganizationUuid() {
  const organization = await getOrganization()
  pendingDailyCount.value.organizationUuid = organization.uuid
}

async function getDailyCounts() {
  const { data } = await supabase.from('dailyCount').select().order('date', { ascending: false })
  dailyCounts.value = data as DailyCount[]
  // Use the most recent daily count as default values
  if (dailyCounts.value.length > 0) {
    pendingDailyCount.value.picker = dailyCounts.value[0].picker
  }
}

onMounted(() => {
  getOrganizationUuid()
  getDailyCounts()
  getPickers().then((pickers) => (settings.value = getSettings(pickers)))
})

const addDailyCount = async () => {
  for (const setting of settings.value) {
    if (setting.id === 'picker' && !pendingDailyCount.value.picker) {
      alert(`Please select a ${setting.name}`)
      return
    }
  }
  if (!pendingDailyCount.value.count || pendingDailyCount.value.count <= 0) {
    alert('Please select a daily count')
    return
  }
  // Add the new daily count
  await supabase.from('dailyCount').insert(pendingDailyCount.value)
  // Clear the selected count
  pendingDailyCount.value.count = 0
  // Refresh the list of daily counts
  getDailyCounts()
}
</script>

<template>
  <div class="flex flex-col gap-2 justify-end h-full p-4">
    <p class="!p-0 italic">v{{ appVersion }}</p>
    <div class="flex flex-row justify-between">
      <RouterLink to="/pending" class="bg-blue-500 !text-white rounded-xl w-fit !px-4 font-bold">
        Pending Daily Counts: {{ pendingDailyCounts.length }}
      </RouterLink>
      <div v-if="mostRecentCount != null" class="bg-gray-500 !text-white rounded-xl w-fit !px-4 py-1 font-bold">
        Most Recent Count: {{ mostRecentCount }}
      </div>
    </div>
    <BinSetting 
      v-for="setting in settings.filter(s => s.id === 'picker')" 
      :key="setting.id"
      :setting="setting" 
      v-model="pendingDailyCount[setting.id]" 
    />
    <DailyCountSetting
      :setting="{ id: 'count', name: 'Daily Count', type: 'select' }"
      v-model="pendingDailyCount.count"
    />
    <button
      @click="addDailyCount"
      class="bg-blue-800 rounded-md h-16 flex items-center justify-center text-lg"
    >
      Add Daily Count
    </button>
  </div>
</template>