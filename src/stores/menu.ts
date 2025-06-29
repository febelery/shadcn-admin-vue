import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { menuRoutes } from '@/router/routes'
import type { MenuItem } from '@/types/menu'
import {
  filterMenuByPermissions,
  findActiveMenuPath,
  generateMenuFromRoutes,
  setMenuActiveState,
} from '@/utils/menuGenerator'

interface MenuState {
  menuItems: MenuItem[]
  activeMenuPath: string[]
}

export const useMenuStore = defineStore('menu', () => {
  const state = ref<MenuState>({
    menuItems: [],
    activeMenuPath: [],
  })

  // 从菜单路由生成菜单
  const generateMenuFromRouter = () => {
    // 直接使用 modules 文件夹下的路由生成菜单
    state.value.menuItems = generateMenuFromRoutes(menuRoutes)
  }

  // 根据权限过滤菜单
  const filteredMenuItems = computed(() => {
    return (userPermissions: string[] = []) => {
      return filterMenuByPermissions(state.value.menuItems, userPermissions)
    }
  })

  // 设置激活菜单路径
  const setActiveMenuPath = (path: string) => {
    // 设置菜单项的激活状态
    setMenuActiveState(state.value.menuItems, path)

    // 查找激活路径
    state.value.activeMenuPath = findActiveMenuPath(state.value.menuItems, path)
  }

  // 获取当前激活的菜单项
  const activeMenuItem = computed(() => {
    const path = state.value.activeMenuPath
    if (path.length === 0) return null

    const findMenuItem = (items: MenuItem[], targetPath: string): MenuItem | null => {
      for (const item of items) {
        if (item.url === targetPath) {
          return item
        }
        if (item.items) {
          const found = findMenuItem(item.items, targetPath)
          if (found) return found
        }
      }
      return null
    }

    return findMenuItem(state.value.menuItems, path[path.length - 1])
  })

  // 添加菜单项
  const addMenuItem = (menuItem: MenuItem, parentPath?: string) => {
    if (!parentPath) {
      state.value.menuItems.push(menuItem)
    } else {
      const findParent = (items: MenuItem[]): boolean => {
        for (const item of items) {
          if (item.url === parentPath) {
            if (!item.items) item.items = []
            item.items.push(menuItem)
            return true
          }
          if (item.items && findParent(item.items)) {
            return true
          }
        }
        return false
      }
      findParent(state.value.menuItems)
    }

    // 重新排序
    state.value.menuItems.sort((a, b) => (a.order || 0) - (b.order || 0))
  }

  // 移除菜单项
  const removeMenuItem = (path: string) => {
    const removeItem = (items: MenuItem[]): MenuItem[] => {
      return items
        .filter((item) => item.url !== path)
        .map((item) => ({
          ...item,
          items: item.items ? removeItem(item.items) : undefined,
        }))
    }

    state.value.menuItems = removeItem(state.value.menuItems)
  }

  // 更新菜单项
  const updateMenuItem = (path: string, updates: Partial<MenuItem>) => {
    const updateItem = (items: MenuItem[]) => {
      items.forEach((item) => {
        if (item.url === path) {
          Object.assign(item, updates)
        }
        if (item.items) {
          updateItem(item.items)
        }
      })
    }

    updateItem(state.value.menuItems)
  }

  // 初始化菜单
  const initializeMenu = () => {
    generateMenuFromRouter()
  }

  return {
    // state
    menuItems: computed(() => state.value.menuItems),
    activeMenuPath: computed(() => state.value.activeMenuPath),

    // getters
    filteredMenuItems,
    activeMenuItem,

    // actions
    generateMenuFromRouter,
    setActiveMenuPath,
    addMenuItem,
    removeMenuItem,
    updateMenuItem,
    initializeMenu,
  }
})
