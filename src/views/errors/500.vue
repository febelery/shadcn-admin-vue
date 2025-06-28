<template>
  <div class="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div class="text-center">
        <!-- 错误代码 -->
        <h1 class="text-9xl font-bold tracking-tight text-foreground">500</h1>
        
        <!-- 错误标题 -->
        <h2 class="mt-4 text-3xl font-bold tracking-tight text-foreground">
          服务器错误
        </h2>
        
        <!-- 错误描述 -->
        <p class="mt-6 text-base leading-7 text-muted-foreground">
          服务器遇到了意外情况，无法完成请求。我们的工程师正在努力解决这个问题。
        </p>
        
        <!-- 操作按钮 -->
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <Button @click="refresh">
            刷新页面
          </Button>
          <Button variant="ghost" @click="goHome">
            返回首页
          </Button>
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