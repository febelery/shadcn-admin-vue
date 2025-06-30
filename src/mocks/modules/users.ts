import { HttpResponse, http } from 'msw'
import { buildMockApiUrl } from '@/lib/utils'

const users = [
  {
    id: 1,
    name: '管理员',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    permissions: [
      'dashboard.view',
      'users.view',
      'users.create',
      'users.edit',
      'users.delete',
      'articles.view',
      'articles.create',
      'articles.edit',
      'articles.delete',
      'system.view',
      'system.settings',
      'system.database',
      'system.security',
      'system.notifications',
      'system.logs',
      'system.permission',
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    lastLoginAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    name: '编辑',
    username: 'editor',
    email: 'editor@example.com',
    role: 'editor',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    permissions: ['dashboard.view', 'users.view', 'articles.view', 'articles.create', 'articles.edit'],
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    lastLoginAt: '2024-01-14T09:15:00Z',
  },
  {
    id: 3,
    name: '普通用户',
    username: 'user',
    email: 'user@example.com',
    role: 'user',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    permissions: ['dashboard.view', 'articles.view'],
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
    lastLoginAt: '2024-01-13T14:20:00Z',
  },
  {
    id: 4,
    name: '张三',
    username: 'zhangsan',
    email: 'zhangsan@example.com',
    role: 'user',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    permissions: ['dashboard.view', 'articles.view'],
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
    lastLoginAt: '2024-01-12T16:45:00Z',
  },
  {
    id: 5,
    name: '李四',
    username: 'lisi',
    email: 'lisi@example.com',
    role: 'editor',
    status: 'inactive',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    permissions: ['dashboard.view', 'users.view', 'articles.view', 'articles.create', 'articles.edit'],
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
    lastLoginAt: null,
  },
]

// 根据角色获取权限
const getPermissionsByRole = (role: string): string[] => {
  switch (role) {
    case 'admin':
      return [
        'dashboard.view',
        'users.view',
        'users.create',
        'users.edit',
        'users.delete',
        'articles.view',
        'articles.create',
        'articles.edit',
        'articles.delete',
        'system.view',
        'system.settings',
        'system.database',
        'system.security',
        'system.notifications',
        'system.logs',
        'system.permission',
      ]
    case 'editor':
      return ['dashboard.view', 'users.view', 'articles.view', 'articles.create', 'articles.edit']
    case 'user':
    default:
      return ['dashboard.view', 'articles.view']
  }
}

export default [
  // 获取用户列表
  http.get(buildMockApiUrl('/users'), ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10')
    const search = url.searchParams.get('search')
    const role = url.searchParams.get('role')
    const status = url.searchParams.get('status')

    let filteredUsers = [...users]

    // 搜索过滤
    if (search) {
      const searchLower = search.toLowerCase()
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.username.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
      )
    }

    // 角色过滤
    if (role && role !== 'all') {
      filteredUsers = filteredUsers.filter((user) => user.role === role)
    }

    // 状态过滤
    if (status && status !== 'all') {
      filteredUsers = filteredUsers.filter((user) => user.status === status)
    }

    // 分页
    const total = filteredUsers.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const data = filteredUsers.slice(start, end)

    return HttpResponse.json(
      {
        data,
        total,
        page,
        pageSize,
      },
      { status: 200 }
    )
  }),

  // 获取单个用户
  http.get(buildMockApiUrl('/users/:id'), ({ params }) => {
    const { id } = params
    const user = users.find((u) => u.id === parseInt(id as any))

    if (!user) {
      return HttpResponse.json({ message: '用户不存在' }, { status: 404 })
    }

    return HttpResponse.json(user, { status: 200 })
  }),

  // 创建用户
  http.post(buildMockApiUrl('/users'), async ({ request }) => {
    const userData: any = await request.json()

    // 检查用户名是否已存在
    if (users.some((u) => u.username === userData.username)) {
      return HttpResponse.json({ message: '用户名已存在' }, { status: 400 })
    }

    // 检查邮箱是否已存在
    if (users.some((u) => u.email === userData.email)) {
      return HttpResponse.json({ message: '邮箱已存在' }, { status: 400 })
    }

    const newUser = {
      id: Math.max(...users.map((u) => u.id)) + 1,
      ...userData,
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      permissions: getPermissionsByRole(userData.role),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: null,
    }

    users.push(newUser)

    return HttpResponse.json(newUser, { status: 201 })
  }),

  // 更新用户
  http.put(buildMockApiUrl('/users/:id'), async ({ params, request }) => {
    const { id } = params
    const userData: any = await request.json()
    const userIndex = users.findIndex((u) => u.id === parseInt(id as any))

    if (userIndex === -1) {
      return HttpResponse.json({ message: '用户不存在' }, { status: 404 })
    }

    // 检查用户名是否已被其他用户使用
    if (userData.username && users.some((u) => u.id !== parseInt(id as any) && u.username === userData.username)) {
      return HttpResponse.json({ message: '用户名已存在' }, { status: 400 })
    }

    // 检查邮箱是否已被其他用户使用
    if (userData.email && users.some((u) => u.id !== parseInt(id as any) && u.email === userData.email)) {
      return HttpResponse.json({ message: '邮箱已存在' }, { status: 400 })
    }

    const updatedUser = {
      ...users[userIndex],
      ...userData,
      permissions: userData.role ? getPermissionsByRole(userData.role) : users[userIndex].permissions,
      updatedAt: new Date().toISOString(),
    }

    users[userIndex] = updatedUser

    return HttpResponse.json(updatedUser, { status: 200 })
  }),

  // 删除用户
  http.delete(buildMockApiUrl('/users/:id'), ({ params }) => {
    const { id } = params
    const userIndex = users.findIndex((u) => u.id === parseInt(id as any))

    if (userIndex === -1) {
      return HttpResponse.json({ message: '用户不存在' }, { status: 404 })
    }

    users.splice(userIndex, 1)

    return HttpResponse.json({ message: '用户删除成功' }, { status: 200 })
  }),

  // 批量删除用户
  http.delete(buildMockApiUrl('/users/batch'), async ({ request }) => {
    const { ids }: any = await request.json()

    if (!Array.isArray(ids) || ids.length === 0) {
      return HttpResponse.json({ message: '请提供要删除的用户ID列表' }, { status: 400 })
    }

    // 使用倒序遍历安全删除
    for (let i = users.length - 1; i >= 0; i--) {
      if (ids.includes(users[i].id)) {
        users.splice(i, 1)
      }
    }

    return HttpResponse.json({ message: `成功删除 ${ids.length} 个用户` }, { status: 200 })
  }),
]
