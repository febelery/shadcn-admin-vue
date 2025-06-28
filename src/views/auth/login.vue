<template>
  <div class="relative flex min-h-screen items-center justify-center p-4">
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

    <Motion
      :initial="{ opacity: 0, y: 50 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.8, ease: 'easeOut' }"
      class="z-1 w-full max-w-md"
    >
      <template v-if="!otpKey">
        <LoginForm :is-submitting="isSubmitting" @submit="handleLogin" />
      </template>
      <template v-else>
        <OtpScan :otp-key="otpKey" @back="handleOtpBack" @success="loginSuccess" />
      </template>
    </Motion>
  </div>
</template>

<script setup lang="ts">
import confetti from 'canvas-confetti'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import { useUserStore } from '@/stores/user'
import { menuRoutes } from '@/router/routes'
import LoginForm from './components/login-form.vue'
import OtpScan from './components/otp-scan.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const isSubmitting = ref(false)
const otpKey = ref('')

// 获取用户有权限访问的第一个路由
function getFirstAccessibleRoute(permissions: string[]): string {
  for (const menuRoute of menuRoutes) {
    if (menuRoute.meta?.permission) {
      const routePermissions = Array.isArray(menuRoute.meta.permission) 
        ? menuRoute.meta.permission 
        : [menuRoute.meta.permission]
      
      if (routePermissions.some(permission => permissions.includes(permission))) {
        if (menuRoute.children && menuRoute.children.length > 0) {
          const firstChild = menuRoute.children.find(child => !child.meta?.hideInMenu)
          if (firstChild) {
            return firstChild.path === '' ? menuRoute.path : `${menuRoute.path}/${firstChild.path}`
          }
        }
        return menuRoute.path
      }
    } else {
      if (menuRoute.children && menuRoute.children.length > 0) {
        for (const child of menuRoute.children) {
          if (child.meta?.permission) {
            const childPermissions = Array.isArray(child.meta.permission) 
              ? child.meta.permission 
              : [child.meta.permission]
            
            if (childPermissions.some(permission => permissions.includes(permission))) {
              return child.path === '' ? menuRoute.path : `${menuRoute.path}/${child.path}`
            }
          }
        }
      }
    }
  }
  
  return '/403'
}

const handleLogin = async (values: Record<string, any>) => {
  isSubmitting.value = true

  try {
    const res = await userStore.login(values)

    if (res.needOtp) {
      otpKey.value = res.otpKey
    } else {
      loginSuccess()
    }
  } catch (err: any) {
    // 不要刷新页面，只显示错误信息
    const errorMessage = err?.response?.data?.message || err?.data?.message || '登录失败'
    toast.error(errorMessage, {
      position: 'top-center',
    })
  } finally {
    isSubmitting.value = false
  }
}

const handleOtpBack = () => {
  otpKey.value = ''
  // 重置提交状态
  isSubmitting.value = false
}

const loginSuccess = () => {
  toast.success('登录成功')
  celebrate()
  
  // 获取重定向地址，确保不会有重复的redirect参数
  let redirect = route.query.redirect as string
  
  if (redirect) {
    // 解码重定向URL
    try {
      redirect = decodeURIComponent(redirect)
      // 确保重定向URL不包含redirect参数，避免循环
      if (redirect.includes('redirect=')) {
        redirect = redirect.split('?')[0]
      }
      router.push(redirect)
    } catch {
      // 如果解码失败，跳转到默认路由
      const permissions = userStore.userInfo?.permissions || []
      const firstRoute = getFirstAccessibleRoute(permissions)
      router.push(firstRoute)
    }
  } else {
    // 没有重定向地址，跳转到第一个有权限的路由
    const permissions = userStore.userInfo?.permissions || []
    const firstRoute = getFirstAccessibleRoute(permissions)
    router.push(firstRoute)
  }
}

const celebrate = () => {
  const end = Date.now() + 3 * 1000 // 3 seconds
  const colors = ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1']

  function frame() {
    if (Date.now() > end) return

    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors: colors,
    })

    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors: colors,
    })

    requestAnimationFrame(frame)
  }

  frame()
}
</script>