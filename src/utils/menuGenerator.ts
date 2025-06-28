import type { RouteRecordRaw } from 'vue-router'
import type { MenuItem, ExtendedRouteRecordRaw, RouteMeta } from '@/types/menu'

/**
 * 从路由配置自动生成菜单
 * @param routes 路由配置数组
 * @returns 菜单项数组
 */
export function generateMenuFromRoutes(routes: RouteRecordRaw[]): MenuItem[] {
  console.log('Generating menu from routes:', routes)
  
  const menuItems: MenuItem[] = []
  
  // 处理每个路由
  routes.forEach(route => {
    const meta = route.meta as RouteMeta
    
    // 跳过不需要显示在菜单中的路由
    if (!meta?.title || meta.hideInMenu) {
      return
    }

    // 检查是否有子路由
    const hasChildren = route.children && route.children.length > 0
    
    if (hasChildren) {
      // 处理有子路由的情况
      const parentMenuItem: MenuItem = {
        title: meta.title,
        url: route.path,
        icon: meta.icon,
        permission: meta.permission,
        order: meta.order || 0,
        group: meta.group,
        badge: meta.badge,
        disabled: meta.disabled,
        external: meta.external,
        target: meta.target,
        items: [],
      }

      // 处理子路由
      route.children?.forEach(child => {
        const childMeta = child.meta as RouteMeta
        
        // 跳过隐藏的子路由
        if (!childMeta?.title || childMeta.hideInMenu) {
          return
        }

        const childPath = child.path === '' ? route.path : `${route.path}/${child.path}`
        
        const childMenuItem: MenuItem = {
          title: childMeta.title,
          url: childPath,
          icon: childMeta.icon,
          permission: childMeta.permission,
          order: childMeta.order || 0,
          group: childMeta.group,
          badge: childMeta.badge,
          disabled: childMeta.disabled,
          external: childMeta.external,
          target: childMeta.target,
        }

        parentMenuItem.items!.push(childMenuItem)
      })

      // 对子菜单排序
      if (parentMenuItem.items && parentMenuItem.items.length > 0) {
        parentMenuItem.items.sort((a, b) => (a.order || 0) - (b.order || 0))
      }

      menuItems.push(parentMenuItem)
    } else {
      // 处理没有子路由的情况
      const menuItem: MenuItem = {
        title: meta.title,
        url: route.path,
        icon: meta.icon,
        permission: meta.permission,
        order: meta.order || 0,
        group: meta.group,
        badge: meta.badge,
        disabled: meta.disabled,
        external: meta.external,
        target: meta.target,
      }

      menuItems.push(menuItem)
    }
  })

  // 对顶级菜单排序
  menuItems.sort((a, b) => (a.order || 0) - (b.order || 0))
  
  console.log('Generated menu items:', menuItems)
  return menuItems
}

/**
 * 根据权限过滤菜单
 * @param menuItems 菜单项数组
 * @param userPermissions 用户权限数组
 * @returns 过滤后的菜单项数组
 */
export function filterMenuByPermissions(menuItems: MenuItem[], userPermissions: string[] = []): MenuItem[] {
  return menuItems
    .filter((item) => {
      // 检查权限
      if (item.permission) {
        const permissions = Array.isArray(item.permission) ? item.permission : [item.permission]
        const hasPermission = permissions.some(permission => userPermissions.includes(permission))
        
        if (!hasPermission) {
          // 如果没有权限，检查是否有子菜单有权限
          if (item.items && item.items.length > 0) {
            const filteredChildren = filterMenuByPermissions(item.items, userPermissions)
            return filteredChildren.length > 0
          }
          return false
        }
      }
      
      return true
    })
    .map((item) => ({
      ...item,
      items: item.items ? filterMenuByPermissions(item.items, userPermissions) : undefined,
    }))
}

/**
 * 按组分组菜单项
 * @param menuItems 菜单项数组
 * @returns 分组后的菜单项对象
 */
export function groupMenuItems(menuItems: MenuItem[]): Record<string, MenuItem[]> {
  const grouped: Record<string, MenuItem[]> = {}
  
  menuItems.forEach((item) => {
    const group = item.group || 'default'
    if (!grouped[group]) {
      grouped[group] = []
    }
    grouped[group].push(item)
  })
  
  return grouped
}

/**
 * 查找激活的菜单项
 * @param menuItems 菜单项数组
 * @param currentPath 当前路径
 * @returns 激活的菜单项路径数组
 */
export function findActiveMenuPath(menuItems: MenuItem[], currentPath: string): string[] {
  const path: string[] = []
  
  function findPath(items: MenuItem[], targetPath: string, currentPath: string[] = []): boolean {
    for (const item of items) {
      const itemPath = [...currentPath, item.url]
      
      // 精确匹配或路径包含匹配
      if (item.url === targetPath || targetPath.startsWith(item.url + '/')) {
        path.push(...itemPath)
        return true
      }
      
      if (item.items && item.items.length > 0) {
        if (findPath(item.items, targetPath, itemPath)) {
          return true
        }
      }
    }
    
    return false
  }
  
  findPath(menuItems, currentPath)
  return path
}

/**
 * 设置菜单项的激活状态
 * @param menuItems 菜单项数组
 * @param currentPath 当前路径
 */
export function setMenuActiveState(menuItems: MenuItem[], currentPath: string): void {
  function setActive(items: MenuItem[], path: string): void {
    items.forEach(item => {
      // 精确匹配或路径包含匹配
      item.isActive = item.url === path || path.startsWith(item.url + '/')
      
      if (item.items) {
        setActive(item.items, path)
      }
    })
  }
  
  setActive(menuItems, currentPath)
}