import type { AxiosInstance } from 'axios'
import MockAdapter from 'axios-mock-adapter'

export const setupMock = (axios: AxiosInstance) => {
  const mock = new MockAdapter(axios, { delayResponse: 200, onNoMatch: 'passthrough' })

  mock.onPost(/\/auth\/admin$/).reply((config) => {
    const { username, password } = JSON.parse(config.data)

    if (username !== 'admin' || password !== 'asdfasdf') {
      return [400, { status: 400, message: '用户名或密码错误' }]
    }

    if (Math.random() < 0.9) {
      // 202 Accepted 表示请求本身没有问题，但结果“正在进行中”，非常适合“需要额外操作”这种中间状态
      return [202, { status: 202, message: '需要进行 OTP 验证', need_otp: true, otp_key: '1234567890' }]
    }

    return [
      200,
      {
        avatar: 'https://wximg.chuanbaoguancha.cn/FiTobW1ALPNQB8NfnK_bGCx-onth',
        expire_at: 1747812816,
        name: 'Admin用户',
        nickname: 'Admin用户',
        token: 'eyJWHU',
      },
    ]
  })

  mock.onPost(/\/auth\/admin\/otp$/).reply((): any => {
    if (Math.random() < 0.6) {
      return [400, { status: 400, message: '二次验证失败' }]
    }

    return [
      200,
      {
        avatar: 'https://wximg.chuanbaoguancha.cn/FiTobW1ALPNQB8NfnK_bGCx-onth',
        expire_at: 1747812816,
        name: 'Admin用户',
        nickname: 'Admin用户',
        token: 'eyJWHU',
      },
    ]
  })
}
