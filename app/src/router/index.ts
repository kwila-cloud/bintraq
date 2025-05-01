import { createRouter, createWebHistory } from 'vue-router'
import BinsView from '../views/BinsView.vue'
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
      path: '/bins',
      name: 'bins',
      component: BinsView,
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
