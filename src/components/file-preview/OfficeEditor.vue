<template>
  <div class="office-editor-container h-full w-full">
    <!-- 工具栏 -->
    <div v-if="showToolbar" class="bg-background flex items-center justify-between border-b p-4">
      <div class="flex items-center gap-2">
        <h3 class="text-lg font-medium">{{ title || '文档编辑器' }}</h3>
        <Badge v-if="currentDocument" variant="secondary">{{ getFileTypeLabel(currentDocument.fileType) }}</Badge>
      </div>

      <div class="flex items-center gap-2">
        <!-- 新建文档下拉菜单 -->
        <DropdownMenu v-if="allowCreate">
          <DropdownMenuTrigger as-child>
            <Button size="sm" variant="outline">
              <Plus class="mr-2 h-4 w-4" />
              新建
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem @click="createNewDocument('docx')">
              <FileText class="mr-2 h-4 w-4" />
              Word 文档
            </DropdownMenuItem>
            <DropdownMenuItem @click="createNewDocument('xlsx')">
              <FileText class="mr-2 h-4 w-4" />
              Excel 表格
            </DropdownMenuItem>
            <DropdownMenuItem @click="createNewDocument('pptx')">
              <FileText class="mr-2 h-4 w-4" />
              PowerPoint 演示
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <!-- 打开文档下拉菜单 -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button size="sm" variant="outline">
              <FolderOpen class="mr-2 h-4 w-4" />
              打开
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem @click="openDocument">
              <FolderOpen class="mr-2 h-4 w-4" />
              从本地打开
            </DropdownMenuItem>
            <DropdownMenuItem @click="showUrlDialog = true">
              <Globe class="mr-2 h-4 w-4" />
              从URL打开
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <!-- 编辑器容器 -->
    <div class="editor-wrapper relative flex-1" :style="{ height: editorHeight }">
      <div v-if="!currentDocument" class="flex h-full items-center justify-center">
        <div class="text-center">
          <FileText class="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h3 class="mb-2 text-lg font-medium">选择或创建文档</h3>
          <p class="text-muted-foreground mb-2 text-sm">支持 Word、Excel、PowerPoint 文档的编辑和预览</p>
          <p v-if="!isEditorInitialized" class="text-muted-foreground/70 mb-4 text-xs">
            编辑器将在您选择文档时自动初始化
          </p>
          <p v-else class="text-muted-foreground mb-4 text-xs">编辑器已就绪</p>
        </div>
      </div>

      <!-- OnlyOffice 编辑器容器 -->
      <div v-show="currentDocument" id="office-editor-iframe" class="h-full w-full"></div>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="bg-background/80 absolute inset-0 flex items-center justify-center backdrop-blur-sm">
        <div class="text-center">
          <Loader2 class="mx-auto mb-2 h-8 w-8 animate-spin" />
          <p class="text-muted-foreground text-sm">{{ loadingText }}</p>
        </div>
      </div>
    </div>

    <!-- URL 输入对话框 -->
    <Dialog v-model:open="showUrlDialog">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>从 URL 加载文档</DialogTitle>
          <DialogDescription>输入文档的 URL 地址</DialogDescription>
        </DialogHeader>

        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <Label for="document-url">文档 URL</Label>
            <Input id="document-url" v-model="documentUrl" placeholder="https://example.com/document.docx" type="url" />
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <Button variant="outline" @click="showUrlDialog = false">取消</Button>
          <Button @click="loadDocumentFromUrlDialog" :disabled="!documentUrl">加载</Button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- 隐藏的文件输入 -->
    <input
      ref="fileInputRef"
      type="file"
      accept=".docx,.xlsx,.pptx,.doc,.xls,.ppt"
      style="display: none"
      @change="handleFileSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { FileText, FolderOpen, Globe, Loader2, Plus } from 'lucide-vue-next'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { g_sEmpty_bin } from '@/utils/empty_bin'
import { c_oAscFileType2, convertBinToDocumentAndDownload, convertDocument, initX2T, initX2TScript } from '@/utils/x2t'

