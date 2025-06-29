// 文件类型检测工具函数
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/')
}

export function isAudioFile(file: File): boolean {
  return file.type.startsWith('audio/')
}

export function isExcelFile(file: File): boolean {
  const excelTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
  ]
  return excelTypes.includes(file.type) || file.name.match(/\.(xlsx?|csv)$/i) !== null
}

export function isWordFile(file: File): boolean {
  const wordTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  return wordTypes.includes(file.type) || file.name.match(/\.docx?$/i) !== null
}

export function isPdfFile(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}

export function isTextFile(file: File): boolean {
  return file.type.startsWith('text/') || file.name.match(/\.(txt|md|json|xml|html|css|js|ts)$/i) !== null
}

// 格式化文件大小
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 获取文件扩展名
export function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.')
  if (lastDotIndex === -1) return ''
  return filename.slice(lastDotIndex + 1).toUpperCase()
}

// 根据文件名猜测文件类型
export function guessFileType(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase()

  const typeMap: Record<string, string> = {
    // 图片
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    bmp: 'image/bmp',
    ico: 'image/x-icon',

    // 视频
    mp4: 'video/mp4',
    avi: 'video/x-msvideo',
    mov: 'video/quicktime',
    wmv: 'video/x-ms-wmv',
    flv: 'video/x-flv',
    webm: 'video/webm',
    mkv: 'video/x-matroska',

    // 音频
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    aac: 'audio/aac',
    flac: 'audio/flac',

    // 文档
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',

    // 文本
    txt: 'text/plain',
    html: 'text/html',
    css: 'text/css',
    js: 'text/javascript',
    json: 'application/json',
    xml: 'text/xml',
    csv: 'text/csv',

    // 压缩文件
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    tar: 'application/x-tar',
    gz: 'application/gzip',
  }

  return typeMap[extension || ''] || 'application/octet-stream'
}

// 检查文件是否可以预览
export function isPreviewableFile(file: File): boolean {
  return (
    isImageFile(file) ||
    isVideoFile(file) ||
    isExcelFile(file) ||
    isWordFile(file) ||
    isPdfFile(file) ||
    isTextFile(file)
  )
}

// 获取文件类型的友好名称
export function getFileTypeName(file: File): string {
  if (isImageFile(file)) return '图片'
  if (isVideoFile(file)) return '视频'
  if (isAudioFile(file)) return '音频'
  if (isExcelFile(file)) return 'Excel表格'
  if (isWordFile(file)) return 'Word文档'
  if (isPdfFile(file)) return 'PDF文档'
  if (isTextFile(file)) return '文本文件'

  return '文件'
}
