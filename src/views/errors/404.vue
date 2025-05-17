<template>
  <div class="relative h-svh w-full overflow-hidden bg-gray-100 text-gray-900">
    <SmoothCursor />

    <div class="absolute inset-0 z-0">
      <div class="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 opacity-70"></div>
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0)_0%,rgba(255,255,255,0.4)_70%)]"
      ></div>
      <div
        class="absolute top-1/4 left-1/4 h-48 w-48 animate-pulse rounded-full bg-blue-300 opacity-50 blur-xl"
        style="animation-delay: 0.5s"
      ></div>
      <div
        class="absolute top-1/3 right-1/4 h-32 w-32 animate-pulse rounded-full bg-purple-300 opacity-50 blur-xl"
        style="animation-delay: 1s"
      ></div>
      <div
        class="absolute bottom-1/4 left-1/3 h-40 w-40 animate-pulse rounded-full bg-teal-300 opacity-50 blur-xl"
        style="animation-delay: 1.5s"
      ></div>
      <div
        class="absolute top-0 left-1/2 h-72 w-72 -translate-x-1/2 transform rounded-full bg-yellow-200 opacity-40 blur-2xl"
      ></div>
      <div
        class="absolute right-1/3 bottom-0 h-64 w-64 translate-x-1/3 transform rounded-full bg-red-200 opacity-40 blur-2xl"
      ></div>
    </div>

    <div class="relative z-10 flex h-full w-full items-center justify-center p-6">
      <div class="w-full max-w-2xl">
        <div class="grid items-center gap-8">
          <Motion
            tag="div"
            :initial="{ opacity: 0, y: -20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6 }"
            class="flex flex-col items-center text-center"
          >
            <div class="mb-2 text-sm font-semibold tracking-widest text-gray-500 uppercase">未找到</div>
            <Motion
              :initial="{ opacity: 0, scale: 0.8 }"
              :animate="{ opacity: 1, scale: 1 }"
              :transition="{ duration: 0.5, delay: 0.2 }"
              class="mb-4 text-6xl font-bold tracking-tight md:text-8xl"
            >
              404
            </Motion>
            <Motion
              :initial="{ opacity: 0, y: 20 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.5, delay: 0.4 }"
              class="mb-6 text-lg leading-relaxed text-gray-600"
            >
              抱歉，您要访问的页面似乎迷路了。请检查URL或尝试返回首页。
            </Motion>
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
                <Button @click="goHome">
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
