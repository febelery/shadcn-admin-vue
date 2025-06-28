import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
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

// 全局前置守卫 - 处理路由重定向逻辑
router.beforeEach((to, from, next) => {
  // 如果访问的是父路由且没有明确的重定向，自动重定向到默认子路由
  if (to.matched.length > 0) {
    const lastMatch = to.matched[to.matched.length - 1]
    
    // 检查是否是父路由（有子路由但当前路径就是父路径）
    if (lastMatch.children && lastMatch.children.length > 0 && to.path === lastMatch.path) {
      // 查找默认子路由（标记为 isDefault 的路由）
      const defaultChild = lastMatch.children.find(child => child.meta?.isDefault)
      
      if (defaultChild) {
        // 重定向到默认子路由
        const redirectPath = `${lastMatch.path}/${defaultChild.path}`.replace(/\/+/g, '/')
        next(redirectPath)
        return
      }
    }
  }
  
  next()
})

export default router