<template>
  <FormField v-slot="slotProps" :name="fieldName">
    <FormItem v-bind="$attrs">
      <AutoFormLabel v-if="!config?.hideLabel" :required="required">
        {{ config?.label || beautifyObjectName(label ?? fieldName) }}
      </AutoFormLabel>
      <FormControl>
        <slot v-bind="slotProps">
          <Editor
            :model-value="slotProps.componentField.modelValue || ''"
            @update:model-value="slotProps.componentField['onUpdate:modelValue']"
            :mode="config?.inputProps?.mode || 'full'"
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
import { Editor } from '@/components/editor'
import AutoFormLabel from './AutoFormLabel.vue'
import { beautifyObjectName } from './utils'

defineProps<FieldProps>()
</script>