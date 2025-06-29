import { Activity, Bell, Database, Settings, Shield } from 'lucide-vue-next'
import type { RouteRecordRaw } from 'vue-router'

const system: RouteRecordRaw = {
  path: '/system',
  component: () => import('@/layout/app/AppSidebar.vue'),
  redirect: '/system/settings',
  meta: {
    title: '系统',
    icon: Settings,
    permission: 'system',
    order: 4,
    group: 'system',
    isMenuRoot: true,
    requiresAuth: true, // 父路由需要认证，所有子路由会继承
  },
  children: [
    {
      path: 'settings',
      name: 'system-settings',
      component: () => import('@/views/coming-soon/index.vue'),
      meta: {
        title: '系统设置',
        icon: Settings,
        permission: 'system.settings',
        order: 1,
        // 继承父路由的 requiresAuth: true
      },
    },
    {
      path: 'database',
      name: 'system-database',
      component: () => import('@/views/coming-soon/index.vue'),
      meta: {
        title: '数据库管理',
        icon: Database,
        permission: 'system.database',
        order: 2,
        // 继承父路由的 requiresAuth: true
      },
    },
    {
      path: 'security',
      name: 'system-security',
      component: () => import('@/views/coming-soon/index.vue'),
      meta: {
        title: '安全设置',
        icon: Shield,
        permission: 'system.security',
        order: 3,
        // 继承父路由的 requiresAuth: true
      },
    },
    {
      path: 'notifications',
      name: 'system-notifications',
      component: () => import('@/views/coming-soon/index.vue'),
      meta: {
        title: '通知管理',
        icon: Bell,
        permission: 'system.notifications',
        order: 4,
        badge: 'NEW',
        // 继承父路由的 requiresAuth: true
      },
    },
    {
      path: 'logs',
      name: 'system-logs',
      component: () => import('@/views/coming-soon/index.vue'),
      meta: {
        title: '系统日志',
        icon: Activity,
        permission: 'system.logs',
        order: 5,
        // 继承父路由的 requiresAuth: true
      },
    },
  ],
}

export default system
