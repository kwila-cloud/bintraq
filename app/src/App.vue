<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from "vue-router";
import { supabase } from "@/lib/supabaseClient";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Icon } from "@iconify/vue";
import MenuModal from "@/components/MenuModal.vue";

const isLoggedIn = ref(false);
const showMenuModal = ref(false);
const router = useRouter();

async function checkAuth() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  isLoggedIn.value = !!session;
}

onMounted(() => {
  checkAuth();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(() => {
    checkAuth();
  });

  onBeforeUnmount(() => {
    subscription.unsubscribe();
  });
});

async function signOut() {
  await supabase.auth.signOut();
  router.push("/login");
}

function toggleMenu() {
  showMenuModal.value = !showMenuModal.value;
}

function refresh() {
  window.location.reload();
}
</script>

<template>
  <nav id="top-nav">
    <RouterLink v-if="isLoggedIn" to="/add-bin">BinTraq</RouterLink>
    <RouterLink v-else to="/about">BinTraq</RouterLink>
    <button class="button-as-a" @click="toggleMenu">
      <Icon icon="system-uicons:menu-hamburger" height="32" />
    </button>
  </nav>

  <main class="main-content">
    <div class="max-w-6xl mx-auto h-full">
      <RouterView />
    </div>
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
      <RouterLink to="/pickers">
        <Icon icon="system-uicons:users" height="24" />
        Pickers
      </RouterLink>
      <RouterLink to="/sms-usage">
        <Icon icon="system-uicons:files-history" height="24" />
        SMS Usage
      </RouterLink>
      <button class="button-as-a" @click="signOut">
        <Icon icon="system-uicons:exit-right" height="24" />
        Logout
      </button>
    </template>
    <RouterLink v-else to="/login">
      <Icon icon="system-uicons:enter" height="24" />
      Login
    </RouterLink>
    <button class="button-as-a" @click="refresh">
      <Icon icon="system-uicons:refresh-alt" height="24" />
      Refresh
    </button>
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
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  background: var(--color-slate-800);
  padding: 8px 16px;
  z-index: 10;

  :first-child {
    margin-inline-end: auto;
    font-weight: bold;
    font-size: 1.5rem;
    color: var(--color-white);
    background: transparent;
  }
}

#top-nav,
#menu {
  a,
  button {
    background: var(--color-slate-700);
  }
}

#menu {
  a,
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: calc(var(--spacing) * 2);
    font-weight: bold;
  }
}

.main-content {
  min-height: calc(100vh - 196px);
  max-height: calc(100vh - 196px);
  overflow: auto;
}

#bottom-nav {
  width: 100%;
  padding: 24px;
  padding-top: 8px;
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
