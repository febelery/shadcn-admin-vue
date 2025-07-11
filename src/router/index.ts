import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { setupRouterGuards } from './guards'
import routes from './routes'

const router = createRouter({
  history:
    import.meta.env.VITE_ROUTER_MODE === 'hash'
      ? createWebHashHistory(import.meta.env.BASE_URL)
      : createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0, behavior: 'smooth' }
  },
  routes: [...routes],
})

// 设置路由守卫
setupRouterGuards(router)

export default router
