<template>
  <Motion
    :initial="{ opacity: 0, scale: 0.9 }"
    :animate="{ opacity: 1, scale: 1 }"
    :transition="{ type: 'spring', stiffness: 300, damping: 20 }"
    :class="[isSelected ? 'z-10' : 'z-0']"
  >
    <div class="group relative cursor-pointer transition-all duration-500" @click.stop="emit('click')">
      <!-- 卡片容器 - 响应式尺寸 -->
      <div
        class="relative flex items-center justify-center overflow-hidden rounded-xl border-2 bg-gradient-to-br from-gray-50 via-white to-gray-50 transition-all duration-300 ease-out dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900"
        :class="[
          // 动态设置宽高比和边框
          props.class || 'aspect-square w-full min-w-0',
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
          class="absolute top-1 right-1 z-30 sm:top-2 sm:right-2"
        >
          <div
            class="flex h-4 w-4 items-center justify-center rounded-full bg-green-100 shadow-sm sm:h-6 sm:w-6 dark:bg-green-900/30"
          >
            <CheckCircle class="size-3 text-green-600 sm:size-5 dark:text-green-400" />
          </div>
        </Motion>

        <!-- 上传失败状态 - 角落错误指示器 -->
        <Motion
          v-if="isError"
          :initial="{ opacity: 0, scale: 0.5 }"
          :animate="{ opacity: 1, scale: 1 }"
          :transition="{ type: 'spring', stiffness: 300, damping: 20 }"
          class="absolute top-1 right-1 z-30 sm:top-2 sm:right-2"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  class="flex h-4 w-4 items-center justify-center rounded-full bg-red-100 shadow-sm sm:h-6 sm:w-6 dark:bg-red-900/30"
                >
                  <AlertTriangle class="size-3 text-red-600 sm:size-5 dark:text-red-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <div class="flex flex-col gap-1 p-1">
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
          class="absolute bottom-1 left-1 z-30 sm:bottom-2 sm:left-2"
        >
          <Motion :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
            <button
              @click.stop="$emit('remove')"
              class="flex h-4 w-4 items-center justify-center rounded-full bg-gray-100/30 shadow-sm backdrop-blur-sm transition-colors hover:bg-red-100/70 sm:h-6 sm:w-6 dark:bg-neutral-800/30 dark:hover:bg-red-900/50"
            >
              <Trash class="size-2.5 text-red-500 hover:font-bold sm:size-4" />
            </button>
          </Motion>
        </Motion>

        <!-- 圆形进度条 -->
        <div v-if="isUploading" class="absolute inset-0 z-30 flex items-center justify-center">
          <div class="relative flex h-12 w-12 items-center justify-center sm:h-16 sm:w-16">
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
              class="z-10 rounded-md bg-white/80 px-1.5 py-0.5 text-xs font-bold text-blue-600 shadow-sm backdrop-blur-sm sm:px-2 sm:text-sm dark:bg-black/40 dark:text-blue-300"
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
            <PlayIcon class="size-4 text-white sm:size-6" />
          </div>
        </div>

        <!-- 非图片/视频文件图标 - 优化设计 -->
        <div v-else class="flex h-full w-full flex-col items-center justify-center p-2 sm:p-4">
          <!-- 文件图标容器 - 更大更美观 -->
          <div class="relative mb-2 sm:mb-3">
            <!-- 背景装饰 -->
            <div
              :class="[
                'absolute inset-0 rounded-2xl opacity-20 blur-sm',
                fileTypeConfig.bg,
              ]"
            ></div>
            
            <!-- 主图标容器 -->
            <div
              :class="[
                'relative flex items-center justify-center rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl',
                'h-12 w-12 sm:h-16 sm:w-16',
                fileTypeConfig.bg,
              ]"
            >
              <component :is="fileTypeConfig.icon" :class="['size-6 sm:size-8', fileTypeConfig.iconColor]" />
              
              <!-- 文件类型标识 -->
              <div
                class="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md dark:bg-neutral-800 sm:h-6 sm:w-6"
              >
                <span class="text-xs font-bold text-gray-600 dark:text-gray-300 sm:text-sm">
                  {{ getFileExtension(file.name).charAt(0) }}
                </span>
              </div>
            </div>
          </div>

          <!-- 文件扩展名 -->
          <div
            class="rounded-md px-2 py-1 text-center"
            :class="[
              'text-xs font-semibold sm:text-sm',
              fileTypeConfig.textColor,
              fileTypeConfig.bgLight,
            ]"
          >
            {{ getFileExtension(file.name) }}
          </div>

          <!-- 文件大小 -->
          <div class="mt-1 text-center text-xs text-gray-500 dark:text-gray-400">
            {{ formatFileSize(file.size) }}
          </div>
        </div>
      </div>
    </div>
  </Motion>
</template>

