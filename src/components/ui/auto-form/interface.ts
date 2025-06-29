import type { z } from 'zod'
import type { Component } from 'vue'

export interface Shape {
  type: string
  default?: any
  required?: boolean
  options?: string[]
  schema?: z.ZodTypeAny
}

export interface FieldProps {
  fieldName: string
  label?: string
  required?: boolean
  disabled?: boolean
  config?: ConfigItem
}

export interface ConfigItem {
  component?: keyof InputComponents | Component
  label?: string
  description?: string
  hideLabel?: boolean
  inputProps?: Record<string, any>
}

export type Config<T> = Partial<Record<keyof T, ConfigItem>>

export interface InputComponents {
  date: Component
  select: Component
  radio: Component
  checkbox: Component
  switch: Component
  textarea: Component
  number: Component
  string: Component
  file: Component
  fileUpload: Component
  array: Component
  object: Component
  editor: Component
}

export interface Dependency<T> {
  sourceField: keyof T
  targetField: keyof T
  when: (sourceValue: any, targetValue: any) => boolean
  type: DependencyType
  options?: EnumValues
}

export enum DependencyType {
  DISABLES = 'disables',
  REQUIRES = 'requires',
  HIDES = 'hides',
  SETS_OPTIONS = 'sets_options',
}

export type EnumValues = readonly string[]
