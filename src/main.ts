import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import './api/interceptor'
import './assets/main.css'
import { setupDirectives } from './directives'
// 导入 Zod 文件上传扩展
import './lib/zod-file-extensions'
import { setupGlobalZodMessages } from './lib/zod-messages'
import router from './router'

const app = createApp(App)

// 设置全局 Zod 错误消息
setupGlobalZodMessages()

// 创建 Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
})

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin, { queryClient })

// 注册全局指令
setupDirectives(app)

app.mount('#app')