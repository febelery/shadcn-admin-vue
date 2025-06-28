import type { RouteRecordRaw } from 'vue-router'

const dashboard: RouteRecordRaw = {
  path: '/dashboard',
  component: () => import('@/layout/app/AppSidebar.vue'),
  children: [
    {
      path: '',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index.vue'),
      meta: {
        title: 'Dashboard',
      },
    },
  ],
}

export default dashboard