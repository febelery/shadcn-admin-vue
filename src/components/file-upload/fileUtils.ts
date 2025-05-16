import { reactive } from 'vue'
import { FileUploadStatus } from './types'
import type { AcceptedFileType, UploadFile } from './types'

/**
 * 根据文件名猜测文件类型
 */
export function guessFileType(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase() || ''

  const mimeTypeMap: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    mp4: 'video/mp4',
    webm: 'video/webm',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    txt: 'text/plain',
    csv: 'text/csv',
    html: 'text/html',
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
  }

  return mimeTypeMap[extension] || 'application/octet-stream'
}

/**
 * 创建带有上传信息的文件对象
 */
export function createUploadFile(file: File): UploadFile {
  const uid = `upload-file-${Date.now()}-${Math.random().toString(36).slice(2)}`
  return Object.assign(file, {
    uid,
    progress: reactive({
      id: uid,
      status: FileUploadStatus.PENDING,
      percentage: 0,
      loaded: 0,
      total: file.size,
    }),
  }) as UploadFile
}

/**
 * 验证文件类型是否符合接受条件
 */
export function isFileTypeValid(file: File, acceptedTypes?: AcceptedFileType): boolean {
  if (!acceptedTypes) return true

  const acceptedTypeArray = Array.isArray(acceptedTypes) ? acceptedTypes : [acceptedTypes]

  // 处理MIME类型通配符，例如'image/*'
  for (const type of acceptedTypeArray) {
    // 处理文件扩展名
    if (typeof type === 'string' && type.startsWith('.')) {
      const extension = `.${file.name.split('.').pop()?.toLowerCase()}`
      if (extension === type.toLowerCase()) {
        return true
      }
      continue
    }

    const typeStr = String(type)

    // 处理MIME类型通配符
    if (typeStr.endsWith('/*')) {
      const prefix = typeStr.slice(0, -2)
      if (file.type.startsWith(prefix)) {
        return true
      }
    }
    // 直接匹配MIME类型
    else if (file.type === typeStr) {
      return true
    }
  }

  return false
}

/**
 * 格式化接受的文件类型为字符串
 */
export function formatAcceptedTypes(acceptedTypes?: AcceptedFileType): string | undefined {
  if (!acceptedTypes) return undefined

  const types = Array.isArray(acceptedTypes) ? acceptedTypes : [acceptedTypes]
  const formattedTypes: string[] = []

  for (const type of types) {
    const typeStr = String(type)

    // 已经是扩展名格式的（如 .jpg）直接添加
    if (typeStr.startsWith('.')) {
      formattedTypes.push(typeStr)
      continue
    }

    // 处理MIME类型通配符（如 image/*）并添加常见扩展名增强兼容性
    if (typeStr.endsWith('/*')) {
      const mainType = typeStr.split('/')[0]
      formattedTypes.push(typeStr)

      // 对常见类型添加扩展名，提高浏览器兼容性
      switch (mainType) {
        case 'image':
          formattedTypes.push('.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg')
          break
        case 'video':
          formattedTypes.push('.mp4', '.webm', '.mov', '.avi')
          break
        case 'audio':
          formattedTypes.push('.mp3', '.wav', '.ogg', '.flac')
          break
        case 'text':
          formattedTypes.push('.txt', '.csv', '.html')
          break
      }
    }
    // 处理具体MIME类型（如 image/jpeg）
    else if (typeStr.includes('/')) {
      formattedTypes.push(typeStr)

      // 对特定MIME类型添加对应的文件扩展名
      switch (typeStr) {
        case 'image/jpeg':
          formattedTypes.push('.jpg', '.jpeg')
          break
        case 'image/png':
          formattedTypes.push('.png')
          break
        case 'image/gif':
          formattedTypes.push('.gif')
          break
        case 'image/webp':
          formattedTypes.push('.webp')
          break
        case 'image/svg+xml':
          formattedTypes.push('.svg')
          break
        case 'application/pdf':
          formattedTypes.push('.pdf')
          break
        case 'text/plain':
          formattedTypes.push('.txt')
          break
        case 'text/csv':
          formattedTypes.push('.csv')
          break
        case 'text/html':
          formattedTypes.push('.html')
          break
        case 'application/zip':
          formattedTypes.push('.zip')
          break
        case 'application/x-rar-compressed':
          formattedTypes.push('.rar')
          break
        case 'video/mp4':
          formattedTypes.push('.mp4')
          break
        case 'video/webm':
          formattedTypes.push('.webm')
          break
        case 'audio/mpeg':
          formattedTypes.push('.mp3')
          break
        case 'audio/wav':
          formattedTypes.push('.wav')
          break
      }
    }
    // 其他格式直接添加
    else {
      formattedTypes.push(typeStr)
    }
  }

  // 去重并返回
  return [...new Set(formattedTypes)].join(',')
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

/**
 * 检查文件是否为图片
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * 检查文件是否为视频
 */
export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/')
}

/**
 * 获取文件扩展名
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toUpperCase() || ''
}
