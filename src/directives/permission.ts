import type { Directive, DirectiveBinding } from 'vue'
import { usePermissionStore } from '@/stores/permission'

interface PermissionBinding {
  value: string | string[]
  arg?: 'any' | 'all' // 默认为 'any'
  modifiers?: {
    hide?: boolean // 是否隐藏元素，默认为移除元素
    disable?: boolean // 是否禁用元素
  }
}

/**
 * 权限指令
 * 
 * 用法示例：
 * v-permission="'users.create'" - 需要 users.create 权限
 * v-permission="['users.create', 'users.edit']" - 需要任一权限（默认）
 * v-permission:all="['users.create', 'users.edit']" - 需要所有权限
 * v-permission.hide="'users.create'" - 无权限时隐藏元素
 * v-permission.disable="'users.create'" - 无权限时禁用元素
 */
export const vPermission: Directive<HTMLElement, string | string[]> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    checkPermission(el, binding)
  },
  
  updated(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    checkPermission(el, binding)
  }
}

function checkPermission(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
  const { value, arg, modifiers } = binding as PermissionBinding
  
  if (!value) {
    console.warn('v-permission 指令需要提供权限值')
    return
  }

  const permissionStore = usePermissionStore()
  const permissions = Array.isArray(value) ? value : [value]
  
  let hasPermission = false
  
  // 根据参数决定权限检查方式
  if (arg === 'all') {
    // 需要所有权限
    hasPermission = permissionStore.hasAllPermissions(permissions)
  } else {
    // 默认：需要任一权限
    hasPermission = permissionStore.hasAnyPermission(permissions)
  }
  
  // 根据修饰符决定处理方式
  if (!hasPermission) {
    if (modifiers?.disable) {
      // 禁用元素
      el.setAttribute('disabled', 'true')
      el.style.pointerEvents = 'none'
      el.style.opacity = '0.5'
      el.style.cursor = 'not-allowed'
    } else if (modifiers?.hide) {
      // 隐藏元素
      el.style.display = 'none'
    } else {
      // 默认：移除元素
      el.remove()
    }
  } else {
    // 有权限时恢复元素状态
    if (modifiers?.disable) {
      el.removeAttribute('disabled')
      el.style.pointerEvents = ''
      el.style.opacity = ''
      el.style.cursor = ''
    } else if (modifiers?.hide) {
      el.style.display = ''
    }
  }
}

export default vPermission