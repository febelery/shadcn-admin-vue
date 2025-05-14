import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// 自动导入目前不支持 <motion /> 组件，所以需要手动导入它（import { motion } from 'motion-v'）
import MotionResolver from 'motion-v/resolver'
import { URL, fileURLToPath } from 'node:url'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    tailwindcss(),
    Components({
      // 默认会扫描 src/components 目录
      dirs: ['src/components'],
      extensions: ['vue'],
      deep: true, // 是否扫描子目录
      dts: true, // 生成 `components.d.ts`，用于自动补全
      resolvers: [MotionResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: './',
  server: {
    allowedHosts: ['4856891c.r19.vip.cpolar.cn'],
  },
})
