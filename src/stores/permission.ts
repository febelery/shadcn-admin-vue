import { defineStore } from 'pinia'

interface PermissionState {
  permissions: string[]
  roles: string[]
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    permissions: [
      'users.view',
      'users.create',
      'users.edit',
      'users.delete',
      'users.audit',
      'articles.view',
      'articles.create',
      'articles.edit',
      'articles.delete',
      'articles.archive',
    ],
    roles: ['admin', 'editor', 'user'],
  }),

  getters: {
    hasPermission: (state) => {
      return (permission: string) => {
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