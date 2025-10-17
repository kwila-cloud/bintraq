<script setup lang="ts">
import type { Bin } from '@/models/bin'
import { computed, onMounted, ref } from 'vue'
import BinSetting from '@/components/BinSetting.vue'
import { supabase } from '@/lib/supabaseClient'
import { getSettings, type Setting } from '@/models/settings'
import { getOrganization, getPickers, appVersion } from '@/lib/utils'

const pendingBin = ref<Partial<Bin>>({
  organizationUuid: '',
  picker: '',
  block: '',
  size: '',
  id: '',
  isPending: true,
  messageUuid: null,
})
const bins = ref<Bin[]>([])
const pendingBins = computed(() => bins.value.filter(({ isPending }) => isPending))
const mostRecentBinId = computed(() => bins.value[0]?.id)
const settings = ref<Setting[]>([])

async function getOrganizationUuid() {
  const organization = await getOrganization()
  pendingBin.value.organizationUuid = organization.uuid
}

async function getBins() {
  const { data } = await supabase.from('bin').select().order('date', { ascending: false })
  bins.value = data as Bin[]
  // Use the most recent bin as default values
  if (bins.value.length > 0) {
    pendingBin.value.picker = bins.value[0].picker
    pendingBin.value.block = bins.value[0].block
    pendingBin.value.size = bins.value[0].size
  }
}

onMounted(() => {
  getOrganizationUuid()
  getBins()
  getPickers().then((pickers) => (settings.value = getSettings(pickers)))
})

const addBin = async () => {
  for (const setting of settings.value) {
    if (!pendingBin.value[setting.id]) {
      // TODO: use prettier alert
      alert(`Please select a ${setting.name}`)
      return
    }
  }
  if (!validateBinId(pendingBin.value.id ?? '')) {
    return
  }
  // Add the new bin
  await supabase.from('bin').insert(pendingBin.value)
  // Clear the selected bin ID
  pendingBin.value.id = ''
  // Refresh the list of bins
  getBins()
}

const validateBinId = (binId: string) => {
  if (binId.length != 4) {
    alert(`The bin ID must be 4 characters long.`)
    return false
  }
  const allBins = [...bins.value]
  const match = allBins.find(({ id }) => id == binId)
  if (match) {
    alert(`The bin ID "${binId}" has already been added.`)
    return false
  }
  return true
}
</script>

<template>
  <div class="flex flex-col gap-2 justify-end h-full p-4">
    <p class="!p-0 italic">v{{ appVersion }}</p>
    <div class="flex flex-row justify-between gap-2">
      <RouterLink to="/pending" class="bg-blue-500 !text-white rounded-xl w-fit !px-4 font-bold">
        Pending Bins: {{ pendingBins.length }}
      </RouterLink>
      <div v-if="mostRecentBinId != null" class="bg-gray-500 !text-white rounded-xl w-fit !px-4 py-1 font-bold">
        Most Recent Bin: {{ mostRecentBinId }}
      </div>
    </div>
    <div v-for="setting in settings" :key="setting.id">
      <BinSetting :setting="setting" v-model="pendingBin[setting.id]" />
    </div>
    <button
      @click="addBin"
      class="bg-blue-800 rounded-md h-16 flex items-center justify-center text-lg"
    >
      Add
    </button>
  </div>
</template>
