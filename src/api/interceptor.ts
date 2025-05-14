import axios from 'axios'
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { setupMock } from '@/mocks/mock'
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

if (import.meta.env.VITE_USE_MOCK) {
  setupMock(axios)
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
      const redirect = encodeURIComponent(location.pathname + location.search)
      const errData = error.response?.data as ErrorResponse
      window.location.href = `/login?redirect=${redirect}`
      return Promise.reject(new Error(errData?.message || '未授权，请重新登录'))
    }

    if (!error.response || status >= 500) {
      window.location.href = '/500'
    }

    return Promise.reject(error?.response || error)
  }
)
