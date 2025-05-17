import type { RouteRecordRaw } from 'vue-router'

const dynamicRouteFiles = import.meta.glob('./modules/*.ts', { eager: true })

const dynamicRoutes: RouteRecordRaw[] = []

Object.keys(dynamicRouteFiles).forEach((key) => {
  const mod = (dynamicRouteFiles[key] as any).default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  dynamicRoutes.push(...modList)
})

export default [...dynamicRoutes]