declare global {
  interface Window {
    DocsAPI: any
  }
}

// 文档类型定义
interface DocumentType {
  fileName: string
  fileType: string
  file: File | null
  url?: string
  isNew?: boolean
}

// 组件属性
interface Props {
  /** 编辑器标题 */
  title?: string
  /** 是否显示工具栏 */
  showToolbar?: boolean
  /** 是否允许创建新文档 */
  allowCreate?: boolean
  /** 编辑器高度 */
  height?: string
  /** 初始文档URL（用于预览远程文档） */
  documentUrl?: string
  /** 初始文档文件 */
  documentFile?: File
  /** 是否只读模式 */
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showToolbar: true,
  allowCreate: true,
  height: '600px',
  readonly: false,
})

// 事件定义
const emit = defineEmits<{
  documentLoaded: [document: DocumentType]
  documentSaved: [document: DocumentType, data: ArrayBuffer]
  error: [error: Error]
}>()

// 响应式数据
const currentDocument = ref<DocumentType | null>(null)
const isLoading = ref(false)
const loadingText = ref('')
const showUrlDialog = ref(false)
const documentUrl = ref('')
const fileInputRef = ref<HTMLInputElement>()
const editor = ref<any>(null)
const isEditorInitialized = ref(false)

// 计算属性
const editorHeight = computed(() => {
  return props.showToolbar ? `calc(${props.height} - 73px)` : props.height
})

// 判断是否为预览模式（在 FilePreview 中使用）
const isPreviewMode = computed(() => {
  return !props.showToolbar && props.readonly && !props.allowCreate
})

// 获取文件类型标签
const getFileTypeLabel = (fileType: string) => {
  const typeMap: Record<string, string> = {
    docx: 'Word',
    doc: 'Word',
    xlsx: 'Excel',
    xls: 'Excel',
    pptx: 'PowerPoint',
    ppt: 'PowerPoint',
  }
  return typeMap[fileType] || fileType.toUpperCase()
}

// 初始化编辑器（延迟初始化）
onMounted(async () => {
  // 如果有初始文档，立即初始化并加载
  if (props.documentUrl || props.documentFile) {
    await initializeEditor()

    if (props.documentUrl) {
      await loadDocumentFromUrl(props.documentUrl)
    } else if (props.documentFile) {
      await loadDocumentFromFile(props.documentFile)
    }
  }
})

// 清理资源
onUnmounted(() => {
  if (editor.value) {
    try {
      editor.value.destroyEditor()
    } catch (error) {
      console.warn('Error destroying editor:', error)
    }
  }
})

// 监听属性变化
watch(
  () => props.documentUrl,
  (newUrl) => {
    if (newUrl) {
      loadDocumentFromUrl(newUrl)
    }
  }
)

watch(
  () => props.documentFile,
  (newFile) => {
    if (newFile) {
      loadDocumentFromFile(newFile)
    }
  }
)

// 初始化编辑器环境（延迟初始化）
const initializeEditor = async () => {
  if (isEditorInitialized.value) {
    return // 已经初始化过了
  }

  try {
    isLoading.value = true
    loadingText.value = '正在初始化编辑器...'

    await initX2TScript()
    await loadEditorApi()
    await initX2T()

    isEditorInitialized.value = true
  } catch (error) {
    console.error('Failed to initialize editor:', error)
    emit('error', error as Error)
    toast.error('编辑器初始化失败')
    throw error
  } finally {
    isLoading.value = false
  }
}

// 加载编辑器API
const loadEditorApi = async () => {
  return new Promise((resolve, reject) => {
    // 检查是否已加载
    if (window.DocsAPI) {
      resolve({})
      return
    }

    // 加载编辑器API
    const script = document.createElement('script')
    script.src = '/web-apps/apps/api/documents/api.js'
    script.onload = () => resolve({})
    script.onerror = (error) => {
      console.error('无法加载编辑器组件。请确保已正确安装 OnlyOffice API:', error)
      reject(error)
    }
    document.head.appendChild(script)
  })
}

