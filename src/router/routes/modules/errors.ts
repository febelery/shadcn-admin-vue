import type { RouteRecordRaw } from 'vue-router'

const errors: RouteRecordRaw[] = [
  {
    path: '/401',
    name: 'unauthorized',
    component: () => import('@/views/errors/401.vue'),
  },
  {
    path: '/500',
    name: 'serverError',
    component: () => import('@/views/errors/500.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/errors/404.vue'),
  },
]

export default errors
