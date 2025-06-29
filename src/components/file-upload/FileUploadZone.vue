<template>
  <div
    class="relative block w-full cursor-pointer overflow-hidden rounded-xl transition-all duration-300"
    :class="{
      'cursor-not-allowed': shouldDisableClick,
      'p-4 sm:p-6 md:p-8': !currentFiles,
      'p-3 sm:p-4 md:p-5': currentFiles > 0 && maxFiles > 1,
      'p-0': currentFiles > 0 && maxFiles === 1, // 单文件模式有文件时不要内边距
    }"
    @click="emitClick"
    @dragover.prevent="handleEnter"
    @dragleave="handleLeave"
    @drop.prevent="handleDrop"
    @mouseover="handleEnter"
    @mouseleave="handleLeave"
    @paste.prevent="handlePaste"
  >
    <!-- 网格背景 - 单文件模式有文件时隐藏 -->
    <div
      v-if="!(maxFiles === 1 && currentFiles > 0)"
      class="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] opacity-50"
    >
      <div
        :class="
          cn(
            'flex shrink-0 scale-105 flex-wrap items-center justify-center gap-px bg-gray-100 dark:bg-neutral-900',
            $props.class
          )
        "
      >
        <template v-for="row in ROWS">
          <template v-for="col in COLUMNS" :key="`${row}-${col}`">
            <div
              :class="
                cn(
                  'flex h-8 w-8 flex-shrink-0 rounded-[2px] sm:h-10 sm:w-10',
                  ((row - 1) * COLUMNS + (col - 1)) % 2 === 0
                    ? 'bg-gray-50 dark:bg-neutral-950'
                    : 'bg-gray-50 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:bg-neutral-950 dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]'
                )
              "
            />
          </template>
        </template>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="flex flex-col items-center justify-center">
      <!-- 信息区域 - 单文件模式有文件时完全隐藏 -->
      <Motion
        v-if="!(maxFiles === 1 && currentFiles > 0)"
        layout
        class="relative z-20 w-full"
        :class="{ 'max-w-md': !currentFiles, 'max-w-full': currentFiles > 0 }"
        :initial="{ opacity: 0, y: 10 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ type: 'spring', stiffness: 300, damping: 25 }"
      >
        <div layout class="transition-all duration-300">
          <div
            class="flex items-center"
            :class="{
              'flex-col': !currentFiles,
              'flex-col sm:flex-row': currentFiles > 0,
            }"
          >
            <!-- 上传图标 -->
            <Motion
              layout
              :animate="isActive && !shouldDisableClick ? { scale: 1.05 } : {}"
              :transition="{ type: 'spring', stiffness: 300, damping: 20 }"
              :class="{
                'mb-3': !currentFiles,
                'mb-2 sm:mr-3 sm:mb-0': currentFiles > 0,
              }"
            >
              <div
                class="flex items-center justify-center rounded-full"
                :class="{
                  'mb-2 size-12 bg-neutral-100 sm:size-14 dark:bg-neutral-800': !currentFiles,
                  'size-8 bg-neutral-100 sm:size-10 dark:bg-neutral-800': currentFiles > 0,
                  'bg-amber-100 dark:bg-amber-900/20': shouldDisableClick,
                }"
              >
                <Upload
                  :class="{
                    'size-5 sm:size-6': !currentFiles,
                    'size-3 sm:size-4': currentFiles > 0,
                    'text-neutral-500 dark:text-neutral-400': true,
                    'text-amber-600 dark:text-amber-400': shouldDisableClick,
                    'text-neutral-700 dark:text-neutral-300': isActive && !shouldDisableClick,
                  }"
                />
              </div>
            </Motion>

            <!-- 上传状态提示和文件信息 -->
            <div
              class="flex-1"
              :class="{
                'text-center': !currentFiles,
                'text-center sm:text-left': currentFiles > 0,
              }"
            >
              <Motion layout :transition="{ type: 'spring', stiffness: 300, damping: 20 }">
                <p
                  class="font-medium text-neutral-700 dark:text-neutral-200"
                  :class="{
                    'text-base sm:text-lg': !currentFiles,
                    'text-sm': currentFiles > 0,
                  }"
                >
                  <!-- 单文件模式的优化显示 -->
                  <span v-if="maxFiles === 1">
                    <span v-if="currentFiles > 0" class="text-amber-600 dark:text-amber-400">已有文件，请先删除</span>
                    <span v-else>上传文件</span>
                  </span>
                  <!-- 多文件模式的显示 -->
                  <span v-else>
                    <span v-if="isUploadDisabled" class="text-amber-600 dark:text-amber-400">已达到最大上传数量</span>
                    <span v-else-if="currentFiles > 0">继续添加文件</span>
                    <span v-else>上传文件</span>
                  </span>
                </p>
                <p
                  class="text-neutral-500 dark:text-neutral-400"
                  :class="{
                    'mt-1 text-sm': !currentFiles,
                    'mt-1 text-xs': currentFiles > 0,
                  }"
                >
                  <!-- 单文件模式的提示 -->
                  <span v-if="maxFiles === 1">
                    <span v-if="currentFiles === 0">
                      <span class="hidden sm:inline">将文件拖放到此处、单击上传或粘贴(Ctrl+V)</span>
                      <span class="sm:hidden">点击上传或粘贴文件</span>
                    </span>
                    <span v-else>
                      <span class="hidden sm:inline">删除当前文件后可上传新文件</span>
                      <span class="sm:hidden">删除后可上传新文件</span>
                    </span>
                  </span>
                  <!-- 多文件模式的提示 -->
                  <span v-else>
                    <span v-if="!isUploadDisabled">
                      <span class="hidden sm:inline">将文件拖放到此处、单击上传或粘贴(Ctrl+V)</span>
                      <span class="sm:hidden">点击上传或粘贴文件</span>
                    </span>
                  </span>
                </p>
              </Motion>

              <!-- 粘贴提示 -->
              <Motion
                v-if="showPasteHint"
                layout
                :initial="{ opacity: 0, y: -10 }"
                :animate="{ opacity: 1, y: 0 }"
                :exit="{ opacity: 0 }"
                class="text-sm font-medium text-green-600 dark:text-green-400"
                :class="{
                  'mb-2 text-center': !currentFiles,
                  'mt-1 text-center sm:text-left': currentFiles > 0,
                }"
              >
                粘贴成功！
              </Motion>
            </div>

            <!-- 当有文件时，文件信息显示在右侧（桌面端）或底部（移动端） -->
            <!-- 只在多文件模式或需要显示文件信息时显示 -->
            <div v-if="currentFiles > 0 && shouldShowFileInfo" class="mt-2 sm:mt-0 sm:ml-auto">
              <FileUploadInfo
                :max-files="maxFiles"
                :current-files="currentFiles"
                :accepted-types="acceptedTypes"
                :compact="true"
              />
            </div>
          </div>

          <!-- 当没有文件时，文件信息显示在底部居中 -->
          <!-- 优化：单文件模式且没有特殊文件类型限制时，不显示文件信息 -->
          <div v-if="!currentFiles && shouldShowFileInfo" class="mt-3 flex justify-center">
            <FileUploadInfo
              :max-files="maxFiles"
              :current-files="currentFiles"
              :accepted-types="acceptedTypes"
              :compact="false"
            />
          </div>
        </div>
      </Motion>

      <!-- 文件预览区域 -->
      <div
        v-if="currentFiles > 0"
        class="w-full"
        :class="{
          'mt-3': maxFiles > 1, // 多文件模式保持间距
          'mt-0': maxFiles === 1, // 单文件模式无间距
        }"
      >
        <slot />
      </div>
      <div
        v-else
        class="w-full"
        :class="{
          'mt-4 sm:mt-6': true,
        }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Upload } from 'lucide-vue-next'
