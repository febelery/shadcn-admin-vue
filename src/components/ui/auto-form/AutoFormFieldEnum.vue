<script setup lang="ts">
import type { FieldProps } from './interface'
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import AutoFormLabel from './AutoFormLabel.vue'
import { beautifyObjectName, maybeBooleanishToBoolean } from './utils'

const props = defineProps<FieldProps & {
  options?: string[]
  shouldShowError?: (meta: any) => boolean
  shouldValidateOnInput?: (meta: any) => boolean
}>()

// 定义选项映射
const optionMappings: Record<string, Record<string, string>> = {
  role: {
    admin: '管理员',
    editor: '编辑',
    user: '用户',
  },
  status: {
    active: '活跃',
    inactive: '禁用',
  },
  category: {
    tech: '技术',
    tools: '工具',
    tutorial: '教程',
    news: '资讯',
  },
  timezone: {
    'Asia/Shanghai': '北京时间 (UTC+8)',
    'Asia/Tokyo': '东京时间 (UTC+9)',
    'America/New_York': '纽约时间 (UTC-5)',
    'Europe/London': '伦敦时间 (UTC+0)',
  },
  language: {
    'zh-CN': '简体中文',
    'en-US': 'English',
    'ja-JP': '日本語',
  },
}

// 获取选项显示文本
function getOptionLabel(fieldName: string, value: string): string {
  return optionMappings[fieldName]?.[value] || beautifyObjectName(value)
}

// 默认的错误显示逻辑
const defaultShouldShowError = (meta: any) => meta.touched && !meta.valid
const shouldShowError = props.shouldShowError || defaultShouldShowError
</script>

<template>
  <FormField v-slot="slotProps" :name="fieldName">
    <FormItem :data-field="fieldName">
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
          <RadioGroup 
            v-if="config?.component === 'radio'" 
            :disabled="maybeBooleanishToBoolean(config?.inputProps?.disabled) ?? disabled" 
            :orientation="'vertical'" 
            v-bind="{ ...slotProps.componentField }"
            :name="fieldName"
            @blur="slotProps.handleBlur"
          >
            <div v-for="(option, index) in options" :key="option" class="mb-2 flex items-center gap-3 space-y-0">
              <RadioGroupItem :id="`${option}-${index}`" :value="option" />
              <Label :for="`${option}-${index}`">{{ getOptionLabel(fieldName, option) }}</Label>
            </div>
          </RadioGroup>

          <Select 
            v-else 
            :disabled="maybeBooleanishToBoolean(config?.inputProps?.disabled) ?? disabled" 
            v-bind="{ ...slotProps.componentField }"
            :name="fieldName"
            @blur="slotProps.handleBlur"
          >
            <SelectTrigger 
              :id="fieldName"
              class="w-full"
              :aria-invalid="shouldShowError(slotProps.meta) ? 'true' : 'false'"
            >
              <SelectValue :placeholder="config?.inputProps?.placeholder || '请选择'" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="option in options" :key="option" :value="option">
                {{ getOptionLabel(fieldName, option) }}
              </SelectItem>
            </SelectContent>
          </Select>
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