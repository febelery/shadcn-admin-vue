import { HttpResponse, http } from 'msw'
import { buildMockApiUrl } from '@/lib/utils'

const articles = [
  {
    id: 1,
    title: 'Vue 3 组合式 API 深度解析',
    excerpt: '深入了解 Vue 3 组合式 API 的设计理念和最佳实践，包括响应式系统、生命周期钩子等核心概念。',
    content: '<h1>Vue 3 组合式 API 深度解析</h1><p>Vue 3 引入了组合式 API，这是一个全新的编程范式...</p>',
    author: '管理员',
    status: 'published',
    category: 'tech',
    tags: ['Vue', 'JavaScript', '前端'],
    publishedAt: '2024-01-10T10:00:00Z',
    views: 1250,
    cover: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
  },
  {
    id: 2,
    title: 'TypeScript 高级类型系统指南',
    excerpt: '掌握 TypeScript 的高级类型系统，包括泛型、条件类型、映射类型等，提升代码的类型安全性。',
    content: '<h1>TypeScript 高级类型系统指南</h1><p>TypeScript 的类型系统非常强大...</p>',
    author: '编辑',
    status: 'published',
    category: 'tech',
    tags: ['TypeScript', 'JavaScript', '类型系统'],
    publishedAt: '2024-01-09T14:30:00Z',
    views: 890,
    cover: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: '2024-01-09T13:00:00Z',
    updatedAt: '2024-01-09T14:30:00Z',
  },
  {
    id: 3,
    title: 'Vite 构建工具完全指南',
    excerpt: '从零开始学习 Vite 构建工具，了解其快速的开发体验和高效的构建性能。',
    content: '<h1>Vite 构建工具完全指南</h1><p>Vite 是一个现代化的前端构建工具...</p>',
    author: '管理员',
    status: 'draft',
    category: 'tools',
    tags: ['Vite', '构建工具', '前端'],
    publishedAt: null,
    views: 0,
    cover: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: '2024-01-08T16:00:00Z',
    updatedAt: '2024-01-08T16:00:00Z',
  },
  {
    id: 4,
    title: 'React vs Vue：2024年框架对比',
    excerpt: '全面对比 React 和 Vue 两大前端框架的优缺点，帮助开发者做出明智的技术选择。',
    content: '<h1>React vs Vue：2024年框架对比</h1><p>在前端开发领域，React 和 Vue 是两个最受欢迎的框架...</p>',
    author: '编辑',
    status: 'published',
    category: 'tutorial',
    tags: ['React', 'Vue', '框架对比'],
    publishedAt: '2024-01-07T11:15:00Z',
    views: 2100,
    cover: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: '2024-01-07T10:00:00Z',
    updatedAt: '2024-01-07T11:15:00Z',
  },
  {
    id: 5,
    title: '前端性能优化最佳实践',
    excerpt: '深入探讨前端性能优化的各种技术和策略，包括代码分割、懒加载、缓存策略等。',
    content: '<h1>前端性能优化最佳实践</h1><p>性能优化是前端开发中的重要话题...</p>',
    author: '管理员',
    status: 'published',
    category: 'tutorial',
    tags: ['性能优化', '前端', '最佳实践'],
    publishedAt: '2024-01-06T15:45:00Z',
    views: 1680,
    cover: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: '2024-01-06T14:00:00Z',
    updatedAt: '2024-01-06T15:45:00Z',
  },
  {
    id: 6,
    title: 'CSS Grid 布局完全指南',
    excerpt: '全面学习 CSS Grid 布局系统，掌握现代网页布局的强大工具。',
    content: '<h1>CSS Grid 布局完全指南</h1><p>CSS Grid 是一个二维布局系统...</p>',
    author: '编辑',
    status: 'archived',
    category: 'tutorial',
    tags: ['CSS', 'Grid', '布局'],
    publishedAt: '2024-01-05T09:30:00Z',
    views: 950,
    cover: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-05T09:30:00Z',
  },
]

