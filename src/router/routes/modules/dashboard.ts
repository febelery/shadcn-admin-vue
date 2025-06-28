import type { RouteRecordRaw } from 'vue-router'
import { LayoutDashboard } from 'lucide-vue-next'

const dashboard: RouteRecordRaw = {
  path: '/dashboard',
  component: () => import('@/layout/app/AppSidebar.vue'),
  meta: {
    title: '仪表板',
    icon: LayoutDashboard,
    permission: 'dashboard.view', // 添加权限要求
    order: 1,
    group: 'main',
    isMenuRoot: true,
  },
  children: [
    {
      path: '',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index.vue'),
      meta: {
        title: '仪表板',
        hideInMenu: true,
      },
    },
  ],
}

export default dashboard