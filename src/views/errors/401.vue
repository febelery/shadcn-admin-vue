<template>
  <div class="bg-background flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div class="text-center">
        <!-- 错误代码 -->
        <h1 class="text-foreground text-9xl font-bold tracking-tight">401</h1>

        <!-- 错误标题 -->
        <h2 class="text-foreground mt-4 text-3xl font-bold tracking-tight">未授权访问</h2>

        <!-- 错误描述 -->
        <p class="text-muted-foreground mt-6 text-base leading-7">
          抱歉，您没有权限访问此页面。请确保您已登录并拥有所需的访问权限。
        </p>

        <!-- 操作按钮 -->
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <Button @click="goToLogin"> 登录 </Button>
          <Button variant="outline" @click="goBack"> 返回 </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const goToLogin = () => {
  router.push('/login')
}
</script>
