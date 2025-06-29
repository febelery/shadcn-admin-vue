<script setup lang="ts" generic="U extends ZodAny">
import type { ZodAny } from 'zod'
import type { Config, ConfigItem, Shape } from './interface'
import { computed } from 'vue'
import { DEFAULT_ZOD_HANDLERS, INPUT_COMPONENTS } from './constant'
import useDependencies from './dependencies'
import { hasFileUploadConfig, getFileUploadConfig } from '@/lib/zod-file-extensions'

const props = defineProps<{
  fieldName: string
  shape: Shape
  config?: ConfigItem | Config<U>
}>()

function isValidConfig(config: any): config is ConfigItem {
  return !!config?.component
}

const delegatedProps = computed(() => {
  if (['ZodObject', 'ZodArray'].includes(props.shape?.type))
    return { schema: props.shape?.schema }
  return undefined
})

// 智能获取文件上传配置
const fileUploadProps = computed(() => {
  const schema = props.shape?.schema
  if (schema && hasFileUploadConfig(schema)) {
    return getFileUploadConfig(schema)
  }
  return null
})

// 合并配置：Zod schema 配置 + fieldConfig
const mergedConfig = computed(() => {
  const baseConfig = props.config || {}
  
  // 如果是文件上传字段，合并 Zod 配置
  if (fileUploadProps.value) {
    return {
      ...baseConfig,
      component: 'fileUpload',
      inputProps: {
        ...fileUploadProps.value,
        ...(baseConfig as ConfigItem)?.inputProps,
      },
    } as ConfigItem
  }
  
  return baseConfig
})

const { isDisabled, isHidden, isRequired, overrideOptions } = useDependencies(props.fieldName)

// 智能验证逻辑：检查是否应该显示错误状态
const shouldShowError = (meta: any) => {
  return meta.touched && !meta.valid
}

// 智能验证逻辑：检查是否应该实时验证
const shouldValidateOnInput = (meta: any) => {
  return meta.touched && meta.valid === false
}
</script>

<template>
  <component
    :is="isValidConfig(mergedConfig)
      ? typeof mergedConfig.component === 'string'
        ? INPUT_COMPONENTS[mergedConfig.component!]
        : mergedConfig.component
      : INPUT_COMPONENTS[DEFAULT_ZOD_HANDLERS[shape.type]] "
    v-if="!isHidden"
    :field-name="fieldName"
    :label="shape.schema?.description"
    :required="isRequired || shape.required"
    :options="overrideOptions || shape.options"
    :disabled="isDisabled"
    :config="mergedConfig"
    :should-show-error="shouldShowError"
    :should-validate-on-input="shouldValidateOnInput"
    :data-field="fieldName"
    v-bind="delegatedProps"
  >
    <slot />
  </component>
</template>