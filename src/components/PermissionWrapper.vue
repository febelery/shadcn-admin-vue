<template>
  <div v-if="hasAccess" :class="wrapperClass">
    <slot />
  </div>
  <div v-else-if="showFallback" :class="fallbackClass">
    <slot name="fallback">
      <div class="text-muted-foreground flex items-center justify-center p-4 text-sm">
        <Shield class="mr-2 h-4 w-4" />
        {{ fallbackText }}
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { Shield } from 'lucide-vue-next'
import { computed } from 'vue'
import { usePermission } from '@/composables/usePermission'

interface Props {
  /** 需要的权限 */
  permission?: string | string[]
  /** 权限检查模式：'any' 任一权限，'all' 所有权限 */
  mode?: 'any' | 'all'
  /** 是否显示无权限时的后备内容 */
  showFallback?: boolean
  /** 无权限时的提示文本 */
  fallbackText?: string
  /** 包装器的 CSS 类 */
  wrapperClass?: string
  /** 后备内容的 CSS 类 */
  fallbackClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'any',
  showFallback: false,
  fallbackText: '您没有权限访问此内容',
  wrapperClass: '',
  fallbackClass: 'rounded-lg border border-dashed',
})

const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission()

const hasAccess = computed(() => {
  if (!props.permission) return true

  const permissions = Array.isArray(props.permission) ? props.permission : [props.permission]

  if (props.mode === 'all') {
    return hasAllPermissions(permissions).value
  } else {
    return hasAnyPermission(permissions).value
  }
})
</script>