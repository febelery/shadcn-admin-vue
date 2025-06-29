import { z } from 'zod'
import type { AcceptedFileType } from '@/components/file-upload/types'

// 文件上传配置选项
export interface FileUploadOptions {
  /** 最大文件数量，默认为 1 */
  maxFiles?: number
  /** 允许的文件类型 */
  acceptedTypes?: AcceptedFileType
  /** 最大文件大小（字节） */
  maxSize?: number
  /** 是否自动上传，默认为 true */
  autoUpload?: boolean
  /** 是否使用七牛云，默认为 true */
  useQiniu?: boolean
  /** 自定义 CSS 类名 */
  className?: string
}

// 文件上传标识符
const FILE_UPLOAD_SYMBOL = Symbol('fileUpload')

// 根据文件类型获取默认最大大小
function getDefaultMaxSize(acceptedTypes?: AcceptedFileType): number {
  if (!acceptedTypes) return 100 * 1024 * 1024 // 默认 100MB

  const types = Array.isArray(acceptedTypes) ? acceptedTypes : [acceptedTypes]
  const typeStr = types.join(',').toLowerCase()

  // 图片类型 - 10MB
  if (typeStr.includes('image')) {
    return 10 * 1024 * 1024
  }

  // 视频类型 - 200MB
  if (typeStr.includes('video')) {
    return 200 * 1024 * 1024
  }

  // 文档类型 - 20MB
  if (
    typeStr.includes('pdf') ||
    typeStr.includes('word') ||
    typeStr.includes('excel') ||
    typeStr.includes('document')
  ) {
    return 20 * 1024 * 1024
  }

  // 默认 - 100MB
  return 100 * 1024 * 1024
}

// 自定义 ZodFileUpload 类型
export class ZodFileUpload extends z.ZodString {
  readonly _def: z.ZodStringDef & {
    [FILE_UPLOAD_SYMBOL]: FileUploadOptions
  }

  constructor(def: z.ZodStringDef & { [FILE_UPLOAD_SYMBOL]: FileUploadOptions }) {
    super(def)
    this._def = def
  }

  // 重写 create 方法，使其与父类兼容
  static override create(params?: z.RawCreateParams & { fileUploadOptions?: FileUploadOptions }): ZodFileUpload {
    const { fileUploadOptions, ...baseParams } = params || {}
    const baseDef = z.ZodString.create(baseParams)._def

    return new ZodFileUpload({
      ...baseDef,
      [FILE_UPLOAD_SYMBOL]: {
        maxFiles: 1,
        maxSize: getDefaultMaxSize(),
        autoUpload: true,
        useQiniu: true,
        ...fileUploadOptions,
      },
    })
  }

  // 创建文件上传实例的静态方法
  static createFileUpload(options: FileUploadOptions = {}): ZodFileUpload {
    const baseDef = z.ZodString.create()._def
    const defaultMaxSize = getDefaultMaxSize(options.acceptedTypes)

    return new ZodFileUpload({
      ...baseDef,
      [FILE_UPLOAD_SYMBOL]: {
        maxFiles: 1,
        maxSize: defaultMaxSize,
        autoUpload: true,
        useQiniu: true,
        ...options,
      },
    })
  }

  // 获取文件上传配置
  getFileUploadOptions(): FileUploadOptions {
    return this._def[FILE_UPLOAD_SYMBOL]
  }

  // 检查是否为文件上传类型
  isFileUpload(): boolean {
    return FILE_UPLOAD_SYMBOL in this._def
  }

  // === Zod 原生风格的链式调用方法 ===

  /**
   * 设置最大文件数量 - 类似 z.max()
   * @param count 最大文件数量
   */
  max(count: number): ZodFileUpload {
    return new ZodFileUpload({
      ...this._def,
      [FILE_UPLOAD_SYMBOL]: {
        ...this._def[FILE_UPLOAD_SYMBOL],
        maxFiles: count,
      },
    })
  }

  /**
   * 设置文件大小限制 - 类似 z.string().length()
   * @param size 最大文件大小（字节）
   */
  size(size: number): ZodFileUpload {
    return new ZodFileUpload({
      ...this._def,
      [FILE_UPLOAD_SYMBOL]: {
        ...this._def[FILE_UPLOAD_SYMBOL],
        maxSize: size,
      },
    })
  }

