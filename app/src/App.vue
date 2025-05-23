<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from "vue-router";
import { supabase } from "@/lib/supabaseClient";
import { ref, onMounted } from "vue";

const isLoggedIn = ref(false);
const router = useRouter();

async function checkAuth() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  isLoggedIn.value = !!session;
}

onMounted(() => {
  checkAuth();

  supabase.auth.onAuthStateChange(() => {
    checkAuth();
  });
});

async function signOut() {
  await supabase.auth.signOut();
  router.push("/login");
}
</script>

<template>
  <nav id="top-nav">
    <RouterLink v-if="isLoggedIn" to="/bins">BinTraq</RouterLink>
    <RouterLink v-else to="/about">BinTraq</RouterLink>
    <RouterLink to="/about">About</RouterLink>
    <RouterLink v-if="!isLoggedIn" to="/login">Login</RouterLink>
    <button v-else @click="signOut" class="button-as-a">Logout</button>
  </nav>
  <main>
    <RouterView />
  </main>

  <nav v-if="isLoggedIn" id="bottom-nav">
    <RouterLink to="/bins/add">Add Bin</RouterLink>
    <RouterLink to="/bins">Bins</RouterLink>
  </nav>
</template>

<style scoped>
#top-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  background: var(--color-slate-800);
  padding: 8px 12px;
  border-radius: 12px;

  :first-child {
    margin-inline-end: auto;
    font-weight: bold;
    font-size: 1.5rem;
    color: var(--color-white);
  }

  :not(:first-child) {
    font-size: 1rem;
    line-height: 2;
    padding: 8px;
    background: var(--color-slate-700);
    border-radius: 4px;
  }
}
#bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: space-around;
  background: var(--color-slate-800);
}
</style>
