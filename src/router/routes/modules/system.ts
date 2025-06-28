import type { RouteRecordRaw } from 'vue-router'
import { Settings, Database, Shield, Bell, Activity } from 'lucide-vue-next'

const system: RouteRecordRaw = {
  path: '/system',
  component: () => import('@/layout/app/AppSidebar.vue'),
  redirect: '/system/settings', // 重定向到默认子路由
  meta: {
    title: '系统',
    icon: Settings,
    permission: 'system',
    order: 4,
    group: 'system',
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
        isDefault: true, // 标记为默认路由
        order: 1,
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
      },
    },
  ],
}

export default system