<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'
import MenuModal from '@/components/MenuModal.vue'

const isLoggedIn = ref(false)
const showMenuModal = ref(false)
const isTopNavVisible = ref(true)
const router = useRouter()
let lastScrollY = 0

async function checkAuth() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  isLoggedIn.value = !!session
}

function handleScroll() {
  const currentScrollY = window.scrollY
  
  if (currentScrollY < lastScrollY || currentScrollY < 10) {
    // Scrolling up or near top
    isTopNavVisible.value = true
  } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
    // Scrolling down and past threshold
    isTopNavVisible.value = false
  }
  
  lastScrollY = currentScrollY
}

onMounted(() => {
  checkAuth()
  
  window.addEventListener('scroll', handleScroll, { passive: true })

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(() => {
    checkAuth()
  })

  onBeforeUnmount(() => {
    subscription.unsubscribe()
    window.removeEventListener('scroll', handleScroll)
  })
})

async function signOut() {
  await supabase.auth.signOut()
  router.push('/login')
}

function toggleMenu() {
  showMenuModal.value = !showMenuModal.value
}
</script>

<template>
  <nav id="top-nav" :class="{ 'nav-hidden': !isTopNavVisible }">
    <RouterLink v-if="isLoggedIn" to="/add-bin">BinTraq</RouterLink>
    <RouterLink v-else to="/about">BinTraq</RouterLink>
    <button class="button-as-a" @click="toggleMenu">
      <Icon icon="system-uicons:menu-hamburger" height="32" />
    </button>
  </nav>
  <main class="main-content">
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

  <MenuModal v-if="showMenuModal" @close="toggleMenu" id="menu">
    <template v-if="isLoggedIn">
      <RouterLink to="/pickers">Pickers</RouterLink>
      <button class="button-as-a" @click="signOut">Logout</button>
    </template>
    <RouterLink v-else to="/login">Login</RouterLink>
  </MenuModal>
</template>

<style scoped>
a,
button {
  font-size: 1rem;
  line-height: 2;
  padding: 8px;
  border-radius: 8px;
  text-align: center;
}

#top-nav {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  background: var(--color-slate-800);
  padding: 16px;
  margin: 16px;
  border-radius: 12px;
  z-index: 10;
  transition: transform 0.3s ease-in-out;

  :first-child {
    margin-inline-end: auto;
    font-weight: bold;
    font-size: 1.5rem;
    color: var(--color-white);
    background: transparent;
  }

  &.nav-hidden {
    transform: translateY(-100%);
  }
}

#top-nav,
#menu {
  a,
  button {
    background: var(--color-slate-700);
  }
}

.main-content {
  padding: 0 1rem 120px 1rem; /* Bottom padding to account for bottom nav */
  min-height: calc(100vh - 120px);

  @media (width >= 768px) {
    padding: 0 2rem 120px 2rem;
  }
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
  z-index: 10;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);

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

    white-space: nowrap;

    &.active-link {
      background: var(--color-slate-700);
    }
  }
}
</style>
