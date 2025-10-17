import { createRouter, createWebHistory } from 'vue-router'
import AddBinView from '@/views/AddBinView.vue'
import PendingBinsView from '@/views/PendingBinsView.vue'
import BinsHistoryView from '@/views/BinsHistoryView.vue'
import ManagePickersView from '@/views/ManagePickersView.vue'
import AboutView from '@/views/AboutView.vue'
import LoginPage from '@/views/LoginPage.vue'
import SmsUsageView from '@/views/SmsUsageView.vue'
import SettingsView from '@/views/SettingsView.vue'
import { supabase } from '@/lib/supabaseClient'
import { isDailyCountUiEnabled } from '@/lib/utils'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: '/about',
    },
    {
      path: '/add',
      name: 'add',
      component: () => {
        if (isDailyCountUiEnabled()) {
          return import('@/views/AddDailyCountView.vue')
        }
        return AddBinView
      },
      meta: { requiresAuth: true },
    },
    {
      path: '/pending',
      name: 'pending',
      component: () => {
        if (isDailyCountUiEnabled()) {
          return import('@/views/PendingDailyCountsView.vue')
        }
        return PendingBinsView
      },
      meta: { requiresAuth: true },
    },
    {
      path: '/history',
      name: 'history',
      component: () => {
        if (isDailyCountUiEnabled()) {
          return import('@/views/DailyCountsHistoryView.vue')
        }
        return BinsHistoryView
      },
      meta: { requiresAuth: true },
    },
    {
      path: '/pickers',
      name: 'pickers',
      component: ManagePickersView,
      meta: { requiresAuth: true },
    },
    {
      path: '/sms-usage',
      name: 'sms-usage',
      component: SmsUsageView,
      meta: { requiresAuth: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
  ],
})

router.beforeEach(async (to) => {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (to.meta.requiresAuth && !session) {
    return '/login'
  }
})

export default router