import { Motion } from 'motion-v'
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import { cn } from '@/lib/utils'
import FileUploadInfo from './FileUploadInfo.vue'
import type { AcceptedFileType } from './types'

// 网格背景配置 - 响应式调整
const ROWS = 11
const COLUMNS = computed(() => {
  // 根据屏幕尺寸调整列数
  if (typeof window !== 'undefined') {
    if (window.innerWidth < 640) return 15 // 小屏幕减少列数
    if (window.innerWidth < 1024) return 18 // 中等屏幕
    return 21 // 大屏幕
  }
  return 21
})

interface FileUploadZoneProps {
  class?: HTMLAttributes['class']
  /** 最大上传文件数量 */
  maxFiles: number
  /** 当前已上传文件数量 */
  currentFiles: number
  /** 允许上传的文件类型 */
  acceptedTypes?: AcceptedFileType
  /** 是否显示粘贴成功提示 */
  showPasteHint?: boolean
}

const props = withDefaults(defineProps<FileUploadZoneProps>(), {
  showPasteHint: false,
})

const emit = defineEmits<{
  (e: 'click'): void
  (e: 'enter'): void
  (e: 'leave'): void
  (e: 'drop', files: File[]): void
  (e: 'paste', files: File[]): void
}>()

// 拖拽状态
const isActive = ref<boolean>(false)

