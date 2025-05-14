import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/login.vue'),
    },
  ],
})

export default router
