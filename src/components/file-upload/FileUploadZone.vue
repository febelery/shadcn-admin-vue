<template>
  <div
    class="relative block w-full cursor-pointer overflow-hidden rounded-xl transition-all duration-300"
    :class="{
      'cursor-not-allowed': isUploadDisabled,
      'p-6 sm:p-8': !currentFiles,
      'p-4 sm:p-5': currentFiles > 0,
    }"
    @click="emitClick"
    @dragover.prevent="handleEnter"
    @dragleave="handleLeave"
    @drop.prevent="handleDrop"
    @mouseover="handleEnter"
    @mouseleave="handleLeave"
    @paste.prevent="handlePaste"
  >
    <!-- 网格背景 -->
    <div
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
                  'flex h-10 w-10 flex-shrink-0 rounded-[2px]',
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

    <!-- 内容区域 - 移除卡片效果，保持透明 -->
    <div class="flex flex-col items-center justify-center">
      <!-- 信息区域 -->
      <Motion
        layout
        class="relative z-20 w-full"
        :class="{ 'max-w-md': !currentFiles, 'max-w-full': currentFiles > 0 }"
        :initial="{ opacity: 0, y: 10 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ type: 'spring', stiffness: 300, damping: 25 }"
      >
        <div layout class="transition-all duration-300">
          <div class="flex items-center" :class="{ 'flex-col': !currentFiles, 'flex-row': currentFiles > 0 }">
            <!-- 上传图标 -->
            <Motion
              layout
              :animate="isActive && !isUploadDisabled ? { scale: 1.05 } : {}"
              :transition="{ type: 'spring', stiffness: 300, damping: 20 }"
              :class="{ 'mb-3': !currentFiles, 'mr-3': currentFiles > 0 }"
            >
              <div
                class="flex items-center justify-center rounded-full"
                :class="{
                  'mb-2 size-14 bg-neutral-100 dark:bg-neutral-800': !currentFiles,
                  'size-10 bg-neutral-100 dark:bg-neutral-800': currentFiles > 0,
                  'bg-amber-100 dark:bg-amber-900/20': isUploadDisabled,
                }"
              >
                <Upload
                  :class="{
                    'size-6': !currentFiles,
                    'size-4': currentFiles > 0,
                    'text-neutral-500 dark:text-neutral-400': true,
                    'text-amber-600 dark:text-amber-400': isUploadDisabled,
                    'text-neutral-700 dark:text-neutral-300': isActive && !isUploadDisabled,
                  }"
                />
              </div>
            </Motion>

            <!-- 上传状态提示和文件信息 -->
            <div class="flex-1" :class="{ 'text-center': !currentFiles, 'text-left': currentFiles > 0 }">
              <Motion layout :transition="{ type: 'spring', stiffness: 300, damping: 20 }">
                <p class="font-medium text-neutral-700 dark:text-neutral-200" :class="{ 'text-sm': currentFiles > 0 }">
                  <span v-if="isUploadDisabled" class="text-amber-600 dark:text-amber-400">已达到最大上传数量</span>
                  <span v-else-if="currentFiles > 0">继续添加文件</span>
                  <span v-else>上传文件</span>
                </p>
                <p
                  class="text-neutral-500 dark:text-neutral-400"
                  :class="{ 'mt-1 text-sm': !currentFiles, 'text-xs': currentFiles > 0 }"
                >
                  <span v-if="!isUploadDisabled">将文件拖放到此处、单击上传或粘贴(Ctrl+V)</span>
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
                :class="{ 'mb-2 text-center': !currentFiles, 'mt-1': currentFiles > 0 }"
              >
                粘贴成功！
              </Motion>
            </div>

            <!-- 当有文件时，文件信息显示在右侧 -->
            <div v-if="currentFiles > 0" class="ml-auto">
              <FileUploadInfo
                :max-files="maxFiles"
                :current-files="currentFiles"
                :accepted-types="acceptedTypes"
                :compact="true"
              />
            </div>
          </div>

          <!-- 当没有文件时，文件信息显示在底部居中 -->
          <div v-if="!currentFiles" class="mt-3 flex justify-center">
            <FileUploadInfo
              :max-files="maxFiles"
              :current-files="currentFiles"
              :accepted-types="acceptedTypes"
              :compact="false"
            />
          </div>
        </div>

        <!-- 拖放状态指示 - 只在拖拽状态显示微妙的覆盖层 -->
      </Motion>

      <!-- 文件预览区域 -->
      <div v-if="currentFiles > 0" class="mt-3 w-full">
        <slot />
      </div>
      <div v-else class="mt-6 w-full">
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

// 网格背景配置
const ROWS = 11
const COLUMNS = 21

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

function emitClick() {
  if (isUploadDisabled.value) return
  emit('click')
}

function handleEnter() {
  isActive.value = true
  emit('enter')
}

function handleLeave() {
  isActive.value = false
  emit('leave')
}

function handleDrop(e: DragEvent) {
  isActive.value = false
  // 如果已经达到最大文件数量，则不接受拖放文件
  if (isUploadDisabled.value) return

  const droppedFiles = e.dataTransfer?.files ? Array.from(e.dataTransfer.files) : []
  if (droppedFiles.length) emit('drop', droppedFiles)
}

// 处理粘贴事件
function handlePaste(e: ClipboardEvent) {
  // 如果已经达到最大文件数量，则不接受粘贴文件
  if (isUploadDisabled.value) return

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
