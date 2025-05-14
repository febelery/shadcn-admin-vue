<template>
  <div class="overflow-hidden rounded-2xl bg-white shadow-xl">
    <!-- 顶部装饰条 -->
    <div class="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>

    <!-- 内容区域 -->
    <div class="flex flex-col items-center justify-center space-y-6 p-4">
      <div class="relative h-20 w-20">
        <!-- SVG 圆环 -->
        <svg class="absolute top-0 left-0 h-full w-full -rotate-90 transform" :viewBox="`0 0 ${size} ${size}`">
          <!-- 背景圆环 -->
          <circle
            class="text-gray-300"
            stroke="currentColor"
            fill="transparent"
            stroke-width="4"
            :r="radius"
            :cx="center"
            :cy="center"
          />
          <!-- 进度圆环 -->
          <circle
            class="text-black transition-all duration-1000"
            stroke="currentColor"
            fill="transparent"
            stroke-width="4"
            :r="radius"
            :cx="center"
            :cy="center"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="offset"
          />
        </svg>

        <!-- 居中倒计时文本 -->
        <div class="absolute inset-0 flex items-center justify-center text-xl font-bold text-black">
          {{ remaining }}
        </div>
      </div>

      <!-- 文字提示 -->
      <div class="text-center">
        <h2 class="text-2xl font-semibold text-gray-800">二次验证</h2>
        <p class="mt-2 text-sm text-gray-600">请使用微信扫描二维码</p>
      </div>

      <!-- 二维码区域 -->
      <div class="flex h-64 w-64 items-center justify-center rounded-lg bg-white">
        <img v-if="qrCode" :src="qrCode" alt="二维码" class="h-full w-full" />
        <div v-else class="flex h-full w-full items-center justify-center">
          <Loader2 class="h-12 w-12 animate-spin text-gray-400" />
        </div>
      </div>

      <!-- 返回按钮 -->
      <Button variant="ghost" class="text-gray-500" @click="$emit('back')">返回</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCountdown } from '@vueuse/core'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { Loader2 } from 'lucide-vue-next'
import { computed, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/user'

const props = defineProps<{
  otpKey: string
}>()

const userStore = useUserStore()

const emit = defineEmits(['back', 'success'])

const qrCode = useQRCode(
  computed(() => props.otpKey),
  {
    width: 400,
  }
)

const totalTime = 60
const { remaining, start, stop } = useCountdown(totalTime, {
  onComplete() {
    emit('back')
  },
  async onTick() {
    if (remaining.value > 0 && remaining.value % 2 === 0) {
      try {
        await userStore.verifyOtp(props.otpKey)
        stop()
        emit('success')
      } catch (err: any) {
        console.log(err.data)
      }
    }
  },
})
const size = 72 // svg viewBox 及容器尺寸
const radius = 32
const center = size / 2
const circumference = 2 * Math.PI * radius
const offset = computed(() => {
  return ((totalTime - remaining.value) / totalTime) * circumference
})

onMounted(() => {
  start()
})
</script>