<script setup lang="ts">
import {
  AlertTriangle,
  Archive,
  CheckCircle,
  Code,
  Database,
  File,
  FileAudio,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
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
  class?: string // 添加 class 属性支持
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

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// 文件类型颜色映射 - 更丰富的配置
const fileTypeColors = {
  image: {
    icon: FileImage,
    bg: 'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40',
    bgLight: 'bg-purple-50 dark:bg-purple-900/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
    textColor: 'text-purple-700 dark:text-purple-300',
  },
  video: {
    icon: FileVideo,
    bg: 'bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40',
    bgLight: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    textColor: 'text-blue-700 dark:text-blue-300',
  },
  audio: {
    icon: FileAudio,
    bg: 'bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/40 dark:to-teal-900/40',
    bgLight: 'bg-green-50 dark:bg-green-900/20',
    iconColor: 'text-green-600 dark:text-green-400',
    textColor: 'text-green-700 dark:text-green-300',
  },
  document: {
    icon: FileText,
    bg: 'bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40',
    bgLight: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    textColor: 'text-blue-700 dark:text-blue-300',
  },
  spreadsheet: {
    icon: FileSpreadsheet,
    bg: 'bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40',
    bgLight: 'bg-emerald-50 dark:bg-emerald-900/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    textColor: 'text-emerald-700 dark:text-emerald-300',
  },
  presentation: {
    icon: FileText,
    bg: 'bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40',
    bgLight: 'bg-orange-50 dark:bg-orange-900/20',
    iconColor: 'text-orange-600 dark:text-orange-400',
    textColor: 'text-orange-700 dark:text-orange-300',
  },
  code: {
    icon: Code,
    bg: 'bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-800/60 dark:to-slate-800/60',
    bgLight: 'bg-gray-50 dark:bg-gray-800/20',
    iconColor: 'text-gray-600 dark:text-gray-400',
    textColor: 'text-gray-700 dark:text-gray-300',
  },
  archive: {
    icon: Archive,
    bg: 'bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/40',
    bgLight: 'bg-yellow-50 dark:bg-yellow-900/20',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    textColor: 'text-yellow-700 dark:text-yellow-300',
  },
  database: {
    icon: Database,
    bg: 'bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40',
    bgLight: 'bg-indigo-50 dark:bg-indigo-900/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    textColor: 'text-indigo-700 dark:text-indigo-300',
  },
  default: {
    icon: File,
    bg: 'bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-800/60 dark:to-slate-800/60',
    bgLight: 'bg-gray-50 dark:bg-gray-800/20',
    iconColor: 'text-gray-600 dark:text-gray-400',
    textColor: 'text-gray-700 dark:text-gray-300',
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
  const extension = getFileExtension(props.file.name).toLowerCase()

  // 图片类型
  if (type.startsWith('image/')) return fileTypeColors.image
  
  // 视频类型
  if (type.startsWith('video/')) return fileTypeColors.video
  
  // 音频类型
  if (type.startsWith('audio/')) return fileTypeColors.audio

  // 文档类型
  if (type.includes('word') || extension === 'doc' || extension === 'docx') {
    return fileTypeColors.document
  }

  // 表格类型
  if (type.includes('excel') || type.includes('spreadsheet') || 
      ['xls', 'xlsx', 'csv'].includes(extension)) {
    return fileTypeColors.spreadsheet
  }

  // 演示文稿类型
  if (type.includes('powerpoint') || type.includes('presentation') || 
      ['ppt', 'pptx'].includes(extension)) {
    return fileTypeColors.presentation
  }

  // 代码文件
  if (['js', 'ts', 'jsx', 'tsx', 'vue', 'html', 'css', 'scss', 'json', 'xml', 'yaml', 'yml', 'md'].includes(extension)) {
    return fileTypeColors.code
  }

  // 压缩文件
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(extension)) {
    return fileTypeColors.archive
  }

  // 数据库文件
  if (['sql', 'db', 'sqlite', 'mdb'].includes(extension)) {
    return fileTypeColors.database
  }

  // PDF
  if (type === 'application/pdf' || extension === 'pdf') {
    return {
      icon: FileText,
      bg: 'bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/40 dark:to-pink-900/40',
      bgLight: 'bg-red-50 dark:bg-red-900/20',
      iconColor: 'text-red-600 dark:text-red-400',
      textColor: 'text-red-700 dark:text-red-300',
    }
  }

  // 文本文件
  if (type.startsWith('text/') || ['txt', 'rtf'].includes(extension)) {
    return {
      icon: FileText,
      bg: 'bg-gradient-to-br from-slate-100 to-gray-100 dark:from-slate-800/60 dark:to-gray-800/60',
      bgLight: 'bg-slate-50 dark:bg-slate-800/20',
      iconColor: 'text-slate-600 dark:text-slate-400',
      textColor: 'text-slate-700 dark:text-slate-300',
    }
  }

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