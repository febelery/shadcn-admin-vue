<template>
  <Teleport to="body">
    <div
      v-if="isLocked"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-md"
      style="backdrop-filter: blur(20px)"
    >
      <!-- 动态背景粒子 -->
      <div class="absolute inset-0 overflow-hidden">
        <div v-for="i in 20" :key="`particle-${i}`" class="absolute">
          <Motion
            :initial="{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
              opacity: 0.1 + Math.random() * 0.3,
              scale: 0.5 + Math.random() * 0.5,
            }"
            :animate="{
              x: [null, Math.random() * 100 + '%', Math.random() * 100 + '%'],
              y: [null, Math.random() * 100 + '%', Math.random() * 100 + '%'],
              opacity: [null, 0.1 + Math.random() * 0.2, 0.2 + Math.random() * 0.3],
              scale: [null, 0.3 + Math.random() * 0.7, 0.5 + Math.random() * 0.5],
            }"
            :transition="{
              duration: 20 + Math.random() * 30,
              repeat: Infinity,
              repeatType: 'loop',
            }"
          >
            <div
              class="rounded-full bg-white/20"
              :style="{
                width: 2 + Math.random() * 4 + 'px',
                height: 2 + Math.random() * 4 + 'px',
                filter: 'blur(' + (Math.random() > 0.5 ? 1 : 0) + 'px)',
              }"
            ></div>
          </Motion>
        </div>
      </div>

      <!-- 锁屏内容 -->
      <Motion
        :initial="{ opacity: 0, scale: 0.9 }"
        :animate="{ opacity: 1, scale: 1 }"
        :transition="{ type: 'spring', stiffness: 300, damping: 30 }"
        class="relative flex flex-col items-center justify-center space-y-12"
      >
        <!-- 时间显示 -->
        <Motion
          :initial="{ y: -20, opacity: 0 }"
          :animate="{ y: 0, opacity: 1 }"
          :transition="{ delay: 0.1, type: 'spring', stiffness: 300, damping: 30 }"
          class="text-center select-none"
        >
          <div class="text-6xl font-light text-white/90 tracking-wider mb-2">
            {{ currentTime }}
          </div>
          <div class="text-lg text-white/60 font-light">
            {{ currentDate }}
          </div>
        </Motion>

        <!-- 解锁按钮 - 圆环进度条 -->
        <Motion
          :initial="{ y: 30, opacity: 0 }"
          :animate="{ y: 0, opacity: 1 }"
          :transition="{ delay: 0.2, type: 'spring', stiffness: 300, damping: 30 }"
        >
          <div class="relative">
            <!-- 外层光晕效果 -->
            <div 
              v-if="isUnlocking"
              class="absolute inset-0 rounded-full bg-white/10 animate-pulse"
              style="filter: blur(20px); transform: scale(1.5);"
            />
            
            <!-- 圆环进度条 - 增大尺寸 -->
            <svg
              class="h-44 w-44 -rotate-90 transform pointer-events-none drop-shadow-2xl"
              viewBox="0 0 176 176"
            >
              <!-- 背景圆环 -->
              <circle
                cx="88"
                cy="88"
                r="76"
                stroke="rgba(255, 255, 255, 0.08)"
                stroke-width="6"
                fill="none"
              />
              <!-- 装饰内圆环 -->
              <circle
                cx="88"
                cy="88"
                r="70"
                stroke="rgba(255, 255, 255, 0.05)"
                stroke-width="2"
                fill="none"
              />
              <!-- 进度圆环 -->
              <circle
                cx="88"
                cy="88"
                r="76"
                stroke="url(#progressGradient)"
                stroke-width="6"
                fill="none"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="strokeDashoffset"
                stroke-linecap="round"
                class="transition-all duration-100 ease-out"
                :class="{ 'drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]': isUnlocking }"
              />
              
              <!-- 渐变定义 -->
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:rgba(255,255,255,0.9);stop-opacity:1" />
                  <stop offset="50%" style="stop-color:rgba(255,255,255,0.7);stop-opacity:1" />
                  <stop offset="100%" style="stop-color:rgba(255,255,255,0.9);stop-opacity:1" />
                </linearGradient>
              </defs>
            </svg>

            <!-- 解锁按钮 - 增大按钮区域 -->
            <button
              ref="unlockButton"
              @pointerdown="startUnlock"
              @pointerup="stopUnlock"
              @pointerleave="stopUnlock"
              @pointercancel="stopUnlock"
              @contextmenu.prevent
              class="absolute inset-4 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 active:scale-95 border border-white/10 select-none touch-none group"
              :class="{ 
                'bg-white/15 scale-95 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.3)]': isUnlocking,
                'hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]': !isUnlocking
              }"
              style="touch-action: none; -webkit-touch-callout: none; -webkit-user-select: none;"
            >
              <!-- 解锁图标容器 -->
              <Motion
                :animate="isUnlocking ? { scale: [1, 1.1, 1] } : { scale: 1 }"
                :transition="{ duration: 1.2, repeat: isUnlocking ? Infinity : 0, ease: 'easeInOut' }"
              >
                <div class="relative pointer-events-none">
                  <!-- 解锁图标 - 增大图标 -->
                  <svg
                    class="h-16 w-16 text-white/90 transition-all duration-300 group-hover:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                    />
                  </svg>
                  
                  <!-- 内部脉冲效果 -->
                  <div
                    v-if="isUnlocking"
                    class="absolute inset-2 rounded-full bg-white/10 animate-ping pointer-events-none"
                  />
                  
                  <!-- 外部光环效果 -->
                  <div
                    v-if="isUnlocking"
                    class="absolute -inset-4 rounded-full bg-white/5 animate-pulse pointer-events-none"
                    style="animation-delay: 0.5s;"
                  />
                </div>
              </Motion>

              <!-- 进度指示器 -->
              <div
                v-if="isUnlocking"
                class="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-white/70 text-sm font-light"
              >
                {{ Math.round(progress) }}%
              </div>
            </button>
          </div>
        </Motion>

        <!-- 底部提示 -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ delay: 0.4, type: 'spring', stiffness: 300, damping: 30 }"
          class="text-center space-y-4 select-none"
        >
          <!-- 主要提示 -->
          <div class="space-y-2">
            <p class="text-base text-white/80 font-light">
              长按按钮解锁
            </p>
            <div class="flex items-center justify-center space-x-2 text-white/50">
              <div class="w-1 h-1 rounded-full bg-white/50"></div>
              <p class="text-sm">
                按住 3 秒钟
              </p>
              <div class="w-1 h-1 rounded-full bg-white/50"></div>
            </div>
          </div>
          
          <!-- 分隔线 -->
          <div class="w-24 h-px bg-white/20 mx-auto"></div>
          
          <!-- 退出登录选项 -->
          <div class="space-y-2">
            <p class="text-xs text-white/40">
              或者
            </p>
            <button
              @click="handleLogout"
              class="text-sm text-white/60 hover:text-white/80 transition-all duration-300 underline underline-offset-4 decoration-white/30 hover:decoration-white/60"
            >
              退出登录
            </button>
          </div>
        </Motion>

        <!-- 装饰性元素 -->
        <div class="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-white/5 blur-3xl animate-pulse" style="animation-duration: 4s;"></div>
        <div class="absolute -bottom-20 -right-20 w-32 h-32 rounded-full bg-white/5 blur-2xl animate-pulse" style="animation-duration: 6s; animation-delay: 2s;"></div>
      </Motion>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useLockScreen } from '@/composables/useLockScreen'
