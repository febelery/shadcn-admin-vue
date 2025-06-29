<script setup lang="ts" generic="T extends ZodObjectOrWrapped">
import type { FormContext, GenericObject } from 'vee-validate'
import type { z, ZodAny } from 'zod'
import type { Config, ConfigItem, Dependency, Shape } from './interface'
import { Form } from '@/components/ui/form'
import { toTypedSchema } from '@vee-validate/zod'
import { computed, toRefs, onMounted, nextTick } from 'vue'
import AutoFormField from './AutoFormField.vue'
import { provideDependencies } from './dependencies'
import { getBaseSchema, getBaseType, getDefaultValueInZodStack, getObjectFormSchema, type ZodObjectOrWrapped } from './utils'
import { configure } from 'vee-validate'

const props = defineProps<{
  schema: T
  form?: FormContext<GenericObject>
  fieldConfig?: Config<z.infer<T>>
  dependencies?: Dependency<z.infer<T>>[]
}>()

const emits = defineEmits<{
  submit: [event: z.infer<T>]
}>()

// 在组件内部配置验证时机
onMounted(() => {
  configure({
    validateOnBlur: true,      // 失焦时验证
    validateOnChange: false,   // 输入时不验证（避免干扰用户）
    validateOnInput: false,    // 输入时不验证
    validateOnModelUpdate: true, // 当字段已被触摸过且有错误时，输入时实时验证
    bails: false, // 不在第一个错误时停止验证
  })
})

const { dependencies } = toRefs(props)
provideDependencies(dependencies)

const shapes = computed(() => {
  // @ts-expect-error ignore {} not assignable to object
  const val: { [key in keyof T]: Shape } = {}
  const baseSchema = getObjectFormSchema(props.schema)
  const shape = baseSchema.shape
  Object.keys(shape).forEach((name) => {
    const item = shape[name] as ZodAny
    const baseItem = getBaseSchema(item) as ZodAny
    let options = (baseItem && 'values' in baseItem._def) ? baseItem._def.values as string[] : undefined
    if (!Array.isArray(options) && typeof options === 'object')
      options = Object.values(options)

    val[name as keyof T] = {
      type: getBaseType(item),
      default: getDefaultValueInZodStack(item),
      options,
      required: !['ZodOptional', 'ZodNullable'].includes(item._def.typeName),
      schema: baseItem,
    }
  })
  return val
})

const fields = computed(() => {
  // @ts-expect-error ignore {} not assignable to object
  const val: { [key in keyof z.infer<T>]: { shape: Shape, fieldName: string, config: ConfigItem } } = {}
  for (const key in shapes.value) {
    const shape = shapes.value[key]
    val[key as keyof z.infer<T>] = {
      shape,
      config: props.fieldConfig?.[key] as ConfigItem,
      fieldName: key,
    }
  }
  return val
})

// 滚动到第一个错误字段的函数
const scrollToFirstError = async (errors: Record<string, any>) => {
  await nextTick()
  
  // 获取所有错误字段名
  const errorFields = Object.keys(errors)
  if (errorFields.length === 0) return

  // 按照字段在表单中的顺序排序
  const fieldOrder = Object.keys(shapes.value)
  const sortedErrorFields = errorFields.sort((a, b) => {
    const indexA = fieldOrder.indexOf(a)
    const indexB = fieldOrder.indexOf(b)
    return indexA - indexB
  })

  const firstErrorField = sortedErrorFields[0]
  
  // 查找对应的 DOM 元素
  const errorElement = document.querySelector(`[name="${firstErrorField}"]`) ||
                      document.querySelector(`[data-field="${firstErrorField}"]`) ||
                      document.querySelector(`#${firstErrorField}`) ||
                      document.querySelector(`[for="${firstErrorField}"]`)?.closest('[data-slot="form-item"]')

  if (errorElement) {
    // 滚动到错误元素
    errorElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    })

    // 聚焦到输入元素（如果可聚焦）
    const focusableElement = errorElement.matches('input, textarea, select, button') 
      ? errorElement as HTMLElement
      : errorElement.querySelector('input, textarea, select, button') as HTMLElement

    if (focusableElement && typeof focusableElement.focus === 'function') {
      setTimeout(() => {
        focusableElement.focus()
      }, 300) // 等待滚动动画完成
    }
  }
}

const formComponent = computed(() => props.form ? 'form' : Form)
const formComponentProps = computed(() => {
  if (props.form) {
    return {
      onSubmit: props.form.handleSubmit(
        (val) => emits('submit', val),
        (errors) => scrollToFirstError(errors)
      ),
    };
  }
  else {
    const formSchema = toTypedSchema(props.schema)
    return {
      keepValues: true,
      validationSchema: formSchema,
      onSubmit: (val: GenericObject) => emits('submit', val),
      onInvalidSubmit: (errors: any) => scrollToFirstError(errors.errors),
    };
  }
})
</script>

<template>
  <component
    :is="formComponent"
    v-bind="formComponentProps"
  >
    <slot name="customAutoForm" :fields="fields">
      <template v-for="(shape, key) of shapes" :key="key">
        <slot
          :shape="shape"
          :name="key.toString() as keyof z.infer<T>"
          :field-name="key.toString()"
          :config="fieldConfig?.[key as keyof typeof fieldConfig] as ConfigItem"
        >
          <AutoFormField
            :config="fieldConfig?.[key as keyof typeof fieldConfig] as ConfigItem"
            :field-name="key.toString()"
            :shape="shape"
          />
        </slot>
      </template>
    </slot>

    <slot :shapes="shapes" />
  </component>
</template>