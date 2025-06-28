import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/user'

/**
 * 检查路由是否需要认证（支持父子路由继承）
 * @param matched 路由匹配记录数组
 * @returns 是否需要认证
 */
function requiresAuthentication(matched: any[]): boolean {
  // 从父到子遍历路由，如果任何一级设置了 requiresAuth，则继承该设置
  for (const route of matched) {
    if (route.meta?.requiresAuth !== undefined) {
      return route.meta.requiresAuth
    }
  }
  
  // 如果没有明确设置，默认需要认证
  return true
}

/**
 * 检查用户是否有访问路由的权限
 * @param matched 路由匹配记录数组
 * @param userPermissions 用户权限数组
 * @returns 是否有权限
 */
function hasRoutePermission(matched: any[], userPermissions: string[]): boolean {
  // 检查最具体的路由（最后一个匹配的路由）的权限
  const targetRoute = matched[matched.length - 1]
  
  if (!targetRoute?.meta?.permission) {
    return true // 没有权限要求的路由允许访问
  }
  
  const requiredPermissions = Array.isArray(targetRoute.meta.permission) 
    ? targetRoute.meta.permission 
    : [targetRoute.meta.permission]
  
  return requiredPermissions.some(permission => userPermissions.includes(permission))
}

/**
 * 获取用户有权限访问的第一个路由
 * @param userPermissions 用户权限数组
 * @returns 路由路径
 */
function getFirstAccessibleRoute(userPermissions: string[]): string {
  // 这里可以根据权限返回合适的首页路由
  // 简单实现：如果有 dashboard.view 权限就去 dashboard，否则去第一个有权限的路由
  if (userPermissions.includes('dashboard.view')) {
    return '/dashboard'
  }
  
  // 可以根据实际需求扩展更复杂的逻辑
  return '/403'
}

export function setupRouterGuards(router: Router) {
  // 全局前置守卫
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()
    
    // 检查路由是否需要认证
    const needsAuth = requiresAuthentication(to.matched)
    
    // 如果路由不需要认证，直接放行
    if (!needsAuth) {
      next()
      return
    }
    
    // 检查用户是否已登录
    if (!userStore.isLoggedIn) {
      // 未登录，重定向到登录页
      const redirect = encodeURIComponent(to.fullPath)
      next(`/login?redirect=${redirect}`)
      return
    }
    
    // 已登录，检查是否有用户信息
    if (!userStore.userInfo) {
      try {
        await userStore.getUserInfo()
      } catch (error) {
        // 获取用户信息失败，可能是 token 过期
        userStore.logout()
        const redirect = encodeURIComponent(to.fullPath)
        next(`/login?redirect=${redirect}`)
        return
      }
    }
    
    // 检查权限
    const userPermissions = userStore.userInfo?.permissions || []
    const hasPermission = hasRoutePermission(to.matched, userPermissions)
    
    if (!hasPermission) {
      // 没有权限，重定向到 403 页面
      next('/403')
      return
    }
    
    // 如果访问根路径，重定向到用户有权限的第一个路由
    if (to.path === '/') {
      const firstRoute = getFirstAccessibleRoute(userPermissions)
      next(firstRoute)
      return
    }
    
    // 所有检查通过，允许访问
    next()
  })
  
  // 全局后置守卫
  router.afterEach((to) => {
    // 设置页面标题
    const title = to.meta?.title
    if (title) {
      document.title = `${title} - Shadcn Vue Admin`
    } else {
      document.title = 'Shadcn Vue Admin'
    }
  })
}