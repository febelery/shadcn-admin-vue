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
        <OtpScan :otp-key="otpKey" @back="otpKey = ''" @success="loginSuccesse" />
      </template>
    </Motion>
  </div>
</template>

<script setup lang="ts">
import confetti from 'canvas-confetti'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { useUserStore } from '@/stores/user'
import LoginForm from './components/login-form.vue'
import OtpScan from './components/otp-scan.vue'

const userStore = useUserStore()
const isSubmitting = ref(false)
const otpKey = ref('')
const currentCredentials = ref<Record<string, any> | null>(null)

const handleLogin = async (values: Record<string, any>) => {
  isSubmitting.value = true

  try {
    const res = await userStore.login(values)

    if (res.needOtp) {
      currentCredentials.value = values
      otpKey.value = res.otpKey
    } else {
      loginSuccesse()
    }
  } catch (err: any) {
    toast.error(err?.data?.message || '登录失败', {
      position: 'top-center',
    })
  } finally {
    isSubmitting.value = false
  }
}

const loginSuccesse = () => {
  toast.success('登录成功')
  celebrate()
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
