import { defineStore } from 'pinia'

interface PermissionState {
  permissions: string[]
  roles: string[]
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    permissions: [
      // 用户权限
      'users',
      'users.view',
      'users.create',
      'users.edit',
      'users.delete',
      'users.audit',
      'users.permissions',
      
      // 文章权限
      'articles',
      'articles.view',
      'articles.create',
      'articles.edit',
      'articles.delete',
      'articles.archive',
      'articles.categories',
      'articles.tags',
      
      // 系统权限
      'system',
      'system.view',
      'system.settings',
      'system.database',
      'system.security',
      'system.notifications',
      'system.logs',
    ],
    roles: ['admin', 'editor', 'user'],
  }),

  getters: {
    hasPermission: (state) => {
      return (permission: string | string[]) => {
        if (Array.isArray(permission)) {
          return permission.some(p => state.permissions.includes(p))
        }
        return state.permissions.includes(permission)
      }
    },

    hasRole: (state) => {
      return (role: string) => {
        return state.roles.includes(role)
      }
    },

    hasAnyPermission: (state) => {
      return (permissions: string[]) => {
        return permissions.some((permission) => state.permissions.includes(permission))
      }
    },

    hasAllPermissions: (state) => {
      return (permissions: string[]) => {
        return permissions.every((permission) => state.permissions.includes(permission))
      }
    },
  },

  actions: {
    setPermissions(permissions: string[]) {
      this.permissions = permissions
    },

    setRoles(roles: string[]) {
      this.roles = roles
    },

    addPermission(permission: string) {
      if (!this.permissions.includes(permission)) {
        this.permissions.push(permission)
      }
    },

    removePermission(permission: string) {
      const index = this.permissions.indexOf(permission)
      if (index > -1) {
        this.permissions.splice(index, 1)
      }
    },

    addRole(role: string) {
      if (!this.roles.includes(role)) {
        this.roles.push(role)
      }
    },

    removeRole(role: string) {
      const index = this.roles.indexOf(role)
      if (index > -1) {
        this.roles.splice(index, 1)
      }
    },

    reset() {
      this.permissions = []
      this.roles = []
    },
  },
})