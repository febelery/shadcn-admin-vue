<template>
  <FormField v-slot="slotProps" :name="fieldName">
    <FormItem v-bind="$attrs">
      <AutoFormLabel v-if="!config?.hideLabel" :required="required">
        {{ config?.label || beautifyObjectName(label ?? fieldName) }}
      </AutoFormLabel>
      <FormControl>
        <slot v-bind="slotProps">
          <FileUpload
            :model-value="slotProps.componentField.modelValue || ''"
            @update:model-value="slotProps.componentField['onUpdate:modelValue']"
            :max-files="config?.inputProps?.maxFiles || 1"
            :accepted-types="config?.inputProps?.acceptedTypes"
            :max-size="config?.inputProps?.maxSize"
            :auto-upload="config?.inputProps?.autoUpload ?? true"
            :use-qiniu="config?.inputProps?.useQiniu ?? true"
            :class="config?.inputProps?.class"
            :disabled="config?.inputProps?.disabled ?? disabled"
          />
        </slot>
      </FormControl>
      <FormDescription v-if="config?.description">
        {{ config.description }}
      </FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>

<script setup lang="ts">
import type { FieldProps } from './interface'
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { FileUpload } from '@/components/file-upload'
import AutoFormLabel from './AutoFormLabel.vue'
import { beautifyObjectName } from './utils'

defineProps<FieldProps>()
</script>