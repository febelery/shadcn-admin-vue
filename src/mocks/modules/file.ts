import MockAdapter from 'axios-mock-adapter'

export default function setupFileMock(mock: MockAdapter) {
  // 模拟七牛云上传token获取
  mock.onGet('/qiniu/uptoken').reply((config) => {
    const params = config.params || {}
    const { name, modified, size, type } = params

    // 模拟验证文件参数
    if (!name || !size || !type) {
      return [400, { message: '缺少必要的文件参数' }]
    }

    // 模拟文件大小限制（100MB）
    if (size > 100 * 1024 * 1024) {
      return [400, { message: '文件大小超过限制' }]
    }

    // 模拟生成上传token
    const uptoken = `mock-uptoken-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    return [
      200,
      {
        uptoken,
        expires: Date.now() + 3600 * 1000, // 1小时后过期
      },
    ]
  })

  // 模拟文件上传到七牛云（这个通常是直接上传到七牛云的，这里只是模拟）
  mock.onPost(/https:\/\/up-z0\.qiniup\.com/).reply((config) => {
    // 模拟上传延迟
    return new Promise((resolve) => {
      setTimeout(
        () => {
          // 模拟上传成功响应
          const mockUrl = `https://cdn.example.com/uploads/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`

          resolve([
            200,
            {
              key: `uploads/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`,
              hash: `mock-hash-${Date.now()}`,
              path: mockUrl,
              url: mockUrl,
            },
          ])
        },
        1000 + Math.random() * 2000
      ) // 1-3秒的随机延迟
    })
  })

  // 模拟文件删除
  mock.onDelete(/\/files\/.*/).reply((config) => {
    const fileKey = config.url?.split('/files/')[1]

    if (!fileKey) {
      return [400, { message: '文件标识不能为空' }]
    }

    // 模拟删除成功
    return [200, { message: '文件删除成功' }]
  })

  // 模拟获取文件信息
  mock.onGet(/\/files\/.*\/info/).reply((config) => {
    const fileKey = config.url?.split('/files/')[1]?.replace('/info', '')

    if (!fileKey) {
      return [400, { message: '文件标识不能为空' }]
    }

    // 模拟文件信息
    return [
      200,
      {
        key: fileKey,
        size: Math.floor(Math.random() * 1024 * 1024), // 随机文件大小
        mimeType: 'image/jpeg',
        uploadTime: new Date().toISOString(),
        url: `https://cdn.example.com/${fileKey}`,
      },
    ]
  })
}
