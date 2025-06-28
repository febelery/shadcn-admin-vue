import type { RouteRecordRaw } from 'vue-router'
import { LayoutDashboard } from 'lucide-vue-next'

const dashboard: RouteRecordRaw = {
  path: '/dashboard',
  component: () => import('@/layout/app/AppSidebar.vue'),
  meta: {
    title: '仪表板',
    icon: LayoutDashboard,
    order: 1,
    group: 'main',
    isMenuRoot: true, // 明确标记为菜单根节点
  },
  children: [
    {
      path: '',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index.vue'),
      meta: {
        title: '仪表板',
        hideInMenu: true, // 隐藏子路由，只显示父级
      },
    },
  ],
}

export default dashboard