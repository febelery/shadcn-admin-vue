import { type LucideIcon } from 'lucide-vue-next'

// 定义递归的菜单项类型
export interface MenuItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: MenuItem[]
}

// 递归检查是否有激活的子项
export const hasActiveChild = (items?: MenuItem[]): boolean => {
  if (!items) return false
  return items.some((item) => {
    if (item.isActive) return true
    if (item.items) return hasActiveChild(item.items)
    return false
  })
}

// 获取菜单项的激活状态
export const getMenuActiveState = (item: MenuItem): boolean => {
  if (item.isActive) return true
  if (item.items) return hasActiveChild(item.items)
  return false
}

// 导出一个组合式函数，可以按需扩展更多菜单相关的功能
export function useMenu() {
  return {
    hasActiveChild,
    getMenuActiveState,
  }
}

export default useMenu
