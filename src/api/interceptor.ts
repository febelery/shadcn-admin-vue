import axios from 'axios'
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { useUserStore } from '@/stores/user'

export interface ErrorResponse<T = unknown> {
  status: number
  message: string
  code: number
  data?: T
}

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
}

// 仅在开发环境下使用模拟数据
if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK) {
  const { worker } = await import('@/mocks/browser')
  await worker.start({
    onUnhandledRequest: 'bypass',
  })
}

axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useUserStore().getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      config.headers.set('Content-Type', 'application/json')
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response: AxiosResponse): Promise<AxiosResponse> => {
    const { data } = response
    if (data?.status > 299 || data?.code > 299) {
      return Promise.reject(data)
    }

    return Promise.resolve(response)
  },
  (error: AxiosError) => {
    const status = error?.response?.status || error?.status || 500

    if (status === 401) {
      useUserStore().reset()

      // 获取当前路径，避免redirect参数累加
      const currentPath = window.location.pathname + window.location.search
      const cleanPath = currentPath.split('?')[0] // 移除现有的查询参数

      // 只有在不是登录页面时才添加redirect参数
      if (!cleanPath.includes('/login')) {
        const redirect = encodeURIComponent(cleanPath)
        window.location.href = `/login?redirect=${redirect}`
      } else {
        window.location.href = '/login'
      }

      const errData = error.response?.data as ErrorResponse
      return Promise.reject(new Error(errData?.message || '未授权，请重新登录'))
    }

    if (!error.response || status >= 500) {
      window.location.href = '/500'
    }

    return Promise.reject(error?.response || error)
  }
)
