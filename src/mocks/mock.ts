import type { AxiosInstance } from 'axios'
import MockAdapter from 'axios-mock-adapter'

// 动态导入所有 mock 模块
const mockModules = import.meta.glob('./modules/*.ts', { eager: true })

export function setupMock(axios: AxiosInstance) {
  // 只在开发环境或明确启用 mock 时才启用
  if (!import.meta.env.VITE_USE_MOCK) {
    return
  }

  const mock = new MockAdapter(axios, { delayResponse: 300 })

  // 自动注册所有 mock 模块
  Object.values(mockModules).forEach((module: any) => {
    if (typeof module.default === 'function') {
      module.default(mock)
    }
  })

  console.log('🚀 Mock server is running')
}