import { useUserStore } from '@/stores/user'

const { isLocked, unlockScreen } = useLockScreen()
const userStore = useUserStore()
const router = useRouter()

const unlockButton = ref<HTMLButtonElement>()
const isUnlocking = ref(false)
const progress = ref(0)
const currentTime = ref('')
const currentDate = ref('')
const unlockDuration = 3000 // 3秒
let unlockTimer: number | null = null
let progressTimer: number | null = null
let timeTimer: number | null = null

// 圆环周长 (r=76, 所以周长 = 2 * π * 76)
const circumference = 2 * Math.PI * 76

// 计算进度条偏移
const strokeDashoffset = computed(() => {
  return circumference - (progress.value / 100) * circumference
})

// 更新时间
function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  })
  currentDate.value = now.toLocaleDateString('zh-CN', { 
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  })
}

function startUnlock(event: PointerEvent) {
  // 防止事件冒泡
  event.preventDefault()
  event.stopPropagation()
  
  // 如果已经在解锁过程中，先停止当前进程，然后重新开始
  if (isUnlocking.value) {
    stopUnlock()
  }
  
  // 捕获指针，确保后续事件都能被捕获
  if (unlockButton.value) {
    unlockButton.value.setPointerCapture(event.pointerId)
  }
  
  isUnlocking.value = true
  progress.value = 0
  
  const startTime = Date.now()
  
  // 进度更新定时器
  progressTimer = setInterval(() => {
    const elapsed = Date.now() - startTime
    progress.value = Math.min((elapsed / unlockDuration) * 100, 100)
  }, 16) // 60fps
  
  // 解锁定时器
  unlockTimer = setTimeout(() => {
    completeUnlock()
  }, unlockDuration)
}

function stopUnlock(event?: PointerEvent) {
  // 防止事件冒泡
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  
  if (!isUnlocking.value) return
  
  // 释放指针捕获
  if (event && unlockButton.value) {
    unlockButton.value.releasePointerCapture(event.pointerId)
  }
  
  isUnlocking.value = false
  progress.value = 0
  
  if (unlockTimer) {
    clearTimeout(unlockTimer)
    unlockTimer = null
  }
  
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }
}

function completeUnlock() {
  isUnlocking.value = false
  progress.value = 0
  
  if (unlockTimer) {
    clearTimeout(unlockTimer)
    unlockTimer = null
  }
  
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }
  
  // 解锁成功动画
  toast.success('屏幕已解锁', {
    duration: 2000,
  })
  unlockScreen()
}

function handleLogout() {
  userStore.logout()
  toast.success('已退出登录')
  unlockScreen()
  router.push('/login')
}

// 组件挂载时开始更新时间
onMounted(() => {
  updateTime()
  timeTimer = setInterval(updateTime, 1000)
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (unlockTimer) {
    clearTimeout(unlockTimer)
  }
  if (progressTimer) {
    clearInterval(progressTimer)
  }
  if (timeTimer) {
    clearInterval(timeTimer)
  }
})
</script>

<style scoped>
/* 确保锁屏层级最高 */
.lock-screen {
  z-index: 9999;
}

/* 自定义动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>
</invoke>