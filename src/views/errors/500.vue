<template>
  <div class="bg-background flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div class="text-center">
        <!-- 错误代码 -->
        <h1 class="text-foreground text-9xl font-bold tracking-tight">500</h1>

        <!-- 错误标题 -->
        <h2 class="text-foreground mt-4 text-3xl font-bold tracking-tight">服务器错误</h2>

        <!-- 错误描述 -->
        <p class="text-muted-foreground mt-6 text-base leading-7">
          服务器遇到了意外情况，无法完成请求。我们的工程师正在努力解决这个问题。
        </p>

        <!-- 操作按钮 -->
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <Button @click="refresh"> 刷新 </Button>
          <Button variant="outline" @click="goHome"> 首页 </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const refresh = () => {
  window.location.reload()
}

const goHome = () => {
  router.push('/')
}
</script>
