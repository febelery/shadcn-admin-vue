import type { RouteRecordRaw } from 'vue-router'
import { FileText, Edit3, Archive, Tags, FolderOpen, Newspaper } from 'lucide-vue-next'

const articles: RouteRecordRaw = {
  path: '/articles',
  component: () => import('@/layout/app/AppSidebar.vue'),
  redirect: '/articles/list', // 重定向到默认子路由
  meta: {
    title: '文章',
    icon: FileText,
    permission: 'articles',
    order: 3,
    group: 'content',
  },
  children: [
    {
      path: 'list',
      name: 'articles-list',
      component: () => import('@/views/articles/index.vue'),
      meta: {
        title: '文章列表',
        icon: Newspaper,
        permission: 'articles.view',
        isDefault: true, // 标记为默认路由
      },
    },
    {
      path: 'create',
      name: 'articles-create',
      component: () => import('@/views/articles/create.vue'),
      meta: {
        title: '写文章',
        icon: Edit3,
        permission: 'articles.create',
        order: 1,
      },
    },
    {
      path: 'categories',
      name: 'articles-categories',
      component: () => import('@/views/coming-soon/index.vue'),
      meta: {
        title: '分类管理',
        icon: FolderOpen,
        permission: 'articles.categories',
        order: 2,
      },
    },
    {
      path: 'tags',
      name: 'articles-tags',
      component: () => import('@/views/coming-soon/index.vue'),
      meta: {
        title: '标签管理',
        icon: Tags,
        permission: 'articles.tags',
        order: 3,
      },
    },
    {
      path: 'archive',
      name: 'articles-archive',
      component: () => import('@/views/coming-soon/index.vue'),
      meta: {
        title: '文章归档',
        icon: Archive,
        permission: 'articles.archive',
        order: 4,
      },
    },
  ],
}

export default articles