<template>
  <Motion
    :initial="{ opacity: 0, scale: 0.9 }"
    :animate="{ opacity: 1, scale: 1 }"
    :transition="{ type: 'spring', stiffness: 300, damping: 20 }"
    :class="[isSelected ? 'z-10' : 'z-0']"
  >
    <div class="group relative cursor-pointer transition-all duration-500" @click.stop="emit('click')">
      <!-- 卡片容器 -->
      <div
        class="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border-2 bg-gradient-to-br from-gray-50 via-white to-gray-50 transition-all duration-300 ease-out dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900"
        :class="[
          isSelected
            ? 'shimmer-border border-blue-500 shadow-lg shadow-blue-500/10 dark:border-blue-400 dark:shadow-blue-400/5'
            : isError
              ? 'border-red-500 shadow-md shadow-red-500/10 dark:border-red-400 dark:shadow-red-400/5'
              : 'border-gray-200',
        ]"
      >
        <!-- 状态指示器 -->
        <!-- 上传成功状态 -->
        <Motion
          v-if="isSuccess"
          :initial="{ opacity: 0, scale: 0.5 }"
          :animate="{ opacity: 1, scale: 1 }"
          :transition="{ type: 'spring', stiffness: 300, damping: 20 }"
          class="absolute top-2 right-2 z-30"
        >
          <div
            class="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 shadow-sm dark:bg-green-900/30"
          >
            <CheckCircle class="size-5 text-green-600 dark:text-green-400" />
          </div>
        </Motion>

        <!-- 上传失败状态 - 角落错误指示器 -->
        <Motion
          v-if="isError"
          :initial="{ opacity: 0, scale: 0.5 }"
          :animate="{ opacity: 1, scale: 1 }"
          :transition="{ type: 'spring', stiffness: 300, damping: 20 }"
          class="absolute top-2 right-2 z-30"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  class="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 shadow-sm dark:bg-red-900/30"
                >
                  <AlertTriangle class="size-5 text-red-600 dark:text-red-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <div class="flex flex-col gap-1 p-1">
                  <!-- <span class="font-medium text-red-600 dark:text-red-400">上传失败</span> -->
                  <span class="text-xs text-red-500 dark:text-red-400">{{
                    errorMessage || '文件上传过程中发生错误'
                  }}</span>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Motion>

        <!-- 成功/失败状态 - 底部删除按钮 -->
        <Motion
          v-if="isError || isSuccess"
          :initial="{ opacity: 0, y: 5 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ type: 'spring', stiffness: 300, damping: 20 }"
          class="absolute bottom-2 left-2 z-30"
        >
          <Motion :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
            <button
              @click.stop="$emit('remove')"
              class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100/30 shadow-sm backdrop-blur-sm transition-colors hover:bg-red-100/70 dark:bg-neutral-800/30 dark:hover:bg-red-900/50"
            >
              <Trash class="size-4 text-red-500 hover:font-bold" />
            </button>
          </Motion>
        </Motion>

        <!-- 圆形进度条 -->
        <div v-if="isUploading" class="absolute inset-0 z-30 flex items-center justify-center">
          <div class="relative flex h-16 w-16 items-center justify-center">
            <!-- 环形进度轨道 -->
            <svg class="absolute h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                class="stroke-gray-200 dark:stroke-neutral-700"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke-width="8"
              />
              <circle
                class="stroke-blue-500 transition-all duration-200 ease-in-out dark:stroke-blue-400"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke-width="8"
                :stroke-dasharray="`${(uploadProgress * 2.83).toFixed(2)}, 283`"
              />
            </svg>
            <!-- 中央进度文本 -->
            <span
              class="z-10 rounded-md bg-white/80 px-2 py-0.5 text-sm font-bold text-blue-600 shadow-sm backdrop-blur-sm dark:bg-black/40 dark:text-blue-300"
            >
              {{ uploadProgress }}
            </span>
          </div>
        </div>

        <!-- 图片预览 -->
        <Motion
          v-if="isImageFile(file)"
          :whileHover="{ scale: 1.05 }"
          :transition="{ type: 'spring', stiffness: 100, damping: 20 }"
          class="h-full w-full"
        >
          <img :src="previewUrl" alt="File preview" class="h-full w-full object-cover" />
        </Motion>

        <!-- 视频预览 -->
        <div v-else-if="isVideoFile(file)" class="relative h-full w-full">
          <video :src="previewUrl" class="h-full w-full object-cover" muted></video>
          <div class="absolute inset-0 flex items-center justify-center bg-black/30">
            <PlayIcon class="size-6 text-white" />
          </div>
        </div>

        <!-- 非图片/视频文件图标 -->
        <div v-else class="flex flex-col items-center justify-center p-4">
          <div
            :class="[
              'flex h-16 w-16 items-center justify-center rounded-full shadow-md',
              fileTypeConfig.bg,
              'transform transition-transform duration-300 group-hover:scale-105',
            ]"
          >
            <component :is="fileTypeConfig.icon" :class="['size-7', fileTypeConfig.iconColor]" />
          </div>
          <p class="mt-3 max-w-full truncate text-center text-xs font-medium text-neutral-600 dark:text-neutral-400">
            {{ getFileExtension(file.name) }}
          </p>
        </div>
      </div>
    </div>
  </Motion>
