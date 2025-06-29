<template>
  <FormField v-slot="slotProps" :name="fieldName">
    <FormItem v-bind="$attrs" :data-field="fieldName">
      <AutoFormLabel 
        v-if="!config?.hideLabel" 
        :required="required"
        :should-show-error="shouldShowError(slotProps.meta)"
        :for="fieldName"
      >
        {{ config?.label || beautifyObjectName(label ?? fieldName) }}
      </AutoFormLabel>
      <FormControl>
        <slot v-bind="slotProps">
          <FileUpload
            :id="fieldName"
            :name="fieldName"
            :model-value="slotProps.componentField.modelValue || ''"
            @update:model-value="handleModelValueUpdate"
            :max-files="config?.inputProps?.maxFiles || 1"
            :accepted-types="config?.inputProps?.acceptedTypes"
            :max-size="config?.inputProps?.maxSize"
            :auto-upload="config?.inputProps?.autoUpload ?? true"
            :use-qiniu="config?.inputProps?.useQiniu ?? true"
            :class="config?.inputProps?.class"
            :disabled="config?.inputProps?.disabled ?? disabled"
            :aria-invalid="shouldShowError(slotProps.meta) ? 'true' : 'false'"
            @blur="slotProps.handleBlur"
            @on-progress="handleProgress"
            @on-error="handleError"
            ref="fileUploadRef"
          />
        </slot>
      </FormControl>
      <FormDescription v-if="config?.description">
        {{ config.description }}
      </FormDescription>
      <!-- 使用智能错误显示逻辑 -->
      <FormMessage v-if="shouldShowError(slotProps.meta)" />
    </FormItem>
  </FormField>
</template>

<script setup lang="ts">
import type { FieldProps } from './interface'
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { FileUpload } from '@/components/file-upload'
import AutoFormLabel from './AutoFormLabel.vue'
import { beautifyObjectName } from './utils'
import { ref, computed } from 'vue'

const props = defineProps<FieldProps & {
  shouldShowError?: (meta: any) => boolean
  shouldValidateOnInput?: (meta: any) => boolean
}>()

const fileUploadRef = ref()

// 默认的错误显示逻辑
const defaultShouldShowError = (meta: any) => meta.touched && !meta.valid
const shouldShowError = props.shouldShowError || defaultShouldShowError

// 增强的验证逻辑：考虑文件上传状态
const enhancedShouldShowError = computed(() => {
  return (meta: any) => {
    // 基础验证逻辑
    const basicValidation = shouldShowError(meta)
    
    // 如果基础验证通过，还需要检查文件上传状态
    if (!basicValidation && fileUploadRef.value) {
      const uploadComponent = fileUploadRef.value
      
      // 如果字段是必填的，但没有成功上传的文件，应该显示错误
      if (props.required) {
        const hasValidFiles = uploadComponent.validUploadedCount > 0
        const hasFailedUploads = uploadComponent.hasFailedUploads
        
        // 如果没有有效文件，或者有上传失败的文件，且用户已经交互过
        if (meta.touched && (!hasValidFiles || hasFailedUploads)) {
          return true
        }
      }
    }
    
    return basicValidation
  }
})

const handleModelValueUpdate = (value: string | string[]) => {
  // 直接传递给表单字段
  const event = { target: { value } }
  // 这里需要从 slotProps 中获取正确的更新函数
  // 由于我们在模板中，我们需要通过 emit 或其他方式处理
  emit('update:modelValue', value)
}

const handleProgress = (percentage: number) => {
  // 可以在这里处理进度更新
}

const handleError = (error: Error) => {
  // 可以在这里处理错误
  console.error('File upload error:', error)
}

const emit = defineEmits(['update:modelValue'])
</script>