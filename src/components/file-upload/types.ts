/**
 * 文件类型枚举
 */
export enum FileType {
  // 图片类型
  IMAGE_ALL = 'image/*',
  IMAGE_JPEG = 'image/jpeg',
  IMAGE_PNG = 'image/png',
  IMAGE_GIF = 'image/gif',
  IMAGE_WEBP = 'image/webp',
  IMAGE_SVG = 'image/svg+xml',

  // 文档类型
  PDF = 'application/pdf',
  WORD = 'application/msword',
  WORD_DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  EXCEL = 'application/vnd.ms-excel',
  EXCEL_XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  PPT = 'application/vnd.ms-powerpoint',
  PPT_PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',

  // 视频类型
  VIDEO_ALL = 'video/*',
  VIDEO_MP4 = 'video/mp4',
  VIDEO_WEBM = 'video/webm',

  // 音频类型
  AUDIO_ALL = 'audio/*',
  AUDIO_MP3 = 'audio/mpeg',
  AUDIO_WAV = 'audio/wav',

  // 文本类型
  TEXT_ALL = 'text/*',
  TEXT_PLAIN = 'text/plain',
  TEXT_CSV = 'text/csv',
  TEXT_HTML = 'text/html',

  // 压缩文件
  ZIP = 'application/zip',
  RAR = 'application/x-rar-compressed',
}

/**
 * 文件类型分组
 */
export const FileTypeGroups = {
  IMAGES: [
    FileType.IMAGE_ALL,
    FileType.IMAGE_JPEG,
    FileType.IMAGE_PNG,
    FileType.IMAGE_GIF,
    FileType.IMAGE_WEBP,
    FileType.IMAGE_SVG,
  ],
  DOCUMENTS: [
    FileType.PDF,
    FileType.WORD,
    FileType.WORD_DOCX,
    FileType.EXCEL,
    FileType.EXCEL_XLSX,
    FileType.PPT,
    FileType.PPT_PPTX,
  ],
  VIDEOS: [FileType.VIDEO_ALL, FileType.VIDEO_MP4, FileType.VIDEO_WEBM],
  AUDIOS: [FileType.AUDIO_ALL, FileType.AUDIO_MP3, FileType.AUDIO_WAV],
}

/**
 * 友好名称映射
 */
export const FileTypeFriendlyNames: Record<FileType, string> = {
  [FileType.IMAGE_ALL]: '图片',
  [FileType.IMAGE_JPEG]: 'JPEG图片',
  [FileType.IMAGE_PNG]: 'PNG图片',
  [FileType.IMAGE_GIF]: 'GIF图片',
  [FileType.IMAGE_WEBP]: 'WebP图片',
  [FileType.IMAGE_SVG]: 'SVG图片',

  [FileType.PDF]: 'PDF文档',
  [FileType.WORD]: 'Word文档',
  [FileType.WORD_DOCX]: 'Word文档',
  [FileType.EXCEL]: 'Excel表格',
  [FileType.EXCEL_XLSX]: 'Excel表格',
  [FileType.PPT]: 'PPT演示文稿',
  [FileType.PPT_PPTX]: 'PPT演示文稿',

  [FileType.VIDEO_ALL]: '视频',
  [FileType.VIDEO_MP4]: 'MP4视频',
  [FileType.VIDEO_WEBM]: 'WebM视频',

  [FileType.AUDIO_ALL]: '音频',
  [FileType.AUDIO_MP3]: 'MP3音频',
  [FileType.AUDIO_WAV]: 'WAV音频',

  [FileType.TEXT_ALL]: '文本文件',
  [FileType.TEXT_PLAIN]: '纯文本',
  [FileType.TEXT_CSV]: 'CSV表格',
  [FileType.TEXT_HTML]: 'HTML文件',

  [FileType.ZIP]: 'ZIP压缩包',
  [FileType.RAR]: 'RAR压缩包',
}

export type AcceptedFileType = FileType | string | (FileType | string)[]

/**
 * 文件上传状态枚举
 */
export enum FileUploadStatus {
  /** 等待上传 */
  PENDING = 'pending',
  /** 上传中 */
  UPLOADING = 'uploading',
  /** 上传成功 */
  SUCCESS = 'success',
  /** 上传失败 */
  ERROR = 'error',
  /** 已取消 */
  CANCELED = 'canceled',
}

/**
 * 文件上传进度接口
 */
export interface FileProgress {
  /** 文件ID（索引或唯一标识） */
  id: string | number
  /** 上传状态 */
  status: FileUploadStatus
  /** 上传进度百分比 (0-100) */
  percentage: number
  /** 错误信息（如果有） */
  error?: string
  /** 已上传字节数 */
  loaded?: number
  /** 总字节数 */
  total?: number
}

/**
 * 扩展的文件对象，包含上传进度信息
 */
export interface UploadFile extends File {
  /** 唯一标识符 */
  uid: string
  /** 上传进度信息 */
  progress: FileProgress
}
