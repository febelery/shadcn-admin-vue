import type { App } from 'vue'
import { vPermission } from './permission'

/**
 * 注册全局指令
 */
export function setupDirectives(app: App) {
  // 注册权限指令
  app.directive('permission', vPermission)
}

export { vPermission }