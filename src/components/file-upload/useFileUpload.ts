import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { resetFileForRetry, uploadToQiniu } from './fileUploadService'
import { createUploadFile, guessFileType, isFileTypeValid } from './fileUtils'
import type { AcceptedFileType, UploadFile } from './types'
import { FileUploadStatus } from './types'

export function useFileUpload(options: {
  maxFiles?: number
  acceptedTypes?: AcceptedFileType
  maxSize?: number
  autoUpload?: boolean
  useQiniu?: boolean
  modelValue?: string | string[]
  onUpdateModelValue?: (value: string | string[]) => void
  onProgress?: (percentage: number) => void
  onError?: (error: Error) => void
}) {
  const {
    maxFiles = 1,
    acceptedTypes,
    maxSize = 1000 * 1024 * 1024,
    autoUpload = true,
    useQiniu = true,
    modelValue,
    onUpdateModelValue,
    onProgress,
    onError,
  } = options

  const files = ref<UploadFile[]>([])
  const filePreviewUrls = ref<Map<UploadFile, string>>(new Map())
  const uploadedUrls = ref<string[]>([])
  const currentFileIndex = ref<number | null>(null)
  const previewOpen = ref<boolean>(false)
  const isUploading = ref<boolean>(false)
  const showPasteHint = ref<boolean>(false)

  const isUploadDisabled = computed(() => {
    return files.value.length >= maxFiles
  })

  const currentFile = computed(() => {
    if (currentFileIndex.value === null) return null
    return files.value[currentFileIndex.value]
  })

  watch(
    () => modelValue,
    async (newValue) => {
      // 只有当 modelValue 有值且不为空时才加载
      if (newValue && 
          ((typeof newValue === 'string' && newValue.trim() !== '') || 
           (Array.isArray(newValue) && newValue.length > 0 && newValue.some(url => url.trim() !== '')))) {
        await loadUrlsFromModel(newValue)
      } else {
        // 如果 modelValue 为空，清空文件列表
        clearFiles()
      }
    },
    { immediate: true }
  )

  async function loadUrlsFromModel(urls: string | string[]) {
    // 处理空值情况
    if (!urls) {
      clearFiles()
      return
    }

    const urlList = Array.isArray(urls) ? urls.filter(url => url && url.trim() !== '') : [urls].filter(url => url && url.trim() !== '')
    
    // 如果过滤后没有有效的 URL，清空文件列表
    if (urlList.length === 0) {
      clearFiles()
      return
    }

    // 检查是否与当前已上传的 URL 相同，避免重复加载
    if (urlList.length === uploadedUrls.value.length && urlList.every((url, i) => url === uploadedUrls.value[i])) {
      return
    }

    clearFiles()

    const limitedUrls = urlList.slice(0, maxFiles)

    try {
      for (const url of limitedUrls) {
        try {
          // 验证 URL 是否有效
          if (!url || url.trim() === '') continue

          const fileName = url.split('/').pop() || `file-${Date.now()}`

          const fileType = guessFileType(url)
          const mockFile = createUploadFile(new File([], fileName, { type: fileType }))

          mockFile.progress.status = FileUploadStatus.SUCCESS
          mockFile.progress.percentage = 100

          files.value.push(mockFile)

          filePreviewUrls.value.set(mockFile, url)
          uploadedUrls.value.push(url)
        } catch (err) {
          console.error('Failed to load file for URL:', url, err)
        }
      }
    } catch (error) {
      console.error('Failed to load files from model:', error)
    }
  }

  function handleFileChange(newFiles: File[]) {
    const validFiles = acceptedTypes ? newFiles.filter((file) => isFileTypeValid(file, acceptedTypes)) : newFiles

    // 检查文件大小限制
    const oversizedFiles = validFiles.filter((file) => file.size > maxSize)
    if (oversizedFiles.length > 0) {
      toast.error(`文件大小不能超过${maxSize / (1024 * 1024)}MB`, {
        position: 'top-center',
      })
      return
    }

    const remainingSlots = maxFiles - files.value.length
    const filesToAdd = validFiles.slice(0, remainingSlots)

    if (filesToAdd.length === 0) return

    if (maxFiles === 1 && files.value.length > 0) {
      clearFiles()
    }

    const uploadFiles = filesToAdd.map((file) => createUploadFile(file))

    files.value = [...files.value, ...uploadFiles]

    uploadFiles.forEach((file) => {
      if (!filePreviewUrls.value.has(file)) {
        filePreviewUrls.value.set(file, URL.createObjectURL(file))
      }
    })

    if (autoUpload && uploadFiles.length > 0) {
      uploadFiles.forEach((file) => {
        if (useQiniu) {
          uploadFile(file)
        }
      })
    }
  }

  async function uploadFile(file: UploadFile) {
    if (useQiniu) {
      isUploading.value = true
      const result = await uploadToQiniu(
        file,
        (percentage) => {
          onProgress?.(percentage)
        },
        (url) => {
          uploadedUrls.value.push(url)

          if (filePreviewUrls.value.has(file) && filePreviewUrls.value.get(file)?.startsWith('blob:')) {
            URL.revokeObjectURL(filePreviewUrls.value.get(file)!)
            filePreviewUrls.value.set(file, url)
          }

          updateModelValue()
        },
        (error) => {
          onError?.(error)
          checkUploadStatus()
        }
      )

      checkUploadStatus()

      return result.success
    }

    return false
  }

  function retryUpload(file: UploadFile) {
    if (file.progress.status === FileUploadStatus.ERROR) {
      resetFileForRetry(file)
      uploadFile(file)
    }
  }

  function checkUploadStatus() {
    const allProcessed = files.value.every(
      (f) => f.progress.status === FileUploadStatus.SUCCESS || f.progress.status === FileUploadStatus.ERROR
    )

    if (allProcessed) {
      isUploading.value = false
      updateModelValue()
    }
  }

  function updateModelValue() {
    if (!onUpdateModelValue) return

    if (maxFiles === 1) {
      onUpdateModelValue(uploadedUrls.value[0] || '')
    } else {
      onUpdateModelValue([...uploadedUrls.value])
    }
  }

  function removeFile(index: number) {
    const fileToRemove = files.value[index]

    if (filePreviewUrls.value.has(fileToRemove)) {
      if (!(fileToRemove.progress.status === FileUploadStatus.SUCCESS)) {
        URL.revokeObjectURL(filePreviewUrls.value.get(fileToRemove)!)
      }
      filePreviewUrls.value.delete(fileToRemove)
    }

    const fileUrl = uploadedUrls.value[index]
    if (fileUrl) {
      uploadedUrls.value = uploadedUrls.value.filter((url) => url !== fileUrl)
    }

    files.value = files.value.filter((_, i) => i !== index)

    updateModelValue()

    if (previewOpen.value && currentFileIndex.value === index) {
      closePreview()
    } else if (previewOpen.value && currentFileIndex.value !== null && currentFileIndex.value > index) {
      currentFileIndex.value -= 1
    }
  }

  function clearFiles() {
    files.value.forEach((file) => {
      if (filePreviewUrls.value.has(file)) {
        if (!(file.progress.status === FileUploadStatus.SUCCESS)) {
          URL.revokeObjectURL(filePreviewUrls.value.get(file)!)
        }
        filePreviewUrls.value.delete(file)
      }
    })

    files.value = []
    uploadedUrls.value = []
  }

  function openPreview(file: UploadFile, index: number) {
    currentFileIndex.value = index
    previewOpen.value = true
  }

  function closePreview() {
    previewOpen.value = false
    currentFileIndex.value = null
  }

  function handlePreviewNavigation(direction: 'prev' | 'next') {
    if (currentFileIndex.value === null) return

    if (direction === 'prev' && currentFileIndex.value > 0) {
      currentFileIndex.value -= 1
    } else if (direction === 'next' && currentFileIndex.value < files.value.length - 1) {
      currentFileIndex.value += 1
    }
  }

  function getFilePreview(file: UploadFile): string {
    if (filePreviewUrls.value.has(file)) {
      return filePreviewUrls.value.get(file)!
    }

    const url = URL.createObjectURL(file)
    filePreviewUrls.value.set(file, url)
    return url
  }

  function showPasteSuccess() {
    showPasteHint.value = true
    setTimeout(() => {
      showPasteHint.value = false
    }, 2000)
  }

  async function downloadFile(file?: UploadFile) {
    const targetFile = file || currentFile.value
    if (!targetFile) return

    const fileUrl = getFilePreview(targetFile)
    const response = await fetch(fileUrl)
    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = blobUrl
    a.download = targetFile.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    URL.revokeObjectURL(blobUrl)
  }

  return {
    files,
    isUploading,
    isUploadDisabled,
    previewOpen,
    currentFile,
    currentFileIndex,
    showPasteHint,

    handleFileChange,
    uploadFile,
    retryUpload,
    removeFile,
    clearFiles,
    openPreview,
    closePreview,
    handlePreviewNavigation,
    getFilePreview,
    showPasteSuccess,
    downloadFile,
  }
}