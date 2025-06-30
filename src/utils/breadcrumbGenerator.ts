import type { RouteLocationMatched } from 'vue-router'
import type { BreadcrumbItem } from '@/types/menu'

/**
 * 从路由匹配记录生成面包屑
 * @param matched 路由匹配记录数组
 * @returns 面包屑项数组
 */
export function generateBreadcrumbFromRoute(matched: RouteLocationMatched[]): BreadcrumbItem[] {
  const breadcrumb: BreadcrumbItem[] = []

  matched.forEach((route, index) => {
    const meta = route.meta

    // 跳过没有标题的路由
    if (!meta?.title) return

    // 跳过隐藏的面包屑项
    if (meta.hideBreadcrumb) return

    const isLast = index === matched.length - 1

    // 构建面包屑项
    const breadcrumbItem: BreadcrumbItem = {
      title: meta.title as string,
      icon: meta.icon as any,
    }

    // 如果不是最后一项，添加链接
    if (!isLast) {
      // 对于父路由，直接链接到父路径，利用 redirect 机制
      breadcrumbItem.href = route.path
    }

    breadcrumb.push(breadcrumbItem)
  })

  return breadcrumb
}

/**
 * 智能生成面包屑，处理特殊情况
 * @param matched 路由匹配记录数组
 * @param currentPath 当前路径
 * @returns 面包屑项数组
 */
export function generateSmartBreadcrumb(matched: RouteLocationMatched[], currentPath: string): BreadcrumbItem[] {
  const breadcrumb = generateBreadcrumbFromRoute(matched)

  // 如果面包屑为空或只有一项，尝试从当前路径推断
  if (breadcrumb.length <= 1) {
    const pathSegments = currentPath.split('/').filter(Boolean)

    if (pathSegments.length > 1) {
      // 添加父级面包屑
      const parentPath = `/${pathSegments[0]}`
      const parentBreadcrumb: BreadcrumbItem = {
        title: getRouteTitle(parentPath),
        href: parentPath,
      }

      if (breadcrumb.length === 0) {
        breadcrumb.push(parentBreadcrumb)
      } else {
        breadcrumb.unshift(parentBreadcrumb)
      }
    }
  }

  return breadcrumb
}

/**
 * 根据路径获取路由标题
 * @param path 路径
 * @returns 标题
 */
function getRouteTitle(path: string): string {
  const titleMap: Record<string, string> = {
    '/dashboard': '仪表板',
    '/users': '用户',
    '/articles': '文章',
    '/system': '系统',
  }

  return titleMap[path] || path.replace('/', '').replace('-', ' ')
}
