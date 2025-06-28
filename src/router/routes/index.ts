import type { RouteRecordRaw } from 'vue-router'

// 动态导入菜单路由（modules 文件夹下的路由）
const menuRouteFiles = import.meta.glob('./modules/*.ts', { eager: true })

// 动态导入系统路由（system 文件夹下的路由）
const systemRouteFiles = import.meta.glob('./system/*.ts', { eager: true })

const menuRoutes: RouteRecordRaw[] = []
const systemRoutes: RouteRecordRaw[] = []

// 处理菜单路由
Object.keys(menuRouteFiles).forEach((key) => {
  const mod = (menuRouteFiles[key] as any).default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  menuRoutes.push(...modList)
})

// 处理系统路由
Object.keys(systemRouteFiles).forEach((key) => {
  const mod = (systemRouteFiles[key] as any).default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  systemRoutes.push(...modList)
})

// 导出所有路由，菜单路由在前
export default [...menuRoutes, ...systemRoutes]

// 单独导出菜单路由，供菜单生成器使用
export { menuRoutes }