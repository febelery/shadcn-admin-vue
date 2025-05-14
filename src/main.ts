import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import '@/api/interceptor'
import '@/assets/main.css'
import router from '@/router'
import App from './App.vue'
import { setupGlobalZodMessages } from './lib/zod-messages'

// 设置全局 Zod 错误消息
setupGlobalZodMessages()

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin)

app.mount('#app')
