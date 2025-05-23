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
  <nav>
    <RouterLink v-if="isLoggedIn" to="/bins">BinTraq</RouterLink>
    <RouterLink v-else to="/about">BinTraq</RouterLink>

    <RouterLink v-if="isLoggedIn" to="/bins">Bins</RouterLink>
    <RouterLink v-if="isLoggedIn" to="/bins/add">Add Bin</RouterLink>
    <RouterLink to="/about">About</RouterLink>

    <RouterLink v-if="!isLoggedIn" to="/login">Login</RouterLink>
    <button v-else @click="signOut" class="button-as-a">Logout</button>
  </nav>
  <main>
    <RouterView />
  </main>

  <nav v-if="isLoggedIn" class="bottom-nav">
    <RouterLink to="/bins">Bins</RouterLink>
    <RouterLink to="/bins/add">Add Bin</RouterLink>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #f0f0f0;
  padding: 10px;
  display: flex;
  justify-content: space-around;
}
</style>
