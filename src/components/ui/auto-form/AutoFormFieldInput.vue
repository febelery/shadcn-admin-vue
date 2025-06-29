<script setup lang="ts">
import type { FieldProps } from './interface'
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { computed } from 'vue'
import AutoFormLabel from './AutoFormLabel.vue'
import { beautifyObjectName } from './utils'

const props = defineProps<FieldProps & {
  shouldShowError?: (meta: any) => boolean
  shouldValidateOnInput?: (meta: any) => boolean
}>()

const inputComponent = computed(() => props.config?.component === 'textarea' ? Textarea : Input)

// 默认的错误显示逻辑
const defaultShouldShowError = (meta: any) => meta.touched && !meta.valid
const shouldShowError = props.shouldShowError || defaultShouldShowError
</script>

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
          <component
            :is="inputComponent"
            :id="fieldName"
            type="text"
            v-bind="{ 
              ...slotProps.componentField, 
              ...config?.inputProps,
            }"
            :disabled="config?.inputProps?.disabled ?? disabled"
            :aria-invalid="shouldShowError(slotProps.meta) ? 'true' : 'false'"
            @blur="slotProps.handleBlur"
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