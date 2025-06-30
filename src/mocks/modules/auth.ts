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
]

export default [
  http.post(buildMockApiUrl('/auth/login'), async ({ request }) => {
    const { username, password } = (await request.json()) as any
    const user = users.find((u) => u.username === username)

    if (!user || password !== 'asdfasdf') {
      return HttpResponse.json(
        {
          status: 400,
          message: '用户名或密码错误',
        },
        {
          status: 400,
        }
      )
    }

    // 模拟需要OTP验证的情况（管理员账户）
    if (user.role === 'admin' && Math.random() > 0.7) {
      return HttpResponse.json(
        {
          need_otp: true,
          otp_key: 'mock-otp-key-' + Date.now(),
          message: '需要二次验证',
        },
        {
          status: 202,
        }
      )
    }

    const token = `mock-token-${user.id}-${Date.now()}`
    const expireAt = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // 7天后过期

    return HttpResponse.json(
      {
        token,
        expire_at: expireAt,
        user,
      },
      {
        status: 200,
      }
    )
  }),

  http.post(buildMockApiUrl('/auth/otp'), async ({ request }) => {
    const { otp_key } = (await request.json()) as any
    if (!otp_key || !otp_key.startsWith('mock-otp-key-')) {
      return HttpResponse.json(
        {
          message: 'OTP密钥无效',
        },
        {
          status: 400,
        }
      )
    }

    const user = users[0] // 假设是管理员
    const token = `mock-token-${user.id}-${Date.now()}`
    const expireAt = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60

    return HttpResponse.json(
      {
        token,
        expire_at: expireAt,
        user,
      },
      {
        status: 200,
      }
    )
  }),

  http.get(buildMockApiUrl('/auth/me'), async ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer mock-token-')) {
      return HttpResponse.json(
        {
          message: '未授权',
        },
        {
          status: 401,
        }
      )
    }

    // 从token中提取用户ID
    const tokenParts = authHeader.split('-')
    const userId = parseInt(tokenParts[2])
    const user = users.find((u) => u.id === userId)

    if (!user) {
      return HttpResponse.json(
        {
          message: '未授权',
        },
        {
          status: 401,
        }
      )
    }

    return HttpResponse.json(
      {
        user,
      },
      {
        status: 200,
      }
    )
  }),
]
