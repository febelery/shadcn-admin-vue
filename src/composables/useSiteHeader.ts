import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { generateSmartBreadcrumb } from '@/utils/breadcrumbGenerator'
import type { BreadcrumbItem, CustomAction } from '@/types/menu'

// 全局状态
const globalTitle = ref<string>('')
const globalBreadcrumb = ref<BreadcrumbItem[]>([])
const globalShowBackButton = ref<boolean>(false)
const globalShowBreadcrumb = ref<boolean>(true)
const globalCustomActions = ref<CustomAction[]>([])

export function useSiteHeader() {
  const route = useRoute()

  // 自动从路由生成标题和面包屑
  const autoTitle = computed(() => {
    const matched = route.matched
    const lastMatch = matched[matched.length - 1]
    return lastMatch?.meta?.title as string || ''
  })

  const autoBreadcrumb = computed(() => {
    return generateSmartBreadcrumb(route.matched, route.path)
  })

  // 最终的标题和面包屑（优先使用手动设置的）
  const title = computed(() => globalTitle.value || autoTitle.value)
  const breadcrumb = computed(() => 
    globalBreadcrumb.value.length > 0 ? globalBreadcrumb.value : autoBreadcrumb.value
  )

  // 监听路由变化，重置手动设置的状态
  watch(() => route.path, () => {
    // 路由变化时重置手动设置的状态，让自动生成生效
    globalTitle.value = ''
    globalBreadcrumb.value = []
    globalShowBackButton.value = false
    globalCustomActions.value = []
  })

  // 手动设置方法
  const setTitle = (newTitle: string) => {
    globalTitle.value = newTitle
  }

  const setBreadcrumb = (newBreadcrumb: BreadcrumbItem[]) => {
    globalBreadcrumb.value = newBreadcrumb
  }

  const replaceBreadcrumb = (newBreadcrumb: BreadcrumbItem[]) => {
    globalBreadcrumb.value = newBreadcrumb
  }

  const setShowBackButton = (show: boolean) => {
    globalShowBackButton.value = show
  }

  const setShowBreadcrumb = (show: boolean) => {
    globalShowBreadcrumb.value = show
  }

  const setCustomActions = (actions: CustomAction[]) => {
    globalCustomActions.value = actions
  }

  const addCustomAction = (action: CustomAction) => {
    globalCustomActions.value.push(action)
  }

  const clearCustomActions = () => {
    globalCustomActions.value = []
  }

  return {
    // 响应式状态
    title,
    breadcrumb,
    showBackButton: computed(() => globalShowBackButton.value),
    showBreadcrumb: computed(() => globalShowBreadcrumb.value),
    customActions: computed(() => globalCustomActions.value),

    // 设置方法
    setTitle,
    setBreadcrumb,
    replaceBreadcrumb,
    setShowBackButton,
    setShowBreadcrumb,
    setCustomActions,
    addCustomAction,
    clearCustomActions,
  }
}