<script setup lang="ts">
import type { FieldProps } from './interface'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { computed } from 'vue'
import AutoFormLabel from './AutoFormLabel.vue'
import { beautifyObjectName, maybeBooleanishToBoolean } from './utils'

const props = defineProps<FieldProps & {
  shouldShowError?: (meta: any) => boolean
  shouldValidateOnInput?: (meta: any) => boolean
}>()

const booleanComponent = computed(() => props.config?.component === 'switch' ? Switch : Checkbox)

// 默认的错误显示逻辑
const defaultShouldShowError = (meta: any) => meta.touched && !meta.valid
const shouldShowError = props.shouldShowError || defaultShouldShowError
</script>

<template>
  <FormField v-slot="slotProps" :name="fieldName">
    <FormItem :data-field="fieldName">
      <div class="space-y-0 mb-3 flex items-center gap-3">
        <FormControl>
          <slot v-bind="slotProps">
            <component
              :is="booleanComponent"
              :id="fieldName"
              :name="fieldName"
              :disabled="maybeBooleanishToBoolean(config?.inputProps?.disabled) ?? disabled"
              :model-value="slotProps.componentField.modelValue"
              :aria-invalid="shouldShowError(slotProps.meta) ? 'true' : 'false'"
              @update:model-value="slotProps.componentField['onUpdate:modelValue']"
              @blur="slotProps.handleBlur"
            />
          </slot>
        </FormControl>
        <AutoFormLabel 
          v-if="!config?.hideLabel" 
          :required="required"
          :should-show-error="shouldShowError(slotProps.meta)"
          :for="fieldName"
        >
          {{ config?.label || beautifyObjectName(label ?? fieldName) }}
        </AutoFormLabel>
      </div>

      <FormDescription v-if="config?.description">
        {{ config.description }}
      </FormDescription>
      <!-- 使用智能错误显示逻辑 -->
      <FormMessage v-if="shouldShowError(slotProps.meta)" />
    </FormItem>
  </FormField>
</template>