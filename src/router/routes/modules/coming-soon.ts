import type { RouteRecordRaw } from 'vue-router'

const comingSoon: RouteRecordRaw = {
  path: '/coming-soon',
  name: 'coming-soon',
  component: () => import('@/views/coming-soon/index.vue'),
  meta: {
    title: 'Coming Soon',
    hideInMenu: true,
  },
}

export default comingSoon