// 从URL加载文档
const loadDocumentFromUrl = async (url: string) => {
  try {
    // 确保编辑器已初始化
    await initializeEditor()

    isLoading.value = true
    loadingText.value = '正在加载文档...'

    // 从URL获取文件名和类型
    const fileName = url.split('/').pop() || 'document'
    const fileType = fileName.split('.').pop() || ''

    currentDocument.value = {
      fileName,
      fileType,
      file: null,
      url,
      isNew: false,
    }

    // 对于URL文档，我们需要先下载然后转换
    const response = await fetch(url)
    const blob = await response.blob()
    const file = new File([blob], fileName, { type: blob.type })

    await loadDocumentFromFile(file)
  } catch (error) {
    console.error('Failed to load document from URL:', error)
    emit('error', error as Error)
    toast.error('加载文档失败')
  } finally {
    isLoading.value = false
  }
}

// 从文件加载文档
const loadDocumentFromFile = async (file: File) => {
  try {
    isLoading.value = true
    loadingText.value = '正在处理文档...'

    const fileType = file.name.split('.').pop() || ''

    currentDocument.value = {
      fileName: file.name,
      fileType,
      file,
      isNew: false,
    }

    // 转换文档
    const documentData = await convertDocument(file)

    // 创建编辑器实例
    await createEditorInstance({
      fileName: file.name,
      fileType,
      binData: documentData.bin as any,
      media: documentData.media,
    })

    emit('documentLoaded', currentDocument.value)
  } catch (error) {
    console.error('Failed to load document from file:', error)
    emit('error', error as Error)
    toast.error('加载文档失败')
    throw error // 重新抛出错误，让调用者处理
  } finally {
    isLoading.value = false
  }
}

// 打开文档
const openDocument = () => {
  fileInputRef.value?.click()
}

// 处理文件选择
const handleFileSelect = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    // 在文件选择后再初始化编辑器
    try {
      if (!isEditorInitialized.value) {
        await initializeEditor()
      }
      await loadDocumentFromFile(file)
    } catch (error) {
      console.error('Failed to load document:', error)
      emit('error', error as Error)
      toast.error('文档加载失败')
    }
  }
}

// 从对话框加载URL文档
const loadDocumentFromUrlDialog = async () => {
  if (!documentUrl.value) {
    toast.error('请输入有效的 URL')
    return
  }

  try {
    await loadDocumentFromUrl(documentUrl.value)
    showUrlDialog.value = false
    documentUrl.value = ''
    toast.success('文档加载成功')
  } catch (error) {
    console.error('Failed to load document from URL:', error)
    toast.error('从 URL 加载文档失败')
  }
}

// 创建新文档
const createNewDocument = async (fileType: string) => {
  try {
    isLoading.value = true
    loadingText.value = '正在初始化编辑器...'

    // 确保编辑器已初始化
    if (!isEditorInitialized.value) {
      await initializeEditor()
    }

    loadingText.value = '正在创建新文档...'

    const fileName = `新建文档.${fileType}`

    // 获取空模板
    const emptyBin = g_sEmpty_bin[`.${fileType}`] as unknown as ArrayBuffer
    if (!emptyBin) {
      throw new Error(`不支持的文件类型: ${fileType}`)
    }

    currentDocument.value = {
      fileName,
      fileType,
      file: null,
      isNew: true,
    }

    // 创建编辑器实例
    await createEditorInstance({
      fileName,
      fileType,
      binData: emptyBin,
    })

    emit('documentLoaded', currentDocument.value)
    toast.success('新文档创建成功')
  } catch (error) {
    console.error('Failed to create new document:', error)
    emit('error', error as Error)
    toast.error('创建新文档失败')
  } finally {
    isLoading.value = false
  }
}

