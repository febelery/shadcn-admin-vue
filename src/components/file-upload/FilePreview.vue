<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md"
      @keydown="handleKeyEvents"
      tabindex="0"
      ref="previewRef"
    >
      <!-- 主预览区域 -->
      <div class="relative z-10 flex h-full w-full items-center justify-center">
        <!-- 图片预览 -->
        <div
          v-if="file && isImageFile(file)"
          class="flex h-full w-full items-center justify-center"
          @wheel="handleWheel"
        >
          <img
            :src="fileUrl"
            :style="{
              transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
              maxHeight: isFullscreen ? '100vh' : '90vh',
              transition: isDragging ? 'none' : 'transform 0.2s ease',
            }"
            class="h-auto max-w-full cursor-move object-contain"
            @mousedown="startDrag"
            @mousemove="onDrag"
            @mouseup="stopDrag"
            @mouseleave="stopDrag"
            alt="Image preview"
            draggable="false"
          />
        </div>

        <!-- 视频预览 -->
        <div v-else-if="file && isVideoFile(file)" class="flex h-full w-full items-center justify-center">
          <video :src="fileUrl" class="max-h-[90vh] max-w-full" controls autoplay></video>
        </div>

        <!-- 非可预览文件 -->
        <div v-else class="flex flex-col items-center justify-center text-white">
          <div class="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-white/10">
            <component :is="getFileIcon(file)" class="size-16 text-white" />
          </div>
          <p class="text-lg">此文件类型不支持预览</p>
          <p class="mt-2 text-sm text-gray-400">
            {{ file?.type || '未知类型' }}
          </p>
          <p
            @click="copyImageUrl"
            class="mt-2 w-full cursor-pointer rounded-lg border border-gray-700 bg-gray-800 p-2 text-sm text-white"
          >
            {{ fileUrl || '未知类型' }}
          </p>

          <!-- 在新标签页打开按钮 -->
          <button
            @click="openInNewTab"
            class="mt-6 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white transition-colors hover:bg-white/20"
          >
            <ExternalLink class="size-4" />
            <span>在浏览器中打开</span>
          </button>
        </div>
      </div>

      <!-- 顶部工具栏 -->
      <div class="absolute top-0 right-0 left-0 z-20 flex items-center justify-between p-4 text-white">
        <h3 class="max-w-md truncate text-lg font-medium opacity-80">{{ file?.name }}</h3>
        <div class="flex items-center gap-2">
          <button @click="close" class="rounded-full p-2 transition-colors hover:bg-white/10">
            <X class="size-5" />
          </button>
        </div>
      </div>

      <!-- 导航按钮 - 当有多个文件时 -->
      <template v-if="totalFiles > 1">
        <button
          @click="navigate('prev')"
          class="absolute top-1/2 left-4 z-20 -translate-y-1/2 rounded-full bg-black/30 p-3 text-white opacity-80 transition-opacity hover:opacity-100"
          :class="{ 'cursor-not-allowed opacity-30': currentIndex === 0 }"
          :disabled="currentIndex === 0"
        >
          <ChevronLeft class="size-7" />
        </button>
        <button
          @click="navigate('next')"
          class="absolute top-1/2 right-4 z-20 -translate-y-1/2 rounded-full bg-black/30 p-3 text-white opacity-80 transition-opacity hover:opacity-100"
          :class="{ 'cursor-not-allowed opacity-30': currentIndex === totalFiles - 1 }"
          :disabled="currentIndex === totalFiles - 1"
        >
          <ChevronRight class="size-7" />
        </button>
      </template>

      <!-- 底部工具栏 - Dock样式 -->
      <div
        class="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/40 px-4 py-2 backdrop-blur-md"
      >
        <!-- 仅对图片显示缩放和旋转控制 -->
        <template v-if="file && isImageFile(file)">
          <button
            @click="zoom = Math.max(0.1, zoom - 0.1)"
            class="rounded-full p-2 text-white transition-all hover:bg-white/20"
            :disabled="zoom <= 0.1"
          >
            <ZoomOut class="size-5" />
          </button>
          <div class="text-sm text-white/80">{{ Math.round(zoom * 100) }}%</div>
          <button
            @click="zoom = Math.min(5, zoom + 0.1)"
            class="rounded-full p-2 text-white transition-all hover:bg-white/20"
            :disabled="zoom >= 5"
          >
            <ZoomIn class="size-5" />
          </button>
          <div class="mx-1 h-6 w-px bg-white/20"></div>
          <button @click="rotation -= 90" class="rounded-full p-2 text-white transition-all hover:bg-white/20">
            <RotateCcw class="size-5" />
          </button>
          <button @click="rotation += 90" class="rounded-full p-2 text-white transition-all hover:bg-white/20">
            <RotateCw class="size-5" />
          </button>
          <button @click="resetView" class="rounded-full p-2 text-white transition-all hover:bg-white/20">
            <Maximize class="size-5" />
          </button>
          <div class="mx-1 h-6 w-px bg-white/20"></div>
        </template>

        <button @click="download" class="rounded-full p-2 text-white transition-all hover:bg-white/20">
          <Download class="size-5" />
        </button>

        <!-- 复制图片URL按钮 -->
        <button @click="copyImageUrl" class="rounded-full p-2 text-white transition-all hover:bg-white/20">
          <component :is="copied ? Check : Copy" class="size-5" />
        </button>
      </div>

      <!-- 复制成功提示 -->
      <div
        v-if="showCopiedToast"
        class="absolute bottom-20 left-1/2 z-20 -translate-x-1/2 rounded-lg bg-green-600 px-4 py-2 text-sm text-white shadow-lg"
      >
        已复制图片链接
      </div>

      <!-- 文件信息提示 -->
      <div
        v-if="showInfo"
        class="fixed right-6 bottom-6 z-20 max-w-xs rounded-lg bg-black/40 p-3 text-sm text-white backdrop-blur-md"
      >
        <p class="text-white/80">{{ file ? formatFileSize(file.size) : '' }}</p>
        <p class="text-white/80">修改于 {{ file ? new Date(file.lastModified).toLocaleString() : '' }}</p>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  FileIcon,
  FileText,
  ImageIcon,
  Maximize,
  Music,
  RotateCcw,
  RotateCw,
  Video,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-vue-next'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { formatFileSize, isImageFile, isVideoFile } from './fileUtils'

