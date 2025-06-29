<script setup lang="ts">
import { FormLabel } from '@/components/ui/form'

const props = defineProps<{
  required?: boolean
  shouldShowError?: boolean
}>()
</script>

<template>
  <FormLabel :data-error="shouldShowError">
    <slot />
    <span v-if="required" class="text-destructive"> *</span>
  </FormLabel>
</template>