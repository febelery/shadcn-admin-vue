import type { RouteRecordRaw } from 'vue-router'
import type { MenuItem, RouteMeta } from '@/types/menu'

/**
 * 判断路由是否应该显示在菜单中
 * @param route 路由记录
 * @returns 是否显示在菜单中
 */
function shouldShowInMenu(route: RouteRecordRaw): boolean {
  const meta = route.meta as RouteMeta
  
  // 1. 必须有标题
  if (!meta?.title) return false
  
  // 2. 明确标记为隐藏的不显示
  if (meta.hideInMenu) return false
  
  return true
}

/**
 * 判断是否为菜单根节点
 * @param route 路由记录
 * @returns 是否为菜单根节点
 */
function isMenuRoot(route: RouteRecordRaw): boolean {
  // 智能判断：顶级路由且有子路由
  const pathSegments = route.path.split('/').filter(Boolean)
  const isTopLevel = pathSegments.length === 1
  const hasChildren = route.children && route.children.length > 0
  
  return isTopLevel && hasChildren
}

/**
 * 递归处理路由的子路由
 * @param children 子路由数组
 * @param parentPath 父路径
 * @returns 菜单项数组
 */
function processRouteChildren(children: RouteRecordRaw[], parentPath: string): MenuItem[] {
  const menuItems: MenuItem[] = []
  
  children.forEach(child => {
    // 检查是否应该显示在菜单中
    if (!shouldShowInMenu(child)) {
      return
    }

    const childMeta = child.meta as RouteMeta
    const childPath = child.path === '' ? parentPath : `${parentPath}/${child.path}`
    
    const childMenuItem: MenuItem = {
      title: childMeta.title!,
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

    // 递归处理子路由的子路由
    if (child.children && child.children.length > 0) {
      const subItems = processRouteChildren(child.children, childPath)
      if (subItems.length > 0) {
        childMenuItem.items = subItems
      }
    }

    menuItems.push(childMenuItem)
  })

  // 对菜单项排序
  menuItems.sort((a, b) => (a.order || 0) - (b.order || 0))
  
  return menuItems
}

/**
 * 从路由配置自动生成菜单
 * @param routes 路由配置数组
 * @returns 菜单项数组
 */
export function generateMenuFromRoutes(routes: RouteRecordRaw[]): MenuItem[] {
  const menuItems: MenuItem[] = []
  
  // 只处理菜单根节点
  const menuRoots = routes.filter(route => {
    return shouldShowInMenu(route) && isMenuRoot(route)
  })
  
  // 处理每个菜单根节点
  menuRoots.forEach(route => {
    const meta = route.meta as RouteMeta
    
    const parentMenuItem: MenuItem = {
      title: meta.title!,
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

    // 递归处理子路由
    if (route.children && route.children.length > 0) {
      const childItems = processRouteChildren(route.children, route.path)
      if (childItems.length > 0) {
        parentMenuItem.items = childItems
      }
    }

    menuItems.push(parentMenuItem)
  })

  // 对顶级菜单排序
  menuItems.sort((a, b) => (a.order || 0) - (b.order || 0))
  
  return menuItems
}

/**
 * 根据权限过滤菜单（递归处理）
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
 * 递归查找激活的菜单项
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
 * 递归设置菜单项的激活状态
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