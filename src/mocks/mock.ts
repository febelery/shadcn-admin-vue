import MockAdapter from 'axios-mock-adapter'
import type { AxiosInstance } from 'axios'

// Mock 数据
const mockUsers = [
  {
    id: 1,
    name: '超级管理员',
    username: 'admin',
    email: 'admin@example.com',
    password: 'asdfasdf',
    role: 'admin',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    permissions: [
      // 仪表板权限
      'dashboard.view',
      
      // 用户权限
      'users',
      'users.view',
      'users.create',
      'users.edit',
      'users.delete',
      'users.audit',
      'users.permissions',
      
      // 文章权限
      'articles',
      'articles.view',
      'articles.create',
      'articles.edit',
      'articles.delete',
      'articles.archive',
      'articles.archive.time',
      'articles.archive.topic',
      'articles.categories',
      'articles.tags',
      
      // 系统权限
      'system',
      'system.view',
      'system.settings',
      'system.database',
      'system.security',
      'system.notifications',
      'system.logs',
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    lastLoginAt: '2024-01-20T10:30:00Z',
  },
  {
    id: 2,
    name: '编辑用户',
    username: 'editor',
    email: 'editor@example.com',
    password: 'asdfasdf',
    role: 'editor',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    permissions: [
      // 用户权限（部分）
      'users',
      'users.view',
      'users.audit',
      
      // 文章权限（完整）
      'articles',
      'articles.view',
      'articles.create',
      'articles.edit',
      'articles.delete',
      'articles.archive',
      'articles.archive.time',
      'articles.archive.topic',
      'articles.categories',
      'articles.tags',
    ],
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
    lastLoginAt: '2024-01-19T14:20:00Z',
  },
  {
    id: 3,
    name: '普通用户',
    username: 'user',
    email: 'user@example.com',
    password: 'asdfasdf',
    role: 'user',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    permissions: [
      // 仅查看权限
      'articles',
      'articles.view',
    ],
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
    lastLoginAt: '2024-01-18T09:15:00Z',
  },
  {
    id: 4,
    name: '受限编辑',
    username: 'limited',
    email: 'limited@example.com',
    password: 'asdfasdf',
    role: 'editor',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    permissions: [
      // 仅文章查看和创建权限
      'articles',
      'articles.view',
      'articles.create',
    ],
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
    lastLoginAt: '2024-01-17T16:45:00Z',
  },
  {
    id: 5,
    name: '禁用用户',
    username: 'disabled',
    email: 'disabled@example.com',
    password: 'asdfasdf',
    role: 'user',
    status: 'inactive',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    permissions: [],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    lastLoginAt: '2024-01-16T11:30:00Z',
  },
]

const mockArticles = [
  {
    id: 1,
    title: 'Vue 3 组合式 API 最佳实践',
    excerpt: '深入探讨 Vue 3 组合式 API 的使用技巧和最佳实践，帮助开发者更好地构建现代化的 Vue 应用...',
    content: '<h1>Vue 3 组合式 API 最佳实践</h1><p>这是文章的详细内容...</p>',
    author: '超级管理员',
    status: 'published',
    category: 'tech',
    tags: ['Vue', 'JavaScript', '前端'],
    publishedAt: '2024-01-15T10:00:00Z',
    views: 1250,
    cover: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    title: 'TypeScript 进阶指南',
    excerpt: '从基础到高级，全面掌握 TypeScript 的类型系统、泛型、装饰器等高级特性...',
    content: '<h1>TypeScript 进阶指南</h1><p>这是文章的详细内容...</p>',
    author: '编辑用户',
    status: 'draft',
    category: 'tech',
    tags: ['TypeScript', 'JavaScript'],
    publishedAt: '2024-01-20T14:00:00Z',
    views: 890,
    cover: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
    createdAt: '2024-01-20T13:00:00Z',
    updatedAt: '2024-01-20T14:00:00Z',
  },
  {
    id: 3,
    title: '现代前端开发工具链',
    excerpt: '介绍现代前端开发中常用的工具链，包括构建工具、代码质量工具、测试工具等...',
    content: '<h1>现代前端开发工具链</h1><p>这是文章的详细内容...</p>',
    author: '编辑用户',
    status: 'published',
    category: 'tools',
    tags: ['工具', '前端', '开发'],
    publishedAt: '2024-02-01T16:00:00Z',
    views: 2100,
    cover: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
    createdAt: '2024-02-01T15:00:00Z',
    updatedAt: '2024-02-01T16:00:00Z',
  },
]

// 当前登录用户
let currentUser: any = null

export function setupMock(axios: AxiosInstance) {
  const mock = new MockAdapter(axios, { delayResponse: 500 })

  // 登录接口
  mock.onPost('/auth/login').reply((config) => {
    const { username, password } = JSON.parse(config.data)
    
    const user = mockUsers.find(u => u.username === username && u.password === password)
    
    if (!user) {
      // 账号密码错误返回 400 状态码
      return [400, { message: '用户名或密码错误' }]
    }

    if (user.status === 'inactive') {
      return [403, { message: '账户已被禁用，请联系管理员' }]
    }

    // 模拟需要 OTP 验证的情况（10% 概率）
    if (Math.random() < 0.1) {
      return [202, {
        need_otp: true,
        otp_key: `otp_${Date.now()}_${user.id}`,
        message: '需要二次验证'
      }]
    }

    currentUser = user
    const token = `token_${Date.now()}_${user.id}`
    const expireAt = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // 7天后过期

    return [200, {
      token,
      expire_at: expireAt,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
        permissions: user.permissions,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt,
      }
    }]
  })

  // OTP 验证接口
  mock.onPost('/auth/otp').reply((config) => {
    const { otp_key } = JSON.parse(config.data)
    
    // 简单验证 OTP key 格式
    if (!otp_key || !otp_key.startsWith('otp_')) {
      return [400, { message: 'OTP 验证失败' }]
    }

    // 从 OTP key 中提取用户 ID
    const userId = parseInt(otp_key.split('_')[2])
    const user = mockUsers.find(u => u.id === userId)
    
    if (!user) {
      return [400, { message: 'OTP 验证失败' }]
    }

    currentUser = user
    const token = `token_${Date.now()}_${user.id}`
    const expireAt = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60

    return [200, {
      token,
      expire_at: expireAt,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
        permissions: user.permissions,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt,
      }
    }]
  })

  // 获取当前用户信息
  mock.onGet('/auth/me').reply(() => {
    if (!currentUser) {
      return [401, { message: '未登录' }]
    }

    return [200, {
      id: currentUser.id,
      name: currentUser.name,
      username: currentUser.username,
      email: currentUser.email,
      role: currentUser.role,
      status: currentUser.status,
      avatar: currentUser.avatar,
      permissions: currentUser.permissions,
      createdAt: currentUser.createdAt,
      updatedAt: currentUser.updatedAt,
      lastLoginAt: currentUser.lastLoginAt,
    }]
  })

  // 用户列表接口
  mock.onGet('/users').reply((config) => {
    const { page = 1, pageSize = 10, search, role, status } = config.params || {}
    
    let filteredUsers = mockUsers.map(user => ({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
      permissions: user.permissions,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt,
    }))

    // 搜索过滤
    if (search) {
      filteredUsers = filteredUsers.filter(user => 
        user.name.includes(search) || user.email.includes(search) || user.username.includes(search)
      )
    }

    // 角色过滤
    if (role && role !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.role === role)
    }

    // 状态过滤
    if (status && status !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.status === status)
    }

    const total = filteredUsers.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const data = filteredUsers.slice(start, end)

    return [200, {
      data,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    }]
  })

  // 创建用户接口
  mock.onPost('/users').reply((config) => {
    const userData = JSON.parse(config.data)
    
    // 检查邮箱是否已存在
    if (mockUsers.find(u => u.email === userData.email)) {
      return [400, { message: '邮箱已存在' }]
    }

    // 检查用户名是否已存在
    if (mockUsers.find(u => u.username === userData.username)) {
      return [400, { message: '用户名已存在' }]
    }

    const newUser = {
      id: Math.max(...mockUsers.map(u => u.id)) + 1,
      ...userData,
      username: userData.username || userData.email.split('@')[0], // 如果没有用户名，使用邮箱前缀
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      permissions: getDefaultPermissions(userData.role),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockUsers.push(newUser)

    return [200, {
      id: newUser.id,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      avatar: newUser.avatar,
      permissions: newUser.permissions,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    }]
  })

  // 文章列表接口
  mock.onGet('/articles').reply((config) => {
    const { page = 1, pageSize = 10, search, category, status, author } = config.params || {}
    
    let filteredArticles = [...mockArticles]

    // 搜索过滤
    if (search) {
      filteredArticles = filteredArticles.filter(article => 
        article.title.includes(search) || article.excerpt.includes(search)
      )
    }

    // 分类过滤
    if (category && category !== 'all') {
      filteredArticles = filteredArticles.filter(article => article.category === category)
    }

    // 状态过滤
    if (status && status !== 'all') {
      filteredArticles = filteredArticles.filter(article => article.status === status)
    }

    // 作者过滤
    if (author) {
      filteredArticles = filteredArticles.filter(article => article.author === author)
    }

    const total = filteredArticles.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const data = filteredArticles.slice(start, end)

    return [200, {
      data,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    }]
  })

  // 创建文章接口
  mock.onPost('/articles').reply((config) => {
    const articleData = JSON.parse(config.data)
    
    const newArticle = {
      id: Math.max(...mockArticles.map(a => a.id)) + 1,
      ...articleData,
      author: currentUser?.name || '匿名用户',
      views: 0,
      cover: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      publishedAt: articleData.status === 'published' ? new Date().toISOString() : '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockArticles.push(newArticle)

    return [200, newArticle]
  })

  // 获取文章详情
  mock.onGet(/\/articles\/\d+/).reply((config) => {
    const id = parseInt(config.url!.split('/').pop()!)
    const article = mockArticles.find(a => a.id === id)
    
    if (!article) {
      return [404, { message: '文章不存在' }]
    }

    return [200, article]
  })

  // 删除用户
  mock.onDelete(/\/users\/\d+/).reply((config) => {
    const id = parseInt(config.url!.split('/').pop()!)
    const index = mockUsers.findIndex(u => u.id === id)
    
    if (index === -1) {
      return [404, { message: '用户不存在' }]
    }

    mockUsers.splice(index, 1)
    return [200, { message: '删除成功' }]
  })

  // 删除文章
  mock.onDelete(/\/articles\/\d+/).reply((config) => {
    const id = parseInt(config.url!.split('/').pop()!)
    const index = mockArticles.findIndex(a => a.id === id)
    
    if (index === -1) {
      return [404, { message: '文章不存在' }]
    }

    mockArticles.splice(index, 1)
    return [200, { message: '删除成功' }]
  })
}

// 根据角色获取默认权限
function getDefaultPermissions(role: string): string[] {
  switch (role) {
    case 'admin':
      return [
        'dashboard.view',
        'users', 'users.view', 'users.create', 'users.edit', 'users.delete', 'users.audit', 'users.permissions',
        'articles', 'articles.view', 'articles.create', 'articles.edit', 'articles.delete', 'articles.archive', 'articles.archive.time', 'articles.archive.topic', 'articles.categories', 'articles.tags',
        'system', 'system.view', 'system.settings', 'system.database', 'system.security', 'system.notifications', 'system.logs',
      ]
    case 'editor':
      return [
        'users', 'users.view', 'users.audit',
        'articles', 'articles.view', 'articles.create', 'articles.edit', 'articles.delete', 'articles.archive', 'articles.archive.time', 'articles.archive.topic', 'articles.categories', 'articles.tags',
      ]
    case 'user':
      return [
        'articles', 'articles.view',
      ]
    default:
      return []
  }
}