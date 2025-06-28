<template>
  <div class="overflow-hidden rounded-2xl bg-white shadow-xl">
    <!-- 顶部装饰条 -->
    <Motion
      :initial="{ scaleX: 0 }"
      :animate="{ scaleX: 1 }"
      :transition="{ duration: 0.6, delay: 0.3 }"
      class="h-2 origin-left bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
    ></Motion>

    <!-- 头部区域 -->
    <div class="relative p-8 pb-2">
      <!-- 装饰性圆形 -->
      <Motion
        :initial="{ scale: 0, opacity: 0 }"
        :animate="{ scale: 1, opacity: 0.5 }"
        :transition="{ duration: 0.7, delay: 0.5 }"
        class="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100"
      ></Motion>
      <Motion
        :initial="{ scale: 0, opacity: 0 }"
        :animate="{ scale: 1, opacity: 0.4 }"
        :transition="{ duration: 0.7, delay: 0.7 }"
        class="absolute bottom-0 left-0 -mb-12 -ml-12 h-24 w-24 rounded-full bg-gradient-to-br from-pink-100 to-purple-100"
      ></Motion>

      <!-- 背景文字 -->
      <Motion
        :initial="{ scale: 0.5, opacity: 0 }"
        :animate="{ scale: 1, opacity: 0.1 }"
        :transition="{ duration: 1, delay: 0.2 }"
        class="absolute top-3 left-1/2 -translate-x-1/2 transform text-center"
      >
        <h1 class="text-8xl font-bold text-gray-400">登录</h1>
      </Motion>

      <div class="relative mb-6 text-center">
        <Motion
          :initial="{ scale: 0, rotate: -45 }"
          :animate="{ scale: 1, rotate: 0 }"
          :transition="{ type: 'spring', stiffness: 150, damping: 15, delay: 0.2 }"
          class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-black shadow-md"
        >
          <Lock class="h-8 w-8 text-white" />
        </Motion>
      </div>
    </div>

    <!-- 表单区域 -->
    <div class="p-8 pt-4">
      <AutoForm
        class="space-y-6"
        :schema="loginSchema"
        :field-config="{
          username: {
            label: '用户名',
            description: '请输入您的用户名或邮箱',
            inputProps: {
              placeholder: '请输入用户名',
              class: 'w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-300',
            },
          },
          password: {
            label: '密码',
            description: '请输入您的登录密码',
            inputProps: {
              type: 'password',
              placeholder: '请输入密码',
              autocomplete: 'current-password',
              class: 'w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-300',
            },
          },
        }"
        @submit="onSubmit"
      >
        <div class="flex flex-col space-y-4">
          <!-- 登录按钮 -->
          <RainbowButton type="submit" class="h-10 w-full" :disabled="isSubmitting">
            {{ isSubmitting ? '登录中...' : '登录' }}
          </RainbowButton>
        </div>
      </AutoForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Lock } from 'lucide-vue-next'
import * as z from 'zod'

const props = defineProps<{
  isSubmitting?: boolean
}>()

const emit = defineEmits(['submit'])

// 定义登录表单验证 schema
const loginSchema = z.object({
  username: z.string()
    .min(2, '用户名至少需要2个字符')
    .max(50, '用户名不能超过50个字符'),
  password: z.string()
    .min(6, '密码至少需要6个字符')
    .max(100, '密码不能超过100个字符'),
})

// 表单提交处理函数
function onSubmit(values: z.infer<typeof loginSchema>) {
  emit('submit', values)
}
</script>