</template>

<script setup lang="ts">
import {
  AlertTriangle,
  CheckCircle,
  File,
  FileText,
  Image as ImageIcon,
  Music,
  PlayIcon,
  Trash,
  Video,
} from 'lucide-vue-next'
import { Motion } from 'motion-v'
import { computed, onMounted, ref, watch } from 'vue'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { getFileExtension, isImageFile, isVideoFile } from './fileUtils'
import { FileUploadStatus } from './types'
import type { UploadFile } from './types'

// Props
interface Props {
  file: UploadFile
  previewUrl: string
  isSelected?: boolean
  hideRemoveButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
  hideRemoveButton: false,
})

// Emits
const emit = defineEmits<{
  (e: 'click'): void
  (e: 'remove'): void
  (e: 'retry'): void
}>()

// 添加文件ID跟踪，用于识别文件是否为同一个
const fileId = ref('')

// 在组件挂载时记录文件ID
onMounted(() => {
  fileId.value = props.file.uid || generateFileId(props.file)
})

// 生成文件ID的辅助函数
function generateFileId(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`
}

// 文件类型颜色映射
const fileTypeColors = {
  image: {
    icon: ImageIcon,
    bg: 'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  video: {
    icon: Video,
    bg: 'bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  audio: {
    icon: Music,
    bg: 'bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/40 dark:to-teal-900/40',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  text: {
    icon: FileText,
    bg: 'bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  default: {
    icon: File,
    bg: 'bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-800/60 dark:to-slate-800/60',
    iconColor: 'text-gray-600 dark:text-gray-400',
  },
}

// 计算上传状态
const hasProgress = computed(() => {
  return 'progress' in props.file
})

const isUploading = computed(() => {
  if (!hasProgress.value) return false
  return props.file.progress.status === FileUploadStatus.UPLOADING
})

const isSuccess = computed(() => {
  if (!hasProgress.value) return false
  return props.file.progress.status === FileUploadStatus.SUCCESS
})

const isError = computed(() => {
  if (!hasProgress.value) return false
  return props.file.progress.status === FileUploadStatus.ERROR
})

// 上传进度和错误信息
const uploadProgress = computed(() => {
  if (!hasProgress.value) return 0
  return props.file.progress.percentage
})

const errorMessage = computed(() => {
  if (!hasProgress.value || !isError.value) return null
  return props.file.progress.error
})

// 监听文件变化，确保在文件ID变化时重置状态
watch(
  () => props.file,
  (newFile) => {
    const newFileId = newFile.uid || generateFileId(newFile)
    // 如果文件ID变化，说明是新文件，重置状态
    if (newFileId !== fileId.value) {
      fileId.value = newFileId
    }
  },
  { deep: true }
)

// 获取文件类型配置
const fileTypeConfig = computed(() => {
  const type = props.file.type

  if (type.startsWith('image/')) return fileTypeColors.image
  if (type.startsWith('video/')) return fileTypeColors.video
  if (type.startsWith('audio/')) return fileTypeColors.audio
  if (type.startsWith('text/')) return fileTypeColors.text
  return fileTypeColors.default
})
</script>

<style scoped>
/* 选中状态边框闪烁动画 */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
    transform: scale(1);
  }
  50% {
    transform: scale(1.01);
  }
  100% {
    background-position: 1000px 0;
    transform: scale(1);
  }
}

.shimmer-border {
  position: relative;
}

.shimmer-border::before {
  content: '';
  position: absolute;
  inset: -3px;
  z-index: -1;
  border-radius: calc(1rem + 2px);
  background: linear-gradient(
    45deg,
    rgba(59, 130, 246, 0.3) 0%,
    rgba(147, 197, 253, 0.5) 25%,
    rgba(59, 130, 246, 0.3) 50%,
    rgba(147, 197, 253, 0.5) 75%,
    rgba(59, 130, 246, 0.3) 100%
  );
  background-size: 200% 200%;
  animation: shimmer 3s ease-in-out infinite;
  filter: blur(0.5px);
}

.dark .shimmer-border::before {
  background: linear-gradient(
    45deg,
    rgba(96, 165, 250, 0.3) 0%,
    rgba(191, 219, 254, 0.5) 25%,
    rgba(96, 165, 250, 0.3) 50%,
    rgba(191, 219, 254, 0.5) 75%,
    rgba(96, 165, 250, 0.3) 100%
  );
}

/* 微妙的脉冲动画 */
@keyframes subtle-pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

.animate-subtle-pulse {
  animation: subtle-pulse 2s infinite ease-in-out;
}
</style>
