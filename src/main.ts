import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import '@/api/interceptor'
import '@/assets/main.css'
import router from '@/router'
import App from './App.vue'
import { setupGlobalZodMessages } from './lib/zod-messages'

// 如果选择插件方案，取消注释以下代码
// import { siteHeaderPlugin } from '@/plugins/siteHeader'

// 如果选择指令方案，取消注释以下代码
// import { pageTitleDirective } from '@/directives/pageTitle'

// 设置全局 Zod 错误消息
setupGlobalZodMessages()

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin)

// 如果选择插件方案
// app.use(siteHeaderPlugin, { router, titleSuffix: ' - Acme Inc' })

// 如果选择指令方案
// app.directive('page-title', pageTitleDirective)

app.mount('#app')