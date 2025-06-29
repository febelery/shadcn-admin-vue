<template>
  <div :class="cn('w-full rounded-lg border border-dashed border-neutral-200 dark:border-neutral-800', $props.class)">
    <!-- 文件上传区域 -->
    <FileUploadZone
      :max-files="props.maxFiles"
      :current-files="files.length"
      :accepted-types="props.acceptedTypes"
      :show-paste-hint="showPasteHint"
      @click="handleClick"
      @drop="handleDrop"
      @paste="handlePaste"
    >
      <!-- 文件预览区域 - 只有当有文件时才显示 -->
      <div v-if="files.length > 0" class="relative w-full">
        <!-- 单文件模式预览 - 铺满容器，无边框 -->
        <div v-if="props.maxFiles === 1" class="w-full">
          <Motion
            :key="`file-${0}`"
            :initial="{ opacity: 0, scale: 0.8 }"
            :animate="{ opacity: 1, scale: 1 }"
            :transition="{ type: 'spring', stiffness: 300, damping: 20 }"
            class="w-full"
          >
            <FileThumbnail
              :file="files[0]"
              :preview-url="getFilePreview(files[0])"
              :is-selected="currentFileIndex === 0"
              @click="openPreview(files[0], 0)"
              @remove="removeFile(0)"
              @retry="retryUpload(files[0])"
              class="aspect-video w-full overflow-hidden rounded-xl border-0"
            />
          </Motion>
        </div>

        <!-- 多文件模式网格布局 - 响应式网格 -->
        <div
          v-else
          class="xs:grid-cols-2 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          <Motion
            v-for="(file, idx) in files"
            :key="`file-${idx}`"
            :initial="{ opacity: 0, scale: 0.8 }"
            :animate="{ opacity: 1, scale: 1 }"
            :transition="{ type: 'spring', stiffness: 300, damping: 20 }"
          >
            <FileThumbnail
              :file="file"
              :preview-url="getFilePreview(file)"
              :is-selected="currentFileIndex === idx"
              @click="openPreview(file, idx)"
              @remove="removeFile(idx)"
              @retry="retryUpload(file)"
            />
          </Motion>
        </div>
      </div>
    </FileUploadZone>

    <!-- 文件上传输入 -->
    <input
      ref="fileInputRef"
      type="file"
      class="hidden"
      :multiple="props.maxFiles > 1"
      :accept="formatAcceptedTypes(props.acceptedTypes)"
      @change="onFileChange"
    />

    <!-- 预览组件 -->
    <FilePreview
      :is-open="previewOpen"
      :files="previewFiles"
      :current-index="currentFileIndex ?? 0"
      @close="closePreview"
      @navigate="handlePreviewNavigation"
      @download="(file, url) => downloadFile(files.find((f) => f.name === file.name))"
    />
  </div>
</template>

<script lang="ts" setup>
import { Motion } from 'motion-v'
import type { HTMLAttributes } from 'vue'
import { computed, ref, watch } from 'vue'
import { FilePreview, type FilePreviewItem } from '@/components/file-preview'
import { cn } from '@/lib/utils'
import FileThumbnail from './FileThumbnail.vue'
import FileUploadZone from './FileUploadZone.vue'
import { formatAcceptedTypes } from './fileUtils'
import type { AcceptedFileType } from './types'
import { useFileUpload } from './useFileUpload'

interface FileUploadProps {
  class?: HTMLAttributes['class']
  /** 最大上传文件数量，默认为1 */
  maxFiles?: number
  /** 允许上传的文件类型，使用FileType枚举或数组 */
  acceptedTypes?: AcceptedFileType
  /** v-model绑定值 */
  modelValue?: string | string[]
  /** 是否自动上传文件，默认为true */
  autoUpload?: boolean
  /** 是否使用七牛云上传，默认为true */
  useQiniu?: boolean
  /** 最大上传文件大小(字节)，默认为300MB */
  maxSize?: number
}

const props = withDefaults(defineProps<FileUploadProps>(), {
  maxFiles: 1,
  maxSize: 300 * 1024 * 1024,
  autoUpload: true,
  useQiniu: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | string[]): void
  (e: 'onProgress', percentage: number): void
  (e: 'onError', error: Error): void
}>()

// 文件上传输入引用
const fileInputRef = ref<HTMLInputElement | null>(null)

// 使用组合式API
const {
  files,
  isUploading,
  isUploadDisabled,
  previewOpen,
  currentFile,
  currentFileIndex,
  showPasteHint,
  validUploadedCount,
  hasFailedUploads,
  handleFileChange,
  uploadFile,
  retryUpload,
  removeFile,
  openPreview,
  closePreview,
  handlePreviewNavigation,
  getFilePreview,
  showPasteSuccess,
  downloadFile,
} = useFileUpload({
  maxFiles: props.maxFiles,
  acceptedTypes: props.acceptedTypes,
  maxSize: props.maxSize,
  autoUpload: props.autoUpload,
  useQiniu: props.useQiniu,
  modelValue: props.modelValue,
  onUpdateModelValue: (value) => emit('update:modelValue', value),
  onProgress: (percentage) => emit('onProgress', percentage),
  onError: (error) => emit('onError', error),
})

// 为预览组件准备数据
const previewFiles = computed((): FilePreviewItem[] => {
  return files.value.map((file) => ({
    file,
    url: getFilePreview(file),
  }))
})

// 监听maxFiles和acceptedTypes变化
watch(
  () => [props.maxFiles, props.acceptedTypes],
  ([newMaxFiles, newAcceptedTypes]) => {
    if (newMaxFiles !== undefined) {
      // TODO: 如果最大文件数量减少，需要处理已上传的文件
    }
  }
)

function handleClick() {
  // 单文件模式：如果已有文件，不允许点击上传
  if (props.maxFiles === 1 && files.value.length > 0) {
    return
  }

  // 多文件模式：检查是否达到上限
  if (props.maxFiles > 1 && isUploadDisabled.value) {
    return
  }

  fileInputRef.value?.click()
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files) return
  handleFileChange(Array.from(input.files))
  // 清理文件输入，以便允许再次选择相同文件
  input.value = ''
}

function handleDrop(files: File[]) {
  // 单文件模式：如果已有文件，不允许拖拽上传
  if (props.maxFiles === 1 && files.length > 0) {
    return
  }

  if (files.length) handleFileChange(files)
}

function handlePaste(files: File[]) {
  // 单文件模式：如果已有文件，不允许粘贴上传
  if (props.maxFiles === 1 && files.length > 0) {
    return
  }

  if (files.length) {
    handleFileChange(files)
    showPasteSuccess()
  }
}

// 暴露给父组件的方法和属性，用于验证
defineExpose({
  validUploadedCount,
  hasFailedUploads,
  files,
  isUploading,
})
</script>
