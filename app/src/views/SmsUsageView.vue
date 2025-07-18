<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { MonthlyUsage } from '@/models/monthlyUsage'
import { getUsage } from '@/lib/smoketreeClient'

const monthlyUsage = ref<MonthlyUsage[]>([])

async function loadUsage() {
  const usage = await getUsage()
  monthlyUsage.value = usage
}

onMounted(() => {
  loadUsage()
})
</script>

<template>
  <ul class="p-4 flex flex-col gap-2">
    <li
      v-for="month in monthlyUsage"
      :key="month.month"
      class="p-2 rounded-lg bg-slate-800 flex flex-col items-center gap-2"
    >
      <h2 class="text-2xl">{{ month.month }}</h2>
      <div class="flex gap-2 w-full">
        <div class="box">
          <span>Segments</span>
          <span>{{ month.totalSegments }} / {{ month.segmentLimit }}</span>
        </div>
        <div class="box">
          <span>Messages</span>
          <span>{{ month.totalMessages }}</span>
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.box {
  padding: var(--spacing) calc(var(--spacing) * 4);
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px var(--color-slate-700) solid;
  border-radius: calc(var(--spacing) * 2);
}
.box :last-child {
  font-size: var(--text-3xl);
}
</style>
