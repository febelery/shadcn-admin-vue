import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { menuRoutes } from '@/router/routes'

// 获取用户有权限访问的第一个路由
function getFirstAccessibleRoute(permissions: string[]): string {
  // 遍历菜单路由，找到第一个有权限访问的路由
  for (const route of menuRoutes) {
    if (route.meta?.permission) {
      const routePermissions = Array.isArray(route.meta.permission) 
        ? route.meta.permission 
        : [route.meta.permission]
      
      // 检查是否有权限访问这个路由
      if (routePermissions.some(permission => permissions.includes(permission))) {
        // 如果有子路由，返回第一个子路由的路径
        if (route.children && route.children.length > 0) {
          const firstChild = route.children.find(child => !child.meta?.hideInMenu)
          if (firstChild) {
            return firstChild.path === '' ? route.path : `${route.path}/${firstChild.path}`
          }
        }
        return route.path
      }
    } else {
      // 如果路由本身没有权限要求，检查子路由
      if (route.children && route.children.length > 0) {
        for (const child of route.children) {
          if (child.meta?.permission) {
            const childPermissions = Array.isArray(child.meta.permission) 
              ? child.meta.permission 
              : [child.meta.permission]
            
            if (childPermissions.some(permission => permissions.includes(permission))) {
              return child.path === '' ? route.path : `${route.path}/${child.path}`
            }
          }
        }
      }
    }
  }
  
  // 如果没有找到有权限的路由，返回 403 页面
  return '/403'
}

export function setupRouterGuards(router: Router) {
  // 全局前置守卫
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()
    
    // 公开路由，不需要登录
    const publicRoutes = ['/login', '/401', '/403', '/404', '/500']
    const isPublicRoute = publicRoutes.includes(to.path)
    
    // 如果是公开路由，直接放行
    if (isPublicRoute) {
      // 如果已登录用户访问登录页，重定向到首页
      if (to.path === '/login' && userStore.isLoggedIn) {
        const permissions = userStore.userInfo?.permissions || []
        const firstRoute = getFirstAccessibleRoute(permissions)
        next(firstRoute)
        return
      }
      next()
      return
    }

    // 检查是否已登录
    if (!userStore.isLoggedIn) {
      next(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
      return
    }

    // 尝试获取用户信息（如果本地没有）
    if (!userStore.userInfo) {
      try {
        await userStore.getUserInfo()
      } catch (error) {
        next('/login')
        return
      }
    }

    // 根路径重定向到第一个有权限的路由
    if (to.path === '/') {
      const permissions = userStore.userInfo?.permissions || []
      const firstRoute = getFirstAccessibleRoute(permissions)
      next(firstRoute)
      return
    }

    // 检查路由权限
    if (to.meta?.permission) {
      const routePermissions = Array.isArray(to.meta.permission) 
        ? to.meta.permission 
        : [to.meta.permission]
      
      const hasPermission = userStore.hasAnyPermission(routePermissions)
      
      if (!hasPermission) {
        next('/403')
        return
      }
    }

    next()
  })

  // 全局后置钩子
  router.afterEach((to) => {
    // 设置页面标题
    if (to.meta?.title) {
      document.title = `${to.meta.title} - Shadcn Vue Admin`
    } else {
      document.title = 'Shadcn Vue Admin'
    }
  })
}