import MockAdapter from 'axios-mock-adapter'

export default function setupSystemMock(mock: MockAdapter) {
  // 模拟系统设置数据
  let systemSettings = {
    siteName: 'Shadcn Vue Admin',
    siteDescription: '基于 Vue 3 和 Shadcn UI 构建的现代化管理系统',
    adminEmail: 'admin@example.com',
    timezone: 'Asia/Shanghai',
    language: 'zh-CN',
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    maxUploadSize: 10,
    sessionTimeout: 60,
    version: '1.0.0',
    buildTime: '2024-01-01T00:00:00Z',
  }

  // 获取系统设置
  mock.onGet('/system/settings').reply(() => {
    return [200, systemSettings]
  })

  // 更新系统设置
  mock.onPut('/system/settings').reply((config) => {
    const newSettings = JSON.parse(config.data)
    systemSettings = { ...systemSettings, ...newSettings }

    return [200, systemSettings]
  })

  // 获取系统信息
  mock.onGet('/system/info').reply(() => {
    return [
      200,
      {
        version: '1.0.0',
        buildTime: '2024-01-01T00:00:00Z',
        environment: 'development',
        nodeVersion: '18.17.0',
        vueVersion: '3.4.0',
        uptime: Math.floor(Math.random() * 86400), // 随机运行时间（秒）
        memoryUsage: {
          used: Math.floor(Math.random() * 512), // MB
          total: 1024, // MB
        },
        cpuUsage: Math.floor(Math.random() * 100), // 百分比
      },
    ]
  })

  // 获取系统日志
  mock.onGet('/system/logs').reply((config) => {
    const params = config.params || {}
    const { page = 1, pageSize = 50, level, startTime, endTime } = params

    // 模拟日志数据
    const logLevels = ['info', 'warn', 'error', 'debug']
    const logMessages = [
      '用户登录成功',
      '文章创建成功',
      '系统配置更新',
      '数据库连接异常',
      '文件上传失败',
      '缓存清理完成',
      '定时任务执行',
      '权限验证失败',
    ]

    let logs = Array.from({ length: 200 }, (_, index) => ({
      id: index + 1,
      level: logLevels[Math.floor(Math.random() * logLevels.length)],
      message: logMessages[Math.floor(Math.random() * logMessages.length)],
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'system',
      userId: Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : null,
    }))

    // 级别过滤
    if (level && level !== 'all') {
      logs = logs.filter((log) => log.level === level)
    }

    // 时间过滤
    if (startTime) {
      logs = logs.filter((log) => new Date(log.timestamp) >= new Date(startTime))
    }
    if (endTime) {
      logs = logs.filter((log) => new Date(log.timestamp) <= new Date(endTime))
    }

    // 按时间倒序排列
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // 分页
    const total = logs.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const data = logs.slice(start, end)

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

  // 清理系统日志
  mock.onDelete('/system/logs').reply((config) => {
    const { beforeDate } = JSON.parse(config.data || '{}')

    // 模拟清理日志
    const deletedCount = Math.floor(Math.random() * 100) + 1

    return [200, { message: `成功清理 ${deletedCount} 条日志记录` }]
  })

  // 系统健康检查
  mock.onGet('/system/health').reply(() => {
    const isHealthy = Math.random() > 0.1 // 90% 概率健康

    return [
      200,
      {
        status: isHealthy ? 'healthy' : 'unhealthy',
        checks: {
          database: Math.random() > 0.05,
          redis: Math.random() > 0.05,
          storage: Math.random() > 0.05,
          email: Math.random() > 0.1,
        },
        timestamp: new Date().toISOString(),
      },
    ]
  })

  // 系统备份
  mock.onPost('/system/backup').reply(() => {
    // 模拟备份过程
    return new Promise((resolve) => {
      setTimeout(() => {
        const backupId = `backup-${Date.now()}`
        resolve([
          200,
          {
            id: backupId,
            status: 'completed',
            size: Math.floor(Math.random() * 1024 * 1024 * 100), // 随机大小
            createdAt: new Date().toISOString(),
            downloadUrl: `/system/backup/${backupId}/download`,
          },
        ])
      }, 2000) // 2秒延迟模拟备份过程
    })
  })

  // 获取备份列表
  mock.onGet('/system/backups').reply(() => {
    const backups = Array.from({ length: 10 }, (_, index) => ({
      id: `backup-${Date.now() - index * 24 * 60 * 60 * 1000}`,
      status: 'completed',
      size: Math.floor(Math.random() * 1024 * 1024 * 100),
      createdAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
      downloadUrl: `/system/backup/backup-${Date.now() - index * 24 * 60 * 60 * 1000}/download`,
    }))

    return [200, backups]
  })
}