interface Props {
  isOpen: boolean
  file: File | null
  fileUrl: string
  currentIndex: number
  totalFiles: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'navigate', direction: 'prev' | 'next'): void
  (e: 'download'): void
}>()

const { copy, copied } = useClipboard({ copiedDuring: 2000 })
const showCopiedToast = ref(false)

const previewRef = ref<HTMLElement | null>(null)
const zoom = ref(1)
const rotation = ref(0)
const isFullscreen = ref(false)
const showInfo = ref(false)
const isDragging = ref(false)
const dragStartPos = ref({ x: 0, y: 0 })
const dragOffset = ref({ x: 0, y: 0 })

function close() {
  emit('close')
}

function navigate(direction: 'prev' | 'next') {
  emit('navigate', direction)
  // Reset zoom and rotation when navigating
  resetView()
}

function download() {
  emit('download')
}

function getFileIcon(file: File | null) {
  if (!file) return FileIcon
  const type = file.type

  if (type.startsWith('image/')) return ImageIcon
  if (type.startsWith('video/')) return Video
  if (type.startsWith('audio/')) return Music
  if (type.startsWith('text/')) return FileText
  return FileIcon
}

function resetView() {
  zoom.value = 1
  rotation.value = 0
  dragOffset.value = { x: 0, y: 0 }
}

function handleKeyEvents(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    close()
    e.preventDefault()
  } else if (e.key === 'ArrowLeft') {
    if (props.currentIndex > 0) {
      navigate('prev')
      e.preventDefault()
    }
  } else if (e.key === 'ArrowRight') {
    if (props.currentIndex < props.totalFiles - 1) {
      navigate('next')
      e.preventDefault()
    }
  } else if (e.key === '+' || e.key === '=') {
    if (props.file && isImageFile(props.file)) {
      zoom.value = Math.min(5, zoom.value + 0.1)
      e.preventDefault()
    }
  } else if (e.key === '-') {
    if (props.file && isImageFile(props.file)) {
      zoom.value = Math.max(0.1, zoom.value - 0.1)
      e.preventDefault()
    }
  } else if (e.key === 'r') {
    if (props.file && isImageFile(props.file)) {
      rotation.value = (rotation.value + 90) % 360
      e.preventDefault()
    }
  } else if (e.key === '0') {
    resetView()
    e.preventDefault()
  } else if (e.key === 'i') {
    showInfo.value = !showInfo.value
    e.preventDefault()
  } else if (e.key === 'd') {
    download()
    e.preventDefault()
  }
}

function handleWheel(e: WheelEvent) {
  if (props.file && isImageFile(props.file)) {
    // 防止页面滚动
    e.preventDefault()

    // 计算缩放
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    zoom.value = Math.min(5, Math.max(0.1, zoom.value + delta))
  }
}

// 拖拽图片功能
function startDrag(e: MouseEvent) {
  if (props.file && isImageFile(props.file)) {
    isDragging.value = true
    dragStartPos.value = { x: e.clientX, y: e.clientY }
  }
}

function onDrag(e: MouseEvent) {
  if (isDragging.value) {
    const dx = e.clientX - dragStartPos.value.x
    const dy = e.clientY - dragStartPos.value.y
    dragStartPos.value = { x: e.clientX, y: e.clientY }
    dragOffset.value.x += dx
    dragOffset.value.y += dy
  }
}

function stopDrag() {
  isDragging.value = false
}

// 复制图片URL
function copyImageUrl() {
  if (props.fileUrl) {
    copy(props.fileUrl)
    showCopiedToast.value = true
    setTimeout(() => {
      showCopiedToast.value = false
    }, 2000)
  }
}

// 在新标签页打开URL
function openInNewTab() {
  if (props.fileUrl) {
    window.open(props.fileUrl, '_blank')
  }
}

onMounted(() => {
  // 自动聚焦预览容器以支持键盘操作
  nextTick(() => {
    previewRef.value?.focus()
  })

  // 恢复滚动
  onBeforeUnmount(() => {
    document.documentElement.style.overflow = ''
  })

  if ((props.file?.size || 0) > 0) {
    showInfo.value = true
  }
})

// 当文件改变时重置视图
watch(
  () => props.file,
  () => {
    resetView()
  }
)

// 元素自动获得焦点
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      nextTick(() => {
        previewRef.value?.focus()
      })
    }
  }
)
</script>

<style scoped>
.cursor-move {
  cursor: grab;
}
.cursor-move:active {
  cursor: grabbing;
}
</style>
