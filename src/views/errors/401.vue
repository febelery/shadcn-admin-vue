<template>
  <div class="relative h-svh w-full overflow-hidden bg-gradient-to-r from-red-50 via-white to-amber-50 text-gray-900">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 z-0">
      <!-- 半透明锁形状 -->
      <div
        class="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-red-100 to-amber-100 opacity-40 blur-3xl"
      ></div>

      <!-- 动态波浪线 -->
      <svg class="absolute right-0 bottom-0 left-0 opacity-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <Motion
          :initial="{ x: -100 }"
          :animate="{ x: 0 }"
          :transition="{ duration: 10, repeat: Infinity, repeatType: 'loop' }"
        >
          <path d="M0,0 C300,90 600,0 900,70 L1200,20 L1200,120 L0,120 Z" fill="rgba(251, 146, 60, 0.3)"></path>
        </Motion>
      </svg>

      <svg class="absolute right-0 bottom-0 left-0 opacity-30" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <Motion
          :initial="{ x: 0 }"
          :animate="{ x: -100 }"
          :transition="{ duration: 15, repeat: Infinity, repeatType: 'loop' }"
        >
          <path d="M0,60 C300,20 600,90 900,10 L1200,100 L1200,120 L0,120 Z" fill="rgba(239, 68, 68, 0.2)"></path>
        </Motion>
      </svg>
    </div>

    <div class="relative z-10 flex h-full w-full items-center justify-center p-6">
      <div class="w-full max-w-xl">
        <!-- 主要内容容器 -->
        <Motion
          :initial="{ opacity: 0, y: 30 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6 }"
          class="bg-opacity-80 overflow-hidden rounded-2xl bg-white shadow-2xl backdrop-blur-sm"
        >
          <div class="relative p-8">
            <!-- 红色边框 -->
            <div class="absolute inset-0 rounded-2xl border-4 border-red-500 opacity-20"></div>

            <!-- 顶部徽章 -->
            <div class="mb-8 flex justify-center">
              <Motion
                :initial="{ scale: 0.5, opacity: 0 }"
                :animate="{ scale: 1, opacity: 1 }"
                :transition="{ duration: 0.5 }"
              >
                <div class="relative flex h-24 w-24 items-center justify-center">
                  <div class="absolute inset-0 rounded-full bg-red-50"></div>
                  <div class="absolute inset-2 rounded-full border-2 border-dashed border-red-300"></div>
                  <ShieldXIcon class="relative z-10 h-12 w-12 text-red-500" />
                </div>
              </Motion>
            </div>

            <!-- 401标题 -->
            <div class="text-center">
              <Motion
                :initial="{ opacity: 0, y: 20 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ duration: 0.5, delay: 0.2 }"
              >
                <h2 class="text-6xl font-bold tracking-tight text-red-500 md:text-7xl">
                  <span class="inline-block" style="text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.05)">401</span>
                </h2>
                <h3 class="mt-2 text-xl font-semibold tracking-tight text-amber-600">访问未授权</h3>
              </Motion>

              <!-- 分隔线 -->
              <Motion
                :initial="{ width: 0 }"
                :animate="{ width: '100%' }"
                :transition="{ duration: 0.8, delay: 0.4 }"
                class="mx-auto my-6 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"
              ></Motion>

              <!-- 错误信息 -->
              <Motion
                :initial="{ opacity: 0 }"
                :animate="{ opacity: 1 }"
                :transition="{ duration: 0.6, delay: 0.6 }"
                class="mb-8"
              >
                <p class="mb-2 text-lg text-gray-700">身份验证失败，您无权访问此页面</p>
                <p class="text-sm text-gray-500">请确保您已登录并拥有所需的访问权限</p>
              </Motion>
            </div>

            <!-- 动态锁图标 -->
            <Motion
              :initial="{ opacity: 0, scale: 0.8 }"
              :animate="{ opacity: 1, scale: 1 }"
              :transition="{ duration: 0.5, delay: 0.8 }"
              class="my-8 flex justify-center"
            >
              <div class="relative flex">
                <!-- 锁图标周围的环 -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <Motion
                    :initial="{ rotate: 0 }"
                    :animate="{ rotate: 360 }"
                    :transition="{ duration: 8, repeat: Infinity, ease: 'linear' }"
                  >
                    <div class="h-20 w-20 rounded-full border-2 border-dashed border-amber-300 opacity-70"></div>
                  </Motion>
                </div>
                <!-- 第二个反向旋转的环 -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <Motion
                    :initial="{ rotate: 360 }"
                    :animate="{ rotate: 0 }"
                    :transition="{ duration: 12, repeat: Infinity, ease: 'linear' }"
                  >
                    <div class="h-16 w-16 rounded-full border-2 border-dotted border-red-300 opacity-70"></div>
                  </Motion>
                </div>

                <!-- 锁图标 -->
                <div class="relative z-10">
                  <Motion
                    :initial="{ y: -5 }"
                    :animate="{ y: 5 }"
                    :transition="{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }"
                  >
                    <LockIcon class="h-12 w-12 text-amber-500" />
                  </Motion>
                </div>
              </div>
            </Motion>

            <!-- 按钮区域 -->
            <Motion
              :initial="{ opacity: 0, y: 20 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.5, delay: 1 }"
              class="mt-8"
            >
              <div class="flex justify-center gap-4">
                <Button variant="outline" @click="goBack">
                  <div class="relative z-10 flex items-center">
                    <ArrowLeft class="mr-2 h-4 w-4" />
                    返回
                  </div>
                </Button>

                <Button
                  @click="goToLogin"
                  class="group relative overflow-hidden rounded-lg bg-gradient-to-r from-amber-500 to-red-500 px-5 py-2 text-sm font-medium text-white shadow transition-all hover:shadow-md focus:ring-2 focus:ring-amber-300 focus:outline-none"
                >
                  <div class="relative z-10 flex items-center">
                    <KeyIcon class="mr-2 h-4 w-4" />
                    登录
                  </div>
                  <div
                    class="absolute inset-0 -z-10 bg-gradient-to-r from-amber-600 to-red-600 opacity-0 transition-opacity group-hover:opacity-100"
                  ></div>
                </Button>
              </div>

              <!-- 底部小提示 -->
              <p class="mt-6 text-center text-xs text-gray-400">如需帮助，请联系管理员或IT支持部门</p>
            </Motion>
          </div>
        </Motion>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Key as KeyIcon, Lock as LockIcon, ShieldX as ShieldXIcon } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const goToLogin = () => {
  router.push('/login')
}
</script>