  /**
   * 设置允许的文件类型 - 类似 z.enum()
   * @param types 允许的文件类型
   */
  accept(types: AcceptedFileType): ZodFileUpload {
    // 根据文件类型智能设置默认大小
    const currentOptions = this._def[FILE_UPLOAD_SYMBOL]
    const newMaxSize =
      currentOptions.maxSize === getDefaultMaxSize() ? getDefaultMaxSize(types) : currentOptions.maxSize

    return new ZodFileUpload({
      ...this._def,
      [FILE_UPLOAD_SYMBOL]: {
        ...currentOptions,
        acceptedTypes: types,
        maxSize: newMaxSize,
      },
    })
  }

  /**
   * 设置是否自动上传
   * @param enabled 是否启用自动上传
   */
  auto(enabled: boolean = true): ZodFileUpload {
    return new ZodFileUpload({
      ...this._def,
      [FILE_UPLOAD_SYMBOL]: {
        ...this._def[FILE_UPLOAD_SYMBOL],
        autoUpload: enabled,
      },
    })
  }

  /**
   * 设置是否使用七牛云
   * @param enabled 是否使用七牛云
   */
  qiniu(enabled: boolean = true): ZodFileUpload {
    return new ZodFileUpload({
      ...this._def,
      [FILE_UPLOAD_SYMBOL]: {
        ...this._def[FILE_UPLOAD_SYMBOL],
        useQiniu: enabled,
      },
    })
  }

  // === 兼容旧版本的方法（可选） ===
  maxFiles(count: number): ZodFileUpload {
    return this.max(count)
  }

  maxSize(size: number): ZodFileUpload {
    return this.size(size)
  }

  acceptedTypes(types: AcceptedFileType): ZodFileUpload {
    return this.accept(types)
  }

  autoUpload(enabled: boolean = true): ZodFileUpload {
    return this.auto(enabled)
  }

  useQiniu(enabled: boolean = true): ZodFileUpload {
    return this.qiniu(enabled)
  }

  className(name: string): ZodFileUpload {
    return new ZodFileUpload({
      ...this._def,
      [FILE_UPLOAD_SYMBOL]: {
        ...this._def[FILE_UPLOAD_SYMBOL],
        className: name,
      },
    })
  }
}

// 扩展的 ZodArray 类型，用于处理文件上传数组
export class ZodFileUploadArray extends z.ZodArray<any> {
  readonly _def: z.ZodArrayDef & {
    [FILE_UPLOAD_SYMBOL]: FileUploadOptions
  }

  constructor(def: z.ZodArrayDef & { [FILE_UPLOAD_SYMBOL]: FileUploadOptions }) {
    super(def)
    this._def = def
  }

  // 获取文件上传配置
  getFileUploadOptions(): FileUploadOptions {
    return this._def[FILE_UPLOAD_SYMBOL]
  }

  // 检查是否为文件上传类型
  isFileUpload(): boolean {
    return FILE_UPLOAD_SYMBOL in this._def
  }

  // 重写 max 方法以保持类型兼容性
  override max(maxLength: number, message?: string): this {
    const newDef = {
      ...this._def,
      maxLength: { value: maxLength, message },
      [FILE_UPLOAD_SYMBOL]: {
        ...this._def[FILE_UPLOAD_SYMBOL],
        maxFiles: maxLength,
      },
    }

    // 使用 this.constructor 来确保返回正确的类型
    return new (this.constructor as any)(newDef) as this
  }

  // 文件上传特有的方法
  size(size: number): ZodFileUploadArray {
    return new ZodFileUploadArray({
      ...this._def,
      [FILE_UPLOAD_SYMBOL]: {
        ...this._def[FILE_UPLOAD_SYMBOL],
        maxSize: size,
      },
    })
  }

  accept(types: AcceptedFileType): ZodFileUploadArray {
    return new ZodFileUploadArray({
      ...this._def,
      [FILE_UPLOAD_SYMBOL]: {
        ...this._def[FILE_UPLOAD_SYMBOL],
        acceptedTypes: types,
      },
    })
  }

  auto(enabled: boolean = true): ZodFileUploadArray {
    return new ZodFileUploadArray({
      ...this._def,
      [FILE_UPLOAD_SYMBOL]: {
        ...this._def[FILE_UPLOAD_SYMBOL],
        autoUpload: enabled,
      },
    })
  }