// 计算是否应该禁用上传
const isUploadDisabled = computed(() => {
  return props.currentFiles >= props.maxFiles
})

// 计算是否应该禁用点击（单文件模式特殊处理）
const shouldDisableClick = computed(() => {
  if (props.maxFiles === 1) {
    // 单文件模式：有文件时禁用点击
    return props.currentFiles > 0
  } else {
    // 多文件模式：达到上限时禁用点击
    return isUploadDisabled.value
  }
})

// 计算是否应该显示文件信息
const shouldShowFileInfo = computed(() => {
  // 多文件模式总是显示
  if (props.maxFiles > 1) return true

  // 单文件模式：只有在有特殊文件类型限制时才显示
  if (props.acceptedTypes && props.acceptedTypes !== '*') {
    // 如果是数组且不为空，显示
    if (Array.isArray(props.acceptedTypes) && props.acceptedTypes.length > 0) return true
    // 如果是字符串且不是通配符，显示
    if (typeof props.acceptedTypes === 'string' && props.acceptedTypes !== '*') return true
  }

  return false
})

function emitClick() {
  if (shouldDisableClick.value) return
  emit('click')
}

function handleEnter() {
  if (!shouldDisableClick.value) {
    isActive.value = true
    emit('enter')
  }
}

function handleLeave() {
  isActive.value = false
  emit('leave')
}

function handleDrop(e: DragEvent) {
  isActive.value = false

  // 单文件模式：如果已有文件，不允许拖拽
  if (props.maxFiles === 1 && props.currentFiles > 0) {
    return
  }

  // 多文件模式：检查是否达到上限
  if (props.maxFiles > 1 && isUploadDisabled.value) {
    return
  }

  const droppedFiles = e.dataTransfer?.files ? Array.from(e.dataTransfer.files) : []
  if (droppedFiles.length) emit('drop', droppedFiles)
}

// 处理粘贴事件
function handlePaste(e: ClipboardEvent) {
  // 单文件模式：如果已有文件，不允许粘贴
  if (props.maxFiles === 1 && props.currentFiles > 0) {
    return
  }

  // 多文件模式：检查是否达到上限
  if (props.maxFiles > 1 && isUploadDisabled.value) {
    return
  }

  // 获取粘贴的文件
  const items = e.clipboardData?.items
  if (!items) return

  const pastedFiles: File[] = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]

    // 处理图片粘贴（如截图）
    if (item.kind === 'file') {
      const file = item.getAsFile()
      if (file) {
        pastedFiles.push(file)
      }
    }
  }

  if (pastedFiles.length) {
    emit('paste', pastedFiles)
  }
}
</script>

<style scoped>
.transition-opacity {
  transition: opacity 0.3s ease;
}
</style>
