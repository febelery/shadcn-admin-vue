import type { RouteRecordRaw } from 'vue-router'

const login: RouteRecordRaw = {
  path: '/login',
  name: 'login',
  component: () => import('@/views/auth/login.vue'),
}

export default login
