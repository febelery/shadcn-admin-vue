import { qiniuUptokenApi } from '@/api/file'
import type { UploadFile } from './types'
import { FileUploadStatus } from './types'

// 获取七牛云上传URL
const QINIU_UPLOAD_URL = import.meta.env.VITE_QINIU_URL

/**
 * 上传文件到七牛云
 * @param file 要上传的文件
 * @param onProgress 上传进度回调
 * @param onSuccess 上传成功回调
 * @param onError 上传失败回调
 */
export async function uploadToQiniu(
  file: UploadFile,
  onProgress?: (percentage: number) => void,
  onSuccess?: (url: string) => void,
  onError?: (error: Error) => void
): Promise<{ success: boolean; url?: string; error?: Error }> {
  try {
    // 确保文件状态重置为上传中
    file.progress.status = FileUploadStatus.UPLOADING
    file.progress.percentage = 0

    // 获取七牛云上传token
    const { data } = await qiniuUptokenApi({
      name: file.name,
      modified: file.lastModified,
      size: file.size,
      type: file.type,
    })

    if (!data || !data.uptoken) {
      throw new Error('获取七牛云上传token失败')
    }

    // 创建FormData
    const formData = new FormData()
    formData.append('file', file)
    formData.append('token', data.uptoken)
    formData.append('key', file.name)

    // 创建XMLHttpRequest进行上传，以便获取进度
    const xhr = new XMLHttpRequest()

    // 监听上传进度
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percentage = Math.round((e.loaded * 100) / e.total)
        // 更新文件进度
        file.progress.percentage = percentage
        file.progress.loaded = e.loaded
        file.progress.total = e.total
        // 调用进度回调
        onProgress?.(percentage)
      }
    })

    // 创建Promise包装XHR请求
    const result = await new Promise<{ success: boolean; url?: string; error?: Error }>((resolve, _reject) => {
      xhr.open('POST', QINIU_UPLOAD_URL)

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)

            // 七牛云返回数据检查和处理
            let fileUrl = ''
            if (response?.path) {
              // 如果直接返回了完整路径
              fileUrl = response.path
            } else if (response?.key) {
              // 如果返回了key，需要构建URL
              fileUrl = `${QINIU_UPLOAD_URL}/${response.key}`
            } else if (response?.hash) {
              // 如果返回了hash，需要构建URL
              fileUrl = `${QINIU_UPLOAD_URL}/${response.hash}`
            } else {
              throw new Error('七牛云返回数据格式错误')
            }

            // 确保进度设置为100%并将状态更新为成功
            file.progress.percentage = 100
            file.progress.status = FileUploadStatus.SUCCESS

            // 调用成功回调
            onSuccess?.(fileUrl)

            resolve({ success: true, url: fileUrl })
          } catch (error) {
            const err = error as Error
            handleUploadError(file, err)
            onError?.(err)
            resolve({ success: false, error: err })
          }
        } else {
          let errResponse
          try {
            errResponse = JSON.parse(xhr.responseText)
          } catch {
            errResponse = { error: `上传失败 - status code:${xhr.status}` }
          }
          const error = new Error(errResponse?.error || `上传失败 - status code:${xhr.status}`)
          handleUploadError(file, error)
          onError?.(error)
          resolve({ success: false, error })
        }
      }

      xhr.onerror = () => {
        const error = new Error('在上传文件时发生网络错误')
        handleUploadError(file, error)
        onError?.(error)
        resolve({ success: false, error })
      }

      xhr.ontimeout = () => {
        const error = new Error('Upload timed out')
        handleUploadError(file, error)
        onError?.(error)
        resolve({ success: false, error })
      }

      xhr.send(formData)
    })

    return result
  } catch (error) {
    const err = error as Error
    handleUploadError(file, err)
    onError?.(err)
    return { success: false, error: err }
  }
}

/**
 * 处理上传错误
 */
export function handleUploadError(file: UploadFile, error: Error): void {
  // 确保错误状态正确设置
  file.progress.status = FileUploadStatus.ERROR
  file.progress.error = error.message
}

/**
 * 重试上传失败的文件
 */
export function resetFileForRetry(file: UploadFile): void {
  if (file.progress.status === FileUploadStatus.ERROR) {
    file.progress.status = FileUploadStatus.PENDING
    file.progress.percentage = 0
    file.progress.error = undefined
  }
}
