import type { LucideIcon } from 'lucide-vue-next'
import type { Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

// 菜单项接口
export interface MenuItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: MenuItem[]
  permission?: string | string[]
  order?: number
  group?: string
  badge?: string | number
  disabled?: boolean
  external?: boolean
  target?: string
}

// 面包屑项接口
export interface BreadcrumbItem {
  title: string
  href?: string
  icon?: LucideIcon
}

// 自定义操作按钮接口
export interface CustomAction {
  component: Component | string
  props?: Record<string, any>
  onClick?: () => void
}

// @ts-expect-error 扩展的路由记录接口
export interface ExtendedRouteRecordRaw extends RouteRecordRaw {
  meta?: RouteMeta
}

// 路由元信息接口
export interface RouteMeta {
  title?: string
  icon?: LucideIcon
  permission?: string | string[]
  order?: number
  group?: string
  badge?: string | number
  disabled?: boolean
  external?: boolean
  target?: string
  hideInMenu?: boolean
  hideBreadcrumb?: boolean
  requiresAuth?: boolean // 是否需要认证，支持父子路由继承
  roles?: string[]
}
