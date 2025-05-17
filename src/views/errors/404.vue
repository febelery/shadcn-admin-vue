<template>
  <div class="relative h-svh w-full overflow-hidden bg-gradient-to-r from-orange-50 via-white to-red-50 text-gray-900">
    <div class="absolute inset-0 z-0">
      <!-- 主背景纹理 -->
      <div
        class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIiBzdHJva2Utd2lkdGg9IjEiPjxwYXRoIGQ9Ik0tNiA2bDEyLTEyTTYgNmwxMi0xMk0tNiAxOGwxMi0xMk02IDE4bDEyLTEyIi8+PC9nPjwvc3ZnPg==')] opacity-20"
      ></div>

      <!-- 柔和渐变 -->
      <div class="absolute inset-0 bg-gradient-to-br from-orange-100/40 via-amber-100/30 to-red-100/40"></div>

      <!-- 装饰元素 - 左上角 -->
      <div
        class="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-gradient-to-r from-orange-200/40 to-amber-200/40 blur-3xl"
      ></div>

      <!-- 装饰元素 - 右下角 -->
      <div
        class="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-gradient-to-r from-red-200/40 to-amber-200/40 blur-3xl"
      ></div>

      <!-- 动态波浪线 -->
      <svg class="absolute right-0 bottom-0 left-0 opacity-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <Motion
          :initial="{ x: -100 }"
          :animate="{ x: 0 }"
          :transition="{ duration: 15, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }"
        >
          <path d="M0,0 C300,90 600,0 900,70 L1200,20 L1200,120 L0,120 Z" fill="rgba(249, 115, 22, 0.2)"></path>
        </Motion>
      </svg>

      <svg class="absolute right-0 bottom-0 left-0 opacity-30" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <Motion
          :initial="{ x: 0 }"
          :animate="{ x: -100 }"
          :transition="{ duration: 10, repeat: Infinity, repeatType: 'loop' }"
        >
          <path d="M0,60 C300,20 600,90 900,10 L1200,100 L1200,120 L0,120 Z" fill="rgba(239, 68, 68, 0.15)"></path>
        </Motion>
      </svg>
    </div>

    <div class="relative z-10 flex h-full w-full items-center justify-center p-6">
      <div class="w-full max-w-2xl">
        <div class="grid items-center gap-8">
          <Motion
            tag="div"
            :initial="{ opacity: 0, y: -20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.8, ease: 'easeOut' }"
            class="flex flex-col items-center text-center"
          >
            <!-- 状态标签 -->
            <div
              class="mb-3 rounded-full bg-orange-100 px-4 py-1 text-sm font-semibold tracking-widest text-orange-600 shadow-sm"
            >
              未找到
            </div>

            <!-- 404数字 -->
            <div class="relative mb-6">
              <Motion
                :initial="{ opacity: 0, scale: 0.8 }"
                :animate="{ opacity: 1, scale: 1 }"
                :transition="{ duration: 0.7, delay: 0.2, ease: 'easeOut' }"
              >
                <div class="relative">
                  <!-- 装饰圆环 -->
                  <div
                    class="absolute -inset-6 rounded-full bg-gradient-to-tr from-orange-100/80 to-red-100/80 blur-md"
                  ></div>

                  <!-- 迷路标志装饰 -->
                  <div class="absolute -top-8 -right-8 rotate-12 transform">
                    <div class="h-10 w-10 rounded-lg bg-amber-100 p-2 shadow-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        class="h-full w-full text-amber-500"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                    </div>
                  </div>

                  <!-- 数字 -->
                  <div class="relative mb-4 text-7xl font-bold tracking-tight text-orange-600 md:text-9xl">
                    <span class="drop-shadow-md">404</span>
                  </div>
                </div>
              </Motion>

              <!-- 闪烁装饰 -->
              <Motion
                :initial="{ opacity: 1 }"
                :animate="{ opacity: [1, 0.3, 1] }"
                :transition="{ duration: 1.5, repeat: Infinity, repeatType: 'loop' }"
                class="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50"
              ></Motion>

              <Motion
                :initial="{ opacity: 1 }"
                :animate="{ opacity: [1, 0.3, 1] }"
                :transition="{ duration: 1.5, repeat: Infinity, repeatType: 'loop', delay: 0.5 }"
                class="absolute -bottom-1 -left-1 h-3 w-3 rounded-full bg-red-400 shadow-lg shadow-red-400/50"
              ></Motion>
            </div>

            <!-- 错误信息 -->
            <Motion
              :initial="{ opacity: 0, y: 20 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.5, delay: 0.4 }"
              class="mb-8 max-w-md text-lg leading-relaxed text-gray-600"
            >
              <div class="flex flex-col items-center gap-2">
                <p>抱歉，您要访问的页面似乎迷路了</p>
                <div class="flex items-center gap-2 text-sm text-orange-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    class="h-5 w-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>请检查URL或尝试返回首页</span>
                </div>
              </div>
            </Motion>

            <!-- 按钮组 -->
            <div class="flex gap-4">
              <Motion
                :initial="{ opacity: 0, x: -20 }"
                :animate="{ opacity: 1, x: 0 }"
                :transition="{ duration: 0.4, delay: 0.6 }"
              >
                <Button @click="goBack" variant="outline">
                  <ArrowLeft class="mr-2 h-4 w-4" />
                  返回
                </Button>
              </Motion>
              <Motion
                :initial="{ opacity: 0, x: 20 }"
                :animate="{ opacity: 1, x: 0 }"
                :transition="{ duration: 0.4, delay: 0.8 }"
              >
                <Button @click="goHome" class="bg-orange-600 hover:bg-orange-700">
                  <Home class="mr-2 h-4 w-4" />
                  首页
                </Button>
              </Motion>
            </div>
          </Motion>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Home } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const goHome = () => {
  router.push('/')
}
</script>
