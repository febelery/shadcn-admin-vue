<template>
  <div class="bg-background flex min-h-screen flex-col p-6">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold">Office 文档编辑器</h1>
      <p class="text-muted-foreground mt-2">支持 Word、Excel、PowerPoint 文档的创建、编辑和预览</p>
    </div>

    <!-- 示例按钮区域 -->
    <div class="mb-6 flex flex-wrap gap-4">
      <Button @click="loadSampleDocument('docx')" variant="outline">
        <FileText class="mr-2 h-4 w-4" />
        加载示例 Word 文档
      </Button>
      <Button @click="loadSampleDocument('xlsx')" variant="outline">
        <FileText class="mr-2 h-4 w-4" />
        加载示例 Excel 文档
      </Button>
      <Button @click="loadSampleDocument('pptx')" variant="outline">
        <FileText class="mr-2 h-4 w-4" />
        加载示例 PowerPoint 文档
      </Button>
      <Button @click="loadFromUrl" variant="outline">
        <Globe class="mr-2 h-4 w-4" />
        从 URL 加载
      </Button>
    </div>

    <!-- Office 编辑器组件 -->
    <div class="bg-card flex-1 rounded-lg border p-1">
      <OfficeEditor
        ref="officeEditorRef"
        title="文档编辑器"
        height="calc(100vh - 200px)"
        :show-toolbar="true"
        :allow-create="true"
        :readonly="false"
        @document-loaded="onDocumentLoaded"
        @document-saved="onDocumentSaved"
        @error="onError"
      />
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
          <Button @click="loadDocumentFromUrl" :disabled="!documentUrl">加载</Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { FileText, Globe } from 'lucide-vue-next'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { OfficeEditor } from '@/components/file-preview'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// 响应式数据
const officeEditorRef = ref()
const showUrlDialog = ref(false)
const documentUrl = ref('')

// 加载示例文档
const loadSampleDocument = async (type: 'docx' | 'xlsx' | 'pptx') => {
  try {
    // 这里创建一个新文档作为示例
    await officeEditorRef.value?.createNewDocument(type)
    toast.success(`已创建新的 ${type.toUpperCase()} 文档`)
  } catch (error) {
    console.error('Failed to load sample document:', error)
    toast.error('加载示例文档失败')
  }
}

// 显示 URL 输入对话框
const loadFromUrl = () => {
  showUrlDialog.value = true
}

// 从 URL 加载文档
const loadDocumentFromUrl = async () => {
  if (!documentUrl.value) {
    toast.error('请输入有效的 URL')
    return
  }

  try {
    await officeEditorRef.value?.loadDocumentFromUrl(documentUrl.value)
    showUrlDialog.value = false
    documentUrl.value = ''
    toast.success('文档加载成功')
  } catch (error) {
    console.error('Failed to load document from URL:', error)
    toast.error('从 URL 加载文档失败')
  }
}

// 事件处理函数
const onDocumentLoaded = (document: any) => {
  console.log('文档已加载:', document)
  toast.success(`文档 "${document.fileName}" 加载成功`)
}

const onDocumentSaved = (document: any, data: ArrayBuffer) => {
  console.log('文档已保存:', document, data)
  // 这里可以处理保存后的逻辑，比如上传到服务器
}

const onError = (error: Error) => {
  console.error('编辑器错误:', error)
  toast.error(`编辑器错误: ${error.message}`)
}
</script>
