import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const usePermissionStore = defineStore('permission', {
  getters: {
    permissions: () => {
      const userStore = useUserStore()
      return userStore.userInfo?.permissions || []
    },

    hasPermission: () => {
      const userStore = useUserStore()
      return userStore.hasPermission
    },

    hasAnyPermission: () => {
      const userStore = useUserStore()
      return userStore.hasAnyPermission
    },

    hasAllPermissions: () => {
      const userStore = useUserStore()
      return userStore.hasAllPermissions
    },
  },
})