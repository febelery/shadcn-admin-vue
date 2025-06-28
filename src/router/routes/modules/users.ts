import type { RouteRecordRaw } from 'vue-router'
import { Users, UserPlus, UserCheck, Shield } from 'lucide-vue-next'

const users: RouteRecordRaw = {
  path: '/users',
  component: () => import('@/layout/app/AppSidebar.vue'),
  redirect: '/users/list', // 重定向到默认子路由
  meta: {
    title: '用户',
    icon: Users,
    permission: 'users',
    order: 2,
    group: 'management',
  },
  children: [
    {
      path: 'list',
      name: 'users-list',
      component: () => import('@/views/users/index.vue'),
      meta: {
        title: '用户列表',
        icon: Users,
        permission: 'users.view',
        isDefault: true, // 标记为默认路由
      },
    },
    {
      path: 'create',
      name: 'users-create',
      component: () => import('@/views/users/create.vue'),
      meta: {
        title: '添加用户',
        icon: UserPlus,
        permission: 'users.create',
        order: 1,
      },
    },
    {
      path: 'audit',
      name: 'users-audit',
      component: () => import('@/views/coming-soon/index.vue'),
      meta: {
        title: '用户审核',
        icon: UserCheck,
        permission: 'users.audit',
        order: 2,
        badge: 5,
      },
    },
    {
      path: 'permissions',
      name: 'users-permissions',
      component: () => import('@/views/coming-soon/index.vue'),
      meta: {
        title: '权限管理',
        icon: Shield,
        permission: 'users.permissions',
        order: 3,
      },
    },
  ],
}

export default users