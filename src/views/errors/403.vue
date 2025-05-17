<template>
  <div class="relative h-svh w-full overflow-hidden bg-gradient-to-r from-blue-50 via-white to-purple-50 text-gray-800">
    <!-- 创新背景 - 几何图形和柔和纹理 -->
    <div class="absolute inset-0 z-0 overflow-hidden">
      <!-- 主背景纹理 -->
      <div
        class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIiBzdHJva2Utd2lkdGg9IjEiPjxwYXRoIGQ9Ik0tNiA2bDEyLTEyTTYgNmwxMi0xMk0tNiAxOGwxMi0xMk02IDE4bDEyLTEyIi8+PC9nPjwvc3ZnPg==')] opacity-30"
      ></div>

      <!-- 柔和渐变 -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-purple-100/30 to-pink-100/40"></div>

      <!-- 装饰元素 - 左上角 -->
      <div
        class="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-gradient-to-r from-blue-200/40 to-purple-200/40 blur-3xl"
      ></div>

      <!-- 装饰元素 - 右下角 -->
      <div
        class="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-gradient-to-r from-pink-200/40 to-purple-200/40 blur-3xl"
      ></div>

      <!-- 动态波浪线 -->
      <svg class="absolute right-0 bottom-0 left-0 opacity-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <Motion
          :initial="{ x: -100 }"
          :animate="{ x: 0 }"
          :transition="{ duration: 15, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }"
        >
          <path d="M0,0 C300,90 600,0 900,70 L1200,20 L1200,120 L0,120 Z" fill="rgba(196, 181, 253, 0.2)"></path>
        </Motion>
      </svg>
    </div>

    <!-- 主内容 - 不对称布局 -->
    <div class="relative z-10 grid h-full w-full grid-cols-1 p-6 md:grid-cols-5 md:gap-8 md:p-12">
      <!-- 左侧内容区域 - 占据2/5空间 -->
      <div class="flex flex-col justify-center md:col-span-2">
        <Motion :initial="{ opacity: 0, x: -30 }" :animate="{ opacity: 1, x: 0 }" :transition="{ duration: 0.8 }">
          <!-- 403标志 -->
          <div class="mb-6 flex items-center">
            <div
              class="relative mr-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 shadow-md"
            >
              <BanIcon class="h-8 w-8 text-purple-500" />
              <div
                class="absolute -inset-0.5 -z-10 animate-pulse rounded-xl bg-gradient-to-r from-blue-200 to-purple-300 opacity-50 blur-sm"
              ></div>
            </div>
            <h2
              class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-5xl font-black tracking-tight text-transparent md:text-6xl"
            >
              403
            </h2>
          </div>

          <!-- 错误信息 -->
          <h3 class="mb-3 text-2xl font-bold text-gray-800"><span class="text-purple-500">禁止</span>访问</h3>
          <p class="mb-6 text-gray-600">您没有权限访问此页面。请确保您拥有所需的访问权限或联系管理员获取帮助。</p>

          <!-- 按钮组 -->
          <div class="flex flex-wrap gap-4">
            <Button
              variant="outline"
              @click="goBack"
              class="border-gray-300 bg-white/80 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <ArrowLeft class="mr-2 h-4 w-4" />
              返回
            </Button>

            <Button
              @click="goHome"
              class="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
            >
              <div class="relative z-10 flex items-center">
                <HomeIcon class="mr-2 h-4 w-4" />
                首页
              </div>

              <!-- 悬停效果 -->
              <Motion
                :initial="{ x: '-100%' }"
                :whileHover="{ x: '0%' }"
                :transition="{ duration: 0.3 }"
                class="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500 to-blue-500"
              ></Motion>
            </Button>
          </div>
        </Motion>
      </div>

      <!-- 右侧图形区域 - 占据3/5空间 -->
      <div class="mt-8 flex items-center justify-center md:col-span-3 md:mt-0">
        <Motion
          :initial="{ opacity: 0, scale: 0.9 }"
          :animate="{ opacity: 1, scale: 1 }"
          :transition="{ duration: 0.8, delay: 0.2 }"
        >
          <div class="relative">
            <!-- 安全图形容器 -->
            <div
              class="relative flex h-64 w-64 items-center justify-center rounded-2xl bg-white/80 p-6 shadow-xl backdrop-blur-sm md:h-80 md:w-80"
            >
              <!-- 装饰环 -->
              <div class="absolute inset-0 flex items-center justify-center">
                <Motion
                  :initial="{ rotate: 0 }"
                  :animate="{ rotate: 360 }"
                  :transition="{ duration: 20, repeat: Infinity, ease: 'linear' }"
                >
                  <div
                    class="h-56 w-56 rounded-full border-2 border-dashed border-blue-200 opacity-70 md:h-72 md:w-72"
                  ></div>
                </Motion>
              </div>

              <!-- 第二个环 -->
              <div class="absolute inset-0 flex items-center justify-center">
                <Motion
                  :initial="{ rotate: 360 }"
                  :animate="{ rotate: 0 }"
                  :transition="{ duration: 15, repeat: Infinity, ease: 'linear' }"
                >
                  <div class="h-48 w-48 rounded-full border-2 border-purple-200 opacity-70 md:h-64 md:w-64"></div>
                </Motion>
              </div>

              <!-- 安全图标 -->
              <div class="relative z-10">
                <Motion
                  :initial="{ scale: 1 }"
                  :animate="{ scale: 1.1 }"
                  :transition="{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }"
                >
                  <div class="relative flex flex-col items-center">
                    <div
                      class="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-purple-100 shadow-inner"
                    >
                      <ShieldIcon class="h-12 w-12 text-purple-500" />
                      <XIcon class="absolute h-8 w-8 text-red-500" />
                    </div>
                    <div class="text-center">
                      <p class="text-sm font-medium text-gray-500">访问被拒绝</p>
                      <p class="mt-1 text-xs text-gray-400">请联系管理员获取权限</p>
                    </div>
                  </div>
                </Motion>
              </div>
            </div>

            <!-- 装饰元素 - 小圆点 -->
            <div class="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-blue-200"></div>
            <div class="absolute -bottom-4 -left-4 h-8 w-8 rounded-full bg-purple-200"></div>
            <div class="absolute top-1/2 -right-6 h-12 w-12 -translate-y-1/2 transform rounded-full bg-pink-200"></div>
          </div>
        </Motion>
      </div>

      <!-- 底部提示信息 -->
      <div class="absolute right-0 bottom-4 left-0 text-center text-xs text-gray-400 md:bottom-6">
        <p>如需帮助，请联系管理员或IT支持部门</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Ban as BanIcon, Home as HomeIcon, Shield as ShieldIcon, X as XIcon } from 'lucide-vue-next'
import { Motion } from 'motion-v'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const goHome = () => {
  router.push('/')
}
</script>
