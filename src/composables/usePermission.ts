import { computed } from 'vue'
import { usePermissionStore } from '@/stores/permission'

/**
 * 权限组合式函数
 * 提供在组件中使用权限的便捷方法
 */
export function usePermission() {
  const permissionStore = usePermissionStore()

  /**
   * 检查是否有指定权限（任一）
   */
  const hasPermission = (permission: string | string[]) => {
    return computed(() => permissionStore.hasPermission(permission))
  }

  /**
   * 检查是否有任一权限
   */
  const hasAnyPermission = (permissions: string[]) => {
    return computed(() => permissionStore.hasAnyPermission(permissions))
  }

  /**
   * 检查是否有所有权限
   */
  const hasAllPermissions = (permissions: string[]) => {
    return computed(() => permissionStore.hasAllPermissions(permissions))
  }

  /**
   * 获取当前用户的所有权限
   */
  const permissions = computed(() => permissionStore.permissions)

  /**
   * 权限检查函数（非响应式）
   */
  const checkPermission = (permission: string | string[]) => {
    return permissionStore.hasPermission(permission)
  }

  /**
   * 权限检查函数 - 任一权限（非响应式）
   */
  const checkAnyPermission = (permissions: string[]) => {
    return permissionStore.hasAnyPermission(permissions)
  }

  /**
   * 权限检查函数 - 所有权限（非响应式）
   */
  const checkAllPermissions = (permissions: string[]) => {
    return permissionStore.hasAllPermissions(permissions)
  }

  return {
    // 响应式权限检查
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions,
    
    // 非响应式权限检查
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
  }
}