// 创建编辑器实例
const createEditorInstance = async (config: {
  fileName: string
  fileType: string
  binData: ArrayBuffer
  media?: any
}) => {
  // 清理旧编辑器实例
  if (editor.value) {
    try {
      editor.value.destroyEditor()
    } catch (error) {
      console.warn('Error destroying previous editor:', error)
    }
    editor.value = null
  }

  const { fileName, fileType, binData, media } = config

  return new Promise((resolve, reject) => {
    try {
      editor.value = new window.DocsAPI.DocEditor('office-editor-iframe', {
        document: {
          title: fileName,
          url: `preview-${fileName}`, // 使用文件名作为标识
          fileType: fileType,
          key: `preview-${fileName}-${Date.now()}`, // 添加唯一标识
          permissions: {
            edit: !props.readonly,
            chat: false,
            protect: false,
            comment: false,
            fillForms: !props.readonly,
            modifyFilter: !props.readonly,
            modifyContentControl: !props.readonly,
            review: false,
            download: false,
            print: false,
          },
        },
        editorConfig: {
          lang: 'zh',
          user: {
            id: 'user-preview',
            name: 'Preview Ross',
            group: 'preview',
          },
          customization: {
            help: false,
            about: false,
            hideRightMenu: true,
            compactToolbar: !props.showToolbar,
            toolbar: props.showToolbar,
            statusBar: props.showToolbar,
            leftMenu: props.showToolbar,
            rightMenu: false,
            header: props.showToolbar,
            // 在预览模式下隐藏更多UI元素
            ...(isPreviewMode.value && {
              compactHeader: true,
              hideNotes: true,
              hideRulers: true,
            }),
            features: {
              spellcheck: {
                change: false,
              },
            },
            anonymous: {
              request: false,
              label: 'Guest',
            },
          },
        },
        events: {
          onAppReady: () => {
            try {
              // 设置媒体资源
              if (media) {
                editor.value.sendCommand({
                  command: 'asc_setImageUrls',
                  data: { urls: media },
                })
              }

              // 加载文档内容
              editor.value.sendCommand({
                command: 'asc_openDocument',
                data: { buf: binData },
              })

              resolve(editor.value)
            } catch (error) {
              reject(error)
            }
          },
          onDocumentReady: () => {
            // console.log('文档加载完成:', fileName)
            isLoading.value = false
          },
          onSave: handleSaveDocument,
          onError: (error: any) => {
            handleEditorError(error)
            reject(error)
          },
        },
      })
    } catch (error) {
      reject(error)
    }
  })
}

// 处理编辑器错误
const handleEditorError = (error: any) => {
  console.error('OnlyOffice Editor Error:', error)

  let errorMessage = '编辑器加载失败'

  // 根据错误类型提供更具体的错误信息
  if (error?.data) {
    switch (error.data) {
      case 1:
        errorMessage = '文档密钥错误'
        break
      case 2:
        errorMessage = '回调URL错误'
        break
      case 3:
        errorMessage = '内部服务器错误'
        break
      case 4:
        errorMessage = '文档无法下载'
        break
      case 5:
        errorMessage = '文档密钥过期'
        break
      case 6:
        errorMessage = '文档读取错误'
        break
      default:
        errorMessage = error.data.message || '未知错误'
    }
  }

  emit('error', new Error(errorMessage))

  // 在编辑模式下显示错误提示
  if (props.showToolbar) {
    toast.error(errorMessage)
  }

  return errorMessage
}

// 处理文档保存
const handleSaveDocument = async (event: any) => {
  if (event.data && event.data.data && currentDocument.value) {
    try {
      const { data, option } = event.data

      // 触发保存事件
      emit('documentSaved', currentDocument.value, data.data)

      // 创建下载
      await convertBinToDocumentAndDownload(
        data.data,
        currentDocument.value.fileName,
        c_oAscFileType2[option.outputformat]
      )

      toast.success('文档保存成功')
    } catch (error) {
      console.error('Save failed:', error)
      toast.error('保存失败')
    }
  }

  // 告知编辑器保存完成
  if (editor.value) {
    editor.value.sendCommand({
      command: 'asc_onSaveCallback',
      data: { err_code: 0 },
    })
  }
}

// 暴露方法给父组件
defineExpose({
  loadDocumentFromUrl,
  loadDocumentFromFile,
  createNewDocument,
  getCurrentDocument: () => currentDocument.value,
  getEditor: () => editor.value,
})
</script>
