import { defineStore } from 'pinia'
import { loginApi, verifyOtpApi, getCurrentUserApi } from '@/api/users'
import type { User } from '@/api/users'
import { getFingerprint } from '@/lib/utils'

const USER_STORAGE_KEY = 'mkt-user'

interface UserInfo {
  id: number
  name: string
  email: string
  role: string
  status: string
  avatar?: string
  permissions: string[]
}

interface StoredUser {
  token: string
  expiresAt: number
  userInfo: UserInfo
}

interface UserState {
  token: string | null
  expiresAt: number | null
  userInfo: UserInfo | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => {
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    let parsed: StoredUser | null = null

    try {
      parsed = raw ? JSON.parse(raw) : null
    } catch {
      parsed = null
    }

    return {
      token: parsed?.token ?? null,
      expiresAt: parsed?.expiresAt ?? null,
      userInfo: parsed?.userInfo ?? null,
    }
  },

  getters: {
    isLoggedIn: (state): boolean => {
      return !!state.token && !!state.expiresAt && Date.now() / 1000 < state.expiresAt
    },

    hasPermission: (state) => {
      return (permission: string | string[]) => {
        if (!state.userInfo?.permissions) return false
        
        if (Array.isArray(permission)) {
          return permission.some(p => state.userInfo!.permissions.includes(p))
        }
        return state.userInfo.permissions.includes(permission)
      }
    },

    hasAnyPermission: (state) => {
      return (permissions: string[]) => {
        if (!state.userInfo?.permissions) return false
        return permissions.some(permission => state.userInfo!.permissions.includes(permission))
      }
    },

    hasAllPermissions: (state) => {
      return (permissions: string[]) => {
        if (!state.userInfo?.permissions) return false
        return permissions.every(permission => state.userInfo!.permissions.includes(permission))
      }
    },
  },

  actions: {
    async login(values: Record<string, any>) {
      try {
        const fingerprint = await getFingerprint()
        const res = await loginApi({ ...values, fingerprint })

        if (res?.status === 202 || res.data?.need_otp) {
          return {
            needOtp: true,
            otpKey: res.data.otp_key,
          }
        }

        this.setSession(res.data)
        return { needOtp: false }
      } catch (error: any) {
        this.reset()
        throw error
      }
    },

    async verifyOtp(otpKey: string) {
      try {
        const res = await verifyOtpApi({ otp_key: otpKey })
        this.setSession(res.data)
      } catch (error) {
        this.reset()
        throw error
      }
    },

    async getUserInfo() {
      if (!this.isLoggedIn) {
        this.reset()
        return null
      }

      try {
        const res = await getCurrentUserApi()
        this.userInfo = {
          id: res.data.id,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
          status: res.data.status,
          avatar: res.data.avatar,
          permissions: res.data.permissions,
        }
        this.saveToStorage()
        return this.userInfo
      } catch (error) {
        this.reset()
        return null
      }
    },

    getToken(): string | null {
      if (!this.isLoggedIn) {
        this.reset()
        return null
      }
      return this.token
    },

    saveToStorage() {
      if (this.token && this.expiresAt && this.userInfo) {
        const data: StoredUser = {
          token: this.token,
          expiresAt: this.expiresAt,
          userInfo: this.userInfo,
        }
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data))
      }
    },

    setSession(data: any) {
      this.token = data.token
      this.expiresAt = data.expire_at
      this.userInfo = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        status: data.user.status,
        avatar: data.user.avatar,
        permissions: data.user.permissions,
      }
      this.saveToStorage()
    },

    reset() {
      this.token = null
      this.expiresAt = null
      this.userInfo = null
      localStorage.removeItem(USER_STORAGE_KEY)
    },

    logout() {
      this.reset()
    },
  },
})