  qiniu(enabled: boolean = true): ZodFileUploadArray {
    return new ZodFileUploadArray({
      ...this._def,
      [FILE_UPLOAD_SYMBOL]: {
        ...this._def[FILE_UPLOAD_SYMBOL],
        useQiniu: enabled,
      },
    })
  }
}

// 扩展 Zod 字符串类型，添加文件上传相关的方法
declare module 'zod' {
  interface ZodString {
    /**
     * 标记为文件上传字段
     * @param options 文件上传配置选项
     */
    fileUpload(options?: FileUploadOptions): ZodFileUpload
  }

  interface ZodArray<T> {
    /**
     * 标记为文件上传字段（数组）
     * @param options 文件上传配置选项
     */
    fileUpload(options?: FileUploadOptions): ZodFileUploadArray
  }
}

// 扩展 ZodString 原型
z.ZodString.prototype.fileUpload = function (options: FileUploadOptions = {}) {
  return new ZodFileUpload({
    ...this._def,
    [FILE_UPLOAD_SYMBOL]: {
      maxFiles: 1,
      maxSize: getDefaultMaxSize(options.acceptedTypes),
      autoUpload: true,
      useQiniu: true,
      ...options,
    },
  })
}

// 扩展 ZodArray 原型
z.ZodArray.prototype.fileUpload = function (options: FileUploadOptions = {}) {
  // 安全地获取数组元素类型
  const elementType = this._def.type as any
  let mergedOptions = { ...options }

  // 如果数组元素是 ZodFileUpload，合并其配置
  if (elementType && isZodFileUpload(elementType)) {
    const elementOptions = elementType.getFileUploadOptions()
    mergedOptions = {
      ...elementOptions,
      ...options,
      // 数组的 maxFiles 应该从数组的 max 限制中获取，而不是元素的
      maxFiles: options.maxFiles || this._def.maxLength?.value || 5,
    }
  }

  return new ZodFileUploadArray({
    ...this._def,
    [FILE_UPLOAD_SYMBOL]: {
      maxFiles: mergedOptions.maxFiles || this._def.maxLength?.value || 5,
      maxSize: getDefaultMaxSize(mergedOptions.acceptedTypes),
      autoUpload: true,
      useQiniu: true,
      ...mergedOptions,
    },
  })
}

// 便捷的文件上传 schema 创建函数
export const fileUpload = (options: FileUploadOptions = {}) => {
  return ZodFileUpload.createFileUpload(options)
}

// 类型守卫函数
export function isZodFileUpload(schema: any): schema is ZodFileUpload {
  return schema instanceof ZodFileUpload || (schema && typeof schema === 'object' && FILE_UPLOAD_SYMBOL in schema._def)
}

// 类型守卫函数 - 检查是否为文件上传数组
export function isZodFileUploadArray(schema: any): schema is ZodFileUploadArray {
  return (
    schema instanceof ZodFileUploadArray || (schema && typeof schema === 'object' && FILE_UPLOAD_SYMBOL in schema._def)
  )
}

// 通用的文件上传检查函数
export function hasFileUploadConfig(schema: any): boolean {
  if (isZodFileUpload(schema) || isZodFileUploadArray(schema)) {
    return true
  }

  // 安全地检查数组元素是否为文件上传类型
  if (schema instanceof z.ZodArray) {
    try {
      const elementType = schema._def.type as any
      return elementType && isZodFileUpload(elementType)
    } catch {
      return false
    }
  }

  return false
}

// 获取文件上传配置的通用函数
export function getFileUploadConfig(schema: any): FileUploadOptions | null {
  if (isZodFileUpload(schema) || isZodFileUploadArray(schema)) {
    return schema.getFileUploadOptions()
  }

  // 安全地检查数组元素是否为文件上传类型
  if (schema instanceof z.ZodArray) {
    try {
      const elementType = schema._def.type as any
      if (elementType && isZodFileUpload(elementType)) {
        const elementOptions = elementType.getFileUploadOptions()
        return {
          ...elementOptions,
          maxFiles: schema._def.maxLength?.value || 5,
        }
      }
    } catch {
      return null
    }
  }

  return null
}
