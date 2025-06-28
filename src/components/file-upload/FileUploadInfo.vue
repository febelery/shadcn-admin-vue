<template>
  <div class="flex justify-center">
    <!-- 简洁信息展示 - 确保内容居中 -->
    <div
      class="inline-flex flex-wrap items-center text-neutral-500 dark:text-neutral-400"
      :class="{ 
        'gap-2 sm:gap-3': !compact, 
        'gap-1 sm:gap-2': compact 
      }"
    >
      <!-- 文件数量信息 -->
      <div class="inline-flex items-center gap-1" :class="{ 'text-amber-600 dark:text-amber-400': isFull }">
        <Files
          :class="{
            'size-3 sm:size-3.5': !compact,
            'size-2.5 sm:size-3': compact,
            'opacity-70': !isFull,
          }"
        />
        <span
          :class="{
            'text-xs sm:text-sm': !compact,
            'text-xs': compact,
          }"
        >
          {{ currentFiles }}/{{ maxFiles }}
        </span>
      </div>

      <!-- 文件类型限制 -->
      <div v-if="acceptedTypes && acceptedTypes.length > 0" class="inline-flex items-center gap-1">
        <div class="h-3 w-px bg-neutral-200 dark:bg-neutral-700" v-if="!compact"></div>

        <FileTypeIcon class="opacity-70" :class="{ 
          'size-3 sm:size-3.5': !compact, 
          'size-2.5 sm:size-3': compact 
        }" />
        <span
          class="truncate max-w-[120px] sm:max-w-none"
          :class="{
            'text-xs sm:text-sm': !compact,
            'text-xs': compact,
          }"
        >
          {{ formatAcceptedTypes }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileTypeIcon, Files } from 'lucide-vue-next'
import { computed } from 'vue'
import { FileTypeFriendlyNames } from './types'
import type { AcceptedFileType, FileType } from './types'

// Props
interface Props {
  maxFiles: number
  currentFiles: number
  acceptedTypes?: AcceptedFileType
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
})

// Computed
const isFull = computed(() => {
  return props.currentFiles >= props.maxFiles
})

const formatAcceptedTypes = computed(() => {
  if (!props.acceptedTypes) return '所有文件'

  const types = Array.isArray(props.acceptedTypes) ? props.acceptedTypes : [props.acceptedTypes]

  // 处理每种类型，转换为友好名称
  const friendlyNames = types.map((type) => FileTypeFriendlyNames[type as FileType] || type)
  
  // 在移动端显示简化版本
  if (friendlyNames.length > 2) {
    return `${friendlyNames.slice(0, 2).join(', ')}等`
  }
  
  return friendlyNames.join(', ')
})
</script>