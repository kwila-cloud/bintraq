<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
import { ref, onMounted } from 'vue'

const isLoggedIn = ref(false)

async function checkAuth() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  isLoggedIn.value = !!session
}

onMounted(() => {
  checkAuth()

  supabase.auth.onAuthStateChange(() => {
    checkAuth()
  })
})

async function signOut() {
  await supabase.auth.signOut()
}
</script>

<template>
  <nav>
    <h1>BinTraq</h1>
    <RouterLink v-if="isLoggedIn" to="/bins">Bins</RouterLink>
    <RouterLink to="/about">About</RouterLink>

    <RouterLink v-if="!isLoggedIn" to="/login">Login</RouterLink>
    <button v-if="isLoggedIn" @click="signOut">Logout</button>
  </nav>
  <main>
    <RouterView />
  </main>
</template>