export default [
  // 获取文章列表
  http.get(buildMockApiUrl('/articles'), async ({ request }) => {
    const url = new URL(request.url)
    const params: any = Object.fromEntries(url.searchParams.entries())

    const { page = 1, pageSize = 10, search, category, status, author } = params

    let filteredArticles = [...articles]

    // 搜索过滤
    if (search) {
      const searchLower = search.toLowerCase()
      filteredArticles = filteredArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchLower) ||
          article.excerpt.toLowerCase().includes(searchLower) ||
          article.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      )
    }

    // 分类过滤
    if (category && category !== 'all') {
      filteredArticles = filteredArticles.filter((article) => article.category === category)
    }

    // 状态过滤
    if (status && status !== 'all') {
      filteredArticles = filteredArticles.filter((article) => article.status === status)
    }

    // 作者过滤
    if (author && author !== 'all') {
      filteredArticles = filteredArticles.filter((article) => article.author === author)
    }

    // 按发布时间排序（最新的在前）
    filteredArticles.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt).getTime()
      const dateB = new Date(b.publishedAt || b.createdAt).getTime()
      return dateB - dateA
    })

    // 分页
    const total = filteredArticles.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const data = filteredArticles.slice(start, end)

    return HttpResponse.json(
      {
        data,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      },
      {
        status: 200,
      }
    )
  }),

  // 获取单篇文章
  http.get(buildMockApiUrl('/articles/:id'), async ({ params }) => {
    const { id } = params

    const article = articles.find((a) => a.id === parseInt(id as any))

    if (!article) {
      return HttpResponse.json({ message: '文章不存在' }, { status: 404 })
    }

    // 增加浏览次数
    article.views += 1

    return HttpResponse.json(article, { status: 200 })
  }),

  // 创建文章
  http.post(buildMockApiUrl('/articles'), async ({ request }) => {
    const articleData: any = await request.json()

    const newArticle = {
      id: Math.max(...articles.map((a) => a.id)) + 1,
      ...articleData,
      author: '管理员', // 模拟当前用户
      views: 0,
      publishedAt: articleData.status === 'published' ? new Date().toISOString() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    articles.push(newArticle)

    return HttpResponse.json(newArticle, { status: 201 })
  }),

  // 更新文章
  http.put(buildMockApiUrl('/articles/:id'), async ({ params, request }) => {
    const { id } = params
    const articleData: any = await request.json()
    const articleIndex = articles.findIndex((a) => a.id === parseInt(id as any))

    if (articleIndex === -1) {
      return HttpResponse.json({ message: '文章不存在' }, { status: 404 })
    }

    const currentArticle = articles[articleIndex]
    const wasPublished = currentArticle.status === 'published'
    const willBePublished = articleData.status === 'published'

    const updatedArticle = {
      ...currentArticle,
      ...articleData,
      publishedAt: willBePublished && !wasPublished ? new Date().toISOString() : currentArticle.publishedAt,
      updatedAt: new Date().toISOString(),
    }

    articles[articleIndex] = updatedArticle

    return HttpResponse.json(updatedArticle, { status: 200 })
  }),

  // 删除文章
  http.delete(buildMockApiUrl('/articles/:id'), ({ params }) => {
    const { id } = params
    const articleIndex = articles.findIndex((a) => a.id === parseInt(id as any))

    if (articleIndex === -1) {
      return HttpResponse.json({ message: '文章不存在' }, { status: 404 })
    }

    articles.splice(articleIndex, 1)

    return HttpResponse.json({ message: '文章删除成功' }, { status: 200 })
  }),

  // 批量删除文章
  http.delete(buildMockApiUrl('/articles/batch'), async ({ request }) => {
    const { ids }: any = await request.json()

    if (!Array.isArray(ids) || ids.length === 0) {
      return HttpResponse.json({ message: '请提供要删除的文章ID列表' }, { status: 400 })
    }

    // 注意：这里需要修改原始的 articles 数组
    // 如果 articles 是在外部定义的，需要确保能够修改它
    for (let i = articles.length - 1; i >= 0; i--) {
      if (ids.includes(articles[i].id)) {
        articles.splice(i, 1)
      }
    }

    return HttpResponse.json({ message: `成功删除 ${ids.length} 篇文章` }, { status: 200 })
  }),
]
