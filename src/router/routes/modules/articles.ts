import type { RouteRecordRaw } from 'vue-router'

const articles: RouteRecordRaw = {
  path: '/dashboard/articles',
  component: () => import('@/layout/app/AppSidebar.vue'),
  children: [
    {
      path: '',
      name: 'articles',
      component: () => import('@/views/articles/index.vue'),
      meta: {
        title: '文章列表',
        permission: 'articles.view',
      },
    },
    {
      path: 'create',
      name: 'articles-create',
      component: () => import('@/views/articles/create.vue'),
      meta: {
        title: '写文章',
        permission: 'articles.create',
      },
    },
  ],
}

export default articles