<script setup lang="ts">
import type { FieldProps } from './interface'
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import AutoFormLabel from './AutoFormLabel.vue'
import { beautifyObjectName, maybeBooleanishToBoolean } from './utils'

defineProps<FieldProps & {
  options?: string[]
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
</script>

<template>
  <FormField v-slot="slotProps" :name="fieldName">
    <FormItem>
      <AutoFormLabel v-if="!config?.hideLabel" :required="required">
        {{ config?.label || beautifyObjectName(label ?? fieldName) }}
      </AutoFormLabel>
      <FormControl>
        <slot v-bind="slotProps">
          <RadioGroup v-if="config?.component === 'radio'" :disabled="maybeBooleanishToBoolean(config?.inputProps?.disabled) ?? disabled" :orientation="'vertical'" v-bind="{ ...slotProps.componentField }">
            <div v-for="(option, index) in options" :key="option" class="mb-2 flex items-center gap-3 space-y-0">
              <RadioGroupItem :id="`${option}-${index}`" :value="option" />
              <Label :for="`${option}-${index}`">{{ getOptionLabel(fieldName, option) }}</Label>
            </div>
          </RadioGroup>

          <Select v-else :disabled="maybeBooleanishToBoolean(config?.inputProps?.disabled) ?? disabled" v-bind="{ ...slotProps.componentField }">
            <SelectTrigger class="w-full">
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
      <FormMessage />
    </FormItem>
  </FormField>
</template>