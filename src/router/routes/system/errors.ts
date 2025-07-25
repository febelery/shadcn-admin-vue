import type { RouteRecordRaw } from 'vue-router'

const errors: RouteRecordRaw[] = [
  {
    path: '/401',
    name: 'unauthorized',
    component: () => import('@/views/errors/401.vue'),
    meta: {
      title: '未授权',
    },
  },
  {
    path: '/403',
    name: 'forbidden',
    component: () => import('@/views/errors/403.vue'),
    meta: {
      title: '禁止访问',
    },
  },
  {
    path: '/500',
    name: 'serverError',
    component: () => import('@/views/errors/500.vue'),
    meta: {
      title: '服务器错误',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/errors/404.vue'),
    meta: {
      title: '页面未找到',
    },
  },
]

export default errors
