import { Archive, BookOpen, Clock, Edit3, FileText, FolderOpen, Newspaper, Tags } from 'lucide-vue-next'
import type { RouteRecordRaw } from 'vue-router'

const articles: RouteRecordRaw = {
  path: '/articles',
  component: () => import('@/layout/app/AppSidebar.vue'),
  redirect: '/articles/list', // 直接重定向到默认子路由
  meta: {
    title: '文章',
    icon: FileText,
    permission: 'articles',
    order: 3,
    group: 'content',
    isMenuRoot: true, // 明确标记为菜单根节点
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
        order: 1,
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
        order: 2,
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
        order: 3,
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
        order: 4,
      },
    },
    {
      path: 'archive',
      name: 'articles-archive',
      redirect: '/articles/archive/time', // 为有子路由的项目添加重定向
      meta: {
        title: '文章归档',
        icon: Archive,
        permission: 'articles.archive',
        order: 5,
      },
      children: [
        {
          path: 'time',
          name: 'articles-archive-time',
          component: () => import('@/views/coming-soon/index.vue'),
          meta: {
            title: '时间归档',
            icon: Clock,
            permission: 'articles.archive.time',
            order: 1,
          },
        },
        {
          path: 'topic',
          name: 'articles-archive-topic',
          component: () => import('@/views/coming-soon/index.vue'),
          meta: {
            title: '主题归档',
            icon: BookOpen,
            permission: 'articles.archive.topic',
            order: 2,
          },
        },
      ],
    },
  ],
}

export default articles
