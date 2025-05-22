import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'

interface BreadcrumbItem {
  title: string
  href?: string
}

interface SiteHeaderState {
  title: string
  breadcrumb: BreadcrumbItem[]
}

export const useSiteHeader = defineStore('siteHeader', {
  state: (): SiteHeaderState => ({
    title: '',
    breadcrumb: [],
  }),

  actions: {
    setTitle(title: string) {
      this.title = title
    },

    pushBreadcrumb(item: BreadcrumbItem) {
      this.breadcrumb.push(item)
    },

    replaceBreadcrumb(items: BreadcrumbItem[]) {
      this.breadcrumb = items
    },

    popBreadcrumb() {
      this.breadcrumb.pop()
    },

    clearBreadcrumb() {
      this.breadcrumb = []
    },

    // 根据路由生成面包屑
    generateBreadcrumbFromRoute() {
      const route = useRoute()
      const breadcrumb: BreadcrumbItem[] = []

      // 从路由路径生成面包屑
      const pathSegments = route.path.split('/').filter(Boolean)
      let currentPath = ''

      pathSegments.forEach((segment) => {
        currentPath += `/${segment}`
        const findRoute = route.matched.find((r) => r.path === currentPath)

        if (findRoute) {
          breadcrumb.push({
            title: (findRoute.meta.title as string) || segment,
            href: currentPath,
          })
        }
      })

      this.breadcrumb = breadcrumb
    },
  },
})
