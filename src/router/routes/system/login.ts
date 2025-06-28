import type { RouteRecordRaw } from 'vue-router'

const login: RouteRecordRaw = {
  path: '/login',
  name: 'login',
  component: () => import('@/views/auth/login.vue'),
  meta: {
    title: '登录',
    requiresAuth: false, // 明确标记登录页不需要认证
  },
}

export default login