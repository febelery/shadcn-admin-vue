import { defineStore } from 'pinia'
import type { LucideIcon } from 'lucide-vue-next'
import { 
  BookOpen, 
  Bot, 
  CircleHelp, 
  Settings, 
  Settings2, 
  SquareTerminal, 
  Users, 
  FileText,
  UserPlus,
  UserCheck,
  Edit3,
  FileEdit,
  Archive
} from 'lucide-vue-next'

export interface MenuItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: MenuItem[]
  permission?: string // 权限标识
}

interface MenuState {
  menuItems: MenuItem[]
}

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    menuItems: [
      {
        title: '用户管理',
        url: '/dashboard/users',
        icon: Users,
        permission: 'users.view',
        items: [
          {
            title: '用户列表',
            url: '/dashboard/users',
            icon: Users,
            permission: 'users.view',
          },
          {
            title: '添加用户',
            url: '/dashboard/users/create',
            icon: UserPlus,
            permission: 'users.create',
          },
          {
            title: '用户审核',
            url: '/dashboard/users/audit',
            icon: UserCheck,
            permission: 'users.audit',
          },
        ],
      },
      {
        title: '文章管理',
        url: '/dashboard/articles',
        icon: FileText,
        permission: 'articles.view',
        items: [
          {
            title: '文章列表',
            url: '/dashboard/articles',
            icon: FileText,
            permission: 'articles.view',
          },
          {
            title: '写文章',
            url: '/dashboard/articles/create',
            icon: Edit3,
            permission: 'articles.create',
          },
          {
            title: '文章编辑',
            url: '/dashboard/articles/edit',
            icon: FileEdit,
            permission: 'articles.edit',
          },
          {
            title: '文章归档',
            url: '/dashboard/articles/archive',
            icon: Archive,
            permission: 'articles.archive',
          },
        ],
      },
      {
        title: 'Playground',
        url: '#',
        icon: SquareTerminal,
        items: [
          {
            title: 'History',
            url: '#',
          },
          {
            title: 'Starred',
            url: '#',
          },
          {
            title: '第二级菜单',
            url: '#',
            items: [
              {
                title: '第三级菜单',
                url: '#',
              },
              {
                title: 'Starred',
                url: '#',
              },
            ],
          },
        ],
      },
      {
        title: 'Models',
        url: '#',
        icon: Bot,
        items: [
          {
            title: 'Genesis',
            url: '#',
          },
          {
            title: 'Explorer',
            url: '#',
          },
          {
            title: 'Quantum',
            url: '#',
          },
        ],
      },
      {
        title: 'Documentation',
        url: '#',
        icon: BookOpen,
        items: [
          {
            title: 'Introduction',
            url: '#',
          },
          {
            title: 'Get Started',
            url: '#',
          },
          {
            title: 'Tutorials',
            url: '#',
          },
          {
            title: 'Changelog',
            url: '#',
          },
        ],
      },
      {
        title: 'Settings',
        url: '#',
        icon: Settings2,
        items: [
          {
            title: 'General',
            url: '#',
          },
          {
            title: 'Team',
            url: '#',
          },
          {
            title: 'Billing',
            url: '#',
          },
          {
            title: 'Limits',
            url: '#',
          },
        ],
      },
    ],
  }),

  getters: {
    // 根据用户权限过滤菜单
    filteredMenuItems: (state) => {
      return (userPermissions: string[] = []) => {
        const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
          return items
            .filter((item) => {
              // 如果没有权限要求，或者用户有对应权限，则显示
              if (!item.permission || userPermissions.includes(item.permission)) {
                return true
              }
              // 如果有子菜单，检查子菜单是否有可访问的项
              if (item.items && item.items.length > 0) {
                const filteredSubItems = filterMenuItems(item.items)
                return filteredSubItems.length > 0
              }
              return false
            })
            .map((item) => ({
              ...item,
              items: item.items ? filterMenuItems(item.items) : undefined,
            }))
        }

        return filterMenuItems(state.menuItems)
      }
    },

    // 获取当前激活的菜单项
    activeMenuItem: (state) => {
      return (currentPath: string) => {
        const findActiveItem = (items: MenuItem[]): MenuItem | null => {
          for (const item of items) {
            if (item.url === currentPath) {
              return item
            }
            if (item.items) {
              const found = findActiveItem(item.items)
              if (found) return found
            }
          }
          return null
        }

        return findActiveItem(state.menuItems)
      }
    },
  },

  actions: {
    // 设置菜单项激活状态
    setActiveMenuItem(path: string) {
      const setActive = (items: MenuItem[]) => {
        items.forEach((item) => {
          item.isActive = item.url === path
          if (item.items) {
            setActive(item.items)
          }
        })
      }

      setActive(this.menuItems)
    },

    // 添加菜单项
    addMenuItem(menuItem: MenuItem, parentPath?: string) {
      if (!parentPath) {
        this.menuItems.push(menuItem)
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

        findParent(this.menuItems)
      }
    },

    // 移除菜单项
    removeMenuItem(path: string) {
      const removeItem = (items: MenuItem[]): MenuItem[] => {
        return items
          .filter((item) => item.url !== path)
          .map((item) => ({
            ...item,
            items: item.items ? removeItem(item.items) : undefined,
          }))
      }

      this.menuItems = removeItem(this.menuItems)
    },

    // 更新菜单项
    updateMenuItem(path: string, updates: Partial<MenuItem>) {
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

      updateItem(this.menuItems)
    },
  },
})