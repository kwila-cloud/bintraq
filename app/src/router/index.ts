import { createRouter, createWebHistory } from 'vue-router'
import AddBinView from '../views/AddBinView.vue';
import PendingBinsView from '../views/PendingBinsView.vue'
import HistoryView from '../views/HistoryView.vue'
import AboutView from '../views/AboutView.vue'
import LoginPage from '../views/LoginPage.vue'
import { supabase } from '@/lib/supabaseClient'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: '/about'
    },
    {
      path: '/add-bin',
      name: 'add-bin',
      component: AddBinView,
      meta: { requiresAuth: true }
    },
    {
      path: '/pending',
      name: 'pending',
      component: PendingBinsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/history',
      name: 'history',
      component: HistoryView,
      meta: { requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
  ]
})

router.beforeEach(async (to) => {
  const { data: { session } } = await supabase.auth.getSession()

  if (to.meta.requiresAuth && !session) {
    return '/login'
  }
})

export default router
