import type { RouteRecordRaw } from 'vue-router'

const users: RouteRecordRaw = {
  path: '/dashboard/users',
  component: () => import('@/layout/app/AppSidebar.vue'),
  children: [
    {
      path: '',
      name: 'users',
      component: () => import('@/views/users/index.vue'),
      meta: {
        title: '用户列表',
        permission: 'users.view',
      },
    },
    {
      path: 'create',
      name: 'users-create',
      component: () => import('@/views/users/create.vue'),
      meta: {
        title: '添加用户',
        permission: 'users.create',
      },
    },
  ],
}

export default users