import { createRouter, createWebHistory } from 'vue-router'
import BinsView from '../views/BinsView.vue'
import AboutView from '../views/AboutView.vue'
import LoginPage from '../views/LoginPage.vue'
import { supabase } from '@/lib/supabaseClient'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
    {
      path: '/',
      name: 'root',
      redirect: () => {
        const session = supabase.auth.getSession()
        if (session) {
          return '/bins'
        } else {
          return '/about'
        }
      }
    }
  ]
})

router.beforeEach(async (to) => {
  const { data: { session } } = await supabase.auth.getSession()

  if (to.meta.requiresAuth && !session) {
    return '/login'
  }
})

export default router
