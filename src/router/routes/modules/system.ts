import { Activity, Bell, Database, FileText, Settings, Shield } from 'lucide-vue-next'
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
      path: 'office',
      component: () => import('@/views/system/office.vue'),
      meta: {
        title: '文档编辑器',
        icon: FileText,
        order: 1,
      },
    },
    {
      path: 'settings',
      name: 'system-settings',
      component: () => import('@/views/coming-soon/index.vue'),
      meta: {
        title: '系统设置',
        icon: Settings,
        permission: 'system.settings',
        order: 2,
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
        order: 3,
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
        order: 4,
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
        order: 5,
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
        order: 6,
      },
    },
  ],
}

export default system
