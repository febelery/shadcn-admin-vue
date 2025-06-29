import MockAdapter from 'axios-mock-adapter'

export default function setupUsersMock(mock: MockAdapter) {
  // 模拟用户数据
  let users = [
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

  // 获取用户列表
  mock.onGet('/users').reply((config) => {
    const params = config.params || {}
    const { page = 1, pageSize = 10, search, role, status } = params

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

    return [
      200,
      {
        data,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      },
    ]
  })

  // 获取单个用户
  mock.onGet(/\/users\/\d+/).reply((config) => {
    const id = parseInt(config.url?.split('/').pop() || '0')
    const user = users.find((u) => u.id === id)

    if (!user) {
      return [404, { message: '用户不存在' }]
    }

    return [200, user]
  })

  // 创建用户
  mock.onPost('/users').reply((config) => {
    const userData = JSON.parse(config.data)

    // 检查用户名是否已存在
    if (users.some((u) => u.username === userData.username)) {
      return [400, { message: '用户名已存在' }]
    }

    // 检查邮箱是否已存在
    if (users.some((u) => u.email === userData.email)) {
      return [400, { message: '邮箱已存在' }]
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

    return [201, newUser]
  })

  // 更新用户
  mock.onPut(/\/users\/\d+/).reply((config) => {
    const id = parseInt(config.url?.split('/').pop() || '0')
    const userData = JSON.parse(config.data)
    const userIndex = users.findIndex((u) => u.id === id)

    if (userIndex === -1) {
      return [404, { message: '用户不存在' }]
    }

    // 检查用户名是否已被其他用户使用
    if (userData.username && users.some((u) => u.id !== id && u.username === userData.username)) {
      return [400, { message: '用户名已存在' }]
    }

    // 检查邮箱是否已被其他用户使用
    if (userData.email && users.some((u) => u.id !== id && u.email === userData.email)) {
      return [400, { message: '邮箱已存在' }]
    }

    const updatedUser = {
      ...users[userIndex],
      ...userData,
      permissions: userData.role ? getPermissionsByRole(userData.role) : users[userIndex].permissions,
      updatedAt: new Date().toISOString(),
    }

    users[userIndex] = updatedUser

    return [200, updatedUser]
  })

  // 删除用户
  mock.onDelete(/\/users\/\d+/).reply((config) => {
    const id = parseInt(config.url?.split('/').pop() || '0')
    const userIndex = users.findIndex((u) => u.id === id)

    if (userIndex === -1) {
      return [404, { message: '用户不存在' }]
    }

    users.splice(userIndex, 1)

    return [200, { message: '用户删除成功' }]
  })

  // 批量删除用户
  mock.onDelete('/users/batch').reply((config) => {
    const { ids } = JSON.parse(config.data)

    if (!Array.isArray(ids) || ids.length === 0) {
      return [400, { message: '请提供要删除的用户ID列表' }]
    }

    users = users.filter((user) => !ids.includes(user.id))

    return [200, { message: `成功删除 ${ids.length} 个用户` }]
  })

  // 根据角色获取权限
  function getPermissionsByRole(role: string): string[] {
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
}
