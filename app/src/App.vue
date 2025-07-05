<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'

const isLoggedIn = ref(false)
const router = useRouter()
const menuOpen = ref(false)

async function checkAuth() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  isLoggedIn.value = !!session
}

onMounted(() => {
  checkAuth()

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(() => {
    checkAuth()
  })

  onBeforeUnmount(() => subscription.unsubscribe())
})

async function signOut() {
  await supabase.auth.signOut()
  router.push('/login')
  menuOpen.value = false // Close the menu after signing out
}
</script>

<template>
  <nav id="top-nav">
    <a v-if="isLoggedIn" class="nav-link" :href="isLoggedIn ? '/add-bin' : '/about'">
      <Icon icon="system-uicons:menu-hamburger" height="32" />
    </a>
    <button class="button-as-a" @click="menuOpen.value = true">
      <Icon icon="system-uicons:menu-hamburger" height="32" />
    </button>
  </nav>
  <!-- The bottom margin gives space for the bottom nav bar -->
  <main class="p-1 md:p-4 grow mb-24">
    <RouterView />
  </main>

  <nav v-if="isLoggedIn" id="bottom-nav">
    <RouterLink to="/add-bin" active-class="active-link">
      <Icon icon="system-uicons:box-add" height="32" />
      <span>Add Bin</span>
    </RouterLink>
    <RouterLink to="/pending" active-class="active-link">
      <Icon icon="system-uicons:boxes" height="32" />
      <span>Pending</span>
    </RouterLink>
    <RouterLink to="/history" active-class="active-link">
      <Icon icon="system-uicons:graph-increase" height="32" />
      <span>History</span>
    </RouterLink>
  </nav>

  <div v-if="menuOpen" class="popUpMenu">
    <RouterLink to="/about" @click="menuOpen = false">About</RouterLink>
    <button @click="signOut">Logout</button>
  </div>
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
}

#top-nav button {
  background: var(--color-slate-700);
  border: none;
  border-radius: 4px;
  padding: 8px;
  color: white;
}

#bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: center;
  gap: 32px;
  background: var(--color-slate-800);

  @media (width >= 32rem) {
    gap: 64px;
  }

  a {
    height: 84px;
    width: 84px;
    border-radius: 12px;
    font-weight: bold;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;

    &.active-link {
      background: var(--color-slate-700);
    }
  }
}

.popUpMenu {
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  background: var(--color-slate-800);
  z-index: 100;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.popUpMenu a {
  color: inherit;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.popUpMenu button {
  background: transparent;
  border: 1px solid var(--color-white);
  color: var(--color-white);
  border-radius: 4px;
  padding: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.popUpMenu button:hover {
  background: var(--color-slate-700);
}

@media (width >= 32rem) {
  #top-nav button {
    display: none;
  }
}
</style>
