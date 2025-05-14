import { defineStore } from 'pinia'
import { loginApi, verifyOtpApi } from '@/api/user'
import { getFingerprint } from '@/lib/utils'

const USER_STORAGE_KEY = 'mkt-user'

interface UserInfo {
  name: string
  nickname?: string
  avatar?: string
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

      if (Math.random() < 0.1) {
        // 留作扩展：远程拉取用户信息
      }

      return this.userInfo
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
        name: data.name,
        nickname: data.nickname,
        avatar: data.avatar,
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
