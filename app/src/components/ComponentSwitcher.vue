<!--
ComponentSwitcher - A component designed for dynamic routing in Vue Router

NOTE: This component is specifically designed for router-level conditional component selection.

Props:
- getComponent: () => Component - Function that returns the component to render

Router Usage Examples:

1. Feature flag routing:
{
  path: '/dashboard',
  component: ComponentSwitcher,
  props: {
    getComponent: () => isNewUIEnabled() 
      ? () => import('@/views/NewDashboard.vue')
      : () => import('@/views/LegacyDashboard.vue')
  }
}

2. Role-based routing:
{
  path: '/admin',
  component: ComponentSwitcher,
  props: {
    getComponent: () => {
      const user = getCurrentUser()
      if (user.isAdmin) return () => import('@/views/AdminPanel.vue')
      if (user.isModerator) return () => import('@/views/ModeratorPanel.vue')
      return () => import('@/views/AccessDenied.vue')
    }
  }
}

3. A/B testing routing:
{
  path: '/homepage',
  component: ComponentSwitcher,
  props: {
    getComponent: () => {
      const variant = getABTestVariant('homepage')
      return variant === 'variant_a' 
        ? () => import('@/views/HomepageVariantA.vue')
        : () => import('@/views/HomepageControl.vue')
    }
  }
}

4. Environment-based routing:
{
  path: '/debug',
  component: ComponentSwitcher,
  props: {
    getComponent: () => import.meta.env.DEV
      ? () => import('@/views/DebugTools.vue')
      : () => import('@/views/NotFound.vue')
  }
}

Why use ComponentSwitcher instead of built-in Vue patterns?
- Vue Router requires static component definitions at route configuration time
- This component provides a bridge between static router config and dynamic component selection
- Enables runtime component switching based on application state
- Maintains async loading benefits for performance
-->
<script setup lang="ts">
import { computed, type Component } from "vue";

interface Props {
  getComponent: () => Component;
}

const props = defineProps<Props>();

const currentComponent = computed(() => props.getComponent());
</script>

<template>
  <component :is="currentComponent" />
</template>
