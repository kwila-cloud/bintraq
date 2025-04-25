<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

type Bin = {
  uuid: string
  id: string
  picker: string
}

const bins = ref<Bin[]>([])
const router = useRouter()

async function getBins() {
  const { data } = await supabase.from('bin').select().order('date')
  bins.value = data as Bin[]
}

async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    router.push('/login')
  } else {
    await getBins()
  }
}


onMounted(() => {
  checkAuth()
})
</script>

<template>
  <h1>Bins</h1>
  <ul>
    <li v-for="bin in bins" :key="bin.uuid">{{ bin.id }} (picked by {{ bin.picker }})</li>
  </ul>
  <p style="padding-top: 16px">Authentication guard is now active.</p>
</template>
