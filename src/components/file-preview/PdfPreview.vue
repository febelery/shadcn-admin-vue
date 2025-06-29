<template>
  <div class="bg-background flex h-full w-full flex-col rounded-lg p-2">
    <!-- 工具栏 -->
    <div class="border-border bg-muted/50 border-b px-4 py-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <h3 class="text-foreground text-sm font-medium">PDF 文档预览</h3>
          <div class="text-muted-foreground text-sm">{{ file.name }}</div>
        </div>
        <div class="flex items-center gap-2">
          <!-- 页面导航 -->
          <div class="flex items-center gap-2">
            <Button variant="outline" size="sm" :disabled="currentPage <= 1" @click="goToPreviousPage">
              <ChevronLeft class="h-4 w-4" />
            </Button>

            <!-- 页面快速跳转下拉菜单 -->
            <div class="relative">
              <Button variant="outline" size="sm" @click="togglePageDropdown" class="min-w-[80px] justify-between">
                <span class="text-sm">{{ currentPage }} / {{ totalPages }}</span>
                <ChevronDown class="ml-1 h-3 w-3" />
              </Button>

              <!-- 下拉菜单 -->
              <div
                v-if="showPageDropdown"
                class="bg-background border-border absolute top-full left-0 z-50 mt-1 max-h-[300px] min-w-[200px] overflow-auto rounded-md border shadow-lg"
                @click.stop
              >
                <!-- 快速跳转输入框 -->
                <div class="border-border border-b p-2">
                  <div class="flex items-center gap-2">
                    <input
                      ref="pageInputRef"
                      v-model="pageInputValue"
                      type="number"
                      :min="1"
                      :max="totalPages"
                      placeholder="跳转到..."
                      class="border-border bg-background text-foreground focus:ring-primary flex-1 rounded border px-2 py-1 text-sm focus:ring-1 focus:outline-none"
                      @keydown.enter="goToPageFromInput"
                      @keydown.escape="closePageDropdown"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      @click="goToPageFromInput"
                      :disabled="!isValidPageInput"
                      class="px-2"
                    >
                      跳转
                    </Button>
                  </div>
                </div>

                <!-- 页面列表 -->
                <div class="max-h-[200px] overflow-auto">
                  <div
                    v-for="pageNum in totalPages"
                    :key="pageNum"
                    class="hover:bg-muted flex cursor-pointer items-center justify-between px-3 py-2 text-sm"
                    :class="{ 'bg-muted text-primary font-medium': pageNum === currentPage }"
                    @click="goToPageAndClose(pageNum)"
                  >
                    <span>第 {{ pageNum }} 页</span>
                    <span v-if="pageNum === currentPage" class="text-muted-foreground text-xs">当前</span>
                  </div>
                </div>

                <!-- 快速跳转选项 -->
                <div class="border-border border-t p-2">
                  <div class="text-muted-foreground flex items-center justify-between text-xs">
                    <button
                      @click="goToPageAndClose(1)"
                      class="hover:text-foreground transition-colors"
                      :class="{ 'text-primary': currentPage === 1 }"
                    >
                      首页
                    </button>
                    <button
                      @click="goToPageAndClose(Math.ceil(totalPages / 2))"
                      class="hover:text-foreground transition-colors"
                      :class="{ 'text-primary': currentPage === Math.ceil(totalPages / 2) }"
                    >
                      中间页
                    </button>
                    <button
                      @click="goToPageAndClose(totalPages)"
                      class="hover:text-foreground transition-colors"
                      :class="{ 'text-primary': currentPage === totalPages }"
                    >
                      末页
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm" :disabled="currentPage >= totalPages" @click="goToNextPage">
              <ChevronRight class="h-4 w-4" />
            </Button>
          </div>

          <!-- 缩放控制 -->
          <div class="flex items-center gap-2">
            <Button variant="outline" size="sm" :disabled="scale <= 0.5" @click="zoomOut">
              <ZoomOut class="h-4 w-4" />
            </Button>
            <span class="text-muted-foreground text-sm">{{ Math.round(scale * 100) }}%</span>
            <Button variant="outline" size="sm" :disabled="scale >= 3" @click="zoomIn">
              <ZoomIn class="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" @click="resetZoom"> 重置 </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- PDF 内容区域 -->
    <div class="flex-1 overflow-auto">
      <div v-if="loading" class="flex h-full items-center justify-center">
        <div class="text-center">
          <div
            class="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
          ></div>
          <p class="text-muted-foreground text-sm">正在加载 PDF 文档...</p>
        </div>
      </div>

      <div v-else-if="error" class="flex h-full items-center justify-center">
        <div class="text-center">
          <div class="text-destructive mb-4">
            <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p class="text-muted-foreground text-sm">{{ error }}</p>
          <p class="text-muted-foreground mt-2 text-xs">请确保文件是有效的 PDF 文档</p>
          <Button variant="outline" size="sm" @click="retryLoad" class="mt-4"> 重试 </Button>
        </div>
      </div>

      <div v-else class="flex justify-center p-4">
        <div class="flex flex-col items-center">
          <!-- PDF 页面渲染区域 -->
          <canvas
            ref="canvasRef"
            class="border-border max-w-full rounded-lg border shadow-sm"
            :style="{
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease',
            }"
          ></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-vue-next'
// PDF.js 相关导入
import * as pdfjsLib from 'pdfjs-dist'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { Button } from '@/components/ui/button'

// 设置 PDF.js worker - 使用正确的worker路径
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

const props = defineProps<{
  file: File
  fileUrl: string
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const pageInputRef = ref<HTMLInputElement | null>(null)
const loading = ref(true)
const error = ref('')
let pdfDocument: any = null
const currentPage = ref(1)
const totalPages = ref(0)
const scale = ref(1.0)
const retryCount = ref(0)
const maxRetries = 3

// 页面下拉菜单相关状态
const showPageDropdown = ref(false)
const pageInputValue = ref('')

// 计算属性：验证输入的页码是否有效
const isValidPageInput = computed(() => {
  const num = parseInt(pageInputValue.value)
  return !isNaN(num) && num >= 1 && num <= totalPages.value
})

// 切换页面下拉菜单
const togglePageDropdown = () => {
  showPageDropdown.value = !showPageDropdown.value
  if (showPageDropdown.value) {
    pageInputValue.value = ''
    // 延迟聚焦到输入框
    nextTick(() => {
      pageInputRef.value?.focus()
    })
  }
}

// 关闭页面下拉菜单
const closePageDropdown = () => {
  showPageDropdown.value = false
  pageInputValue.value = ''
}

// 从输入框跳转到指定页面
const goToPageFromInput = () => {
  if (isValidPageInput.value) {
    const pageNum = parseInt(pageInputValue.value)
    goToPageAndClose(pageNum)
  }
}

// 跳转到指定页面并关闭下拉菜单
const goToPageAndClose = (pageNum: number) => {
  goToPage(pageNum)
  closePageDropdown()
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (showPageDropdown.value && !target.closest('.relative')) {
    closePageDropdown()
  }
}

// 缩放控制
const zoomIn = () => {
  if (scale.value < 3) {
    scale.value = Math.min(3, scale.value + 0.1)
    renderCurrentPage()
  }
}

const zoomOut = () => {
  if (scale.value > 0.5) {
    scale.value = Math.max(0.5, scale.value - 0.1)
    renderCurrentPage()
  }
}

const resetZoom = () => {
  scale.value = 1.0
  renderCurrentPage()
}

// 页面导航
const goToPage = (pageNum: number) => {
  if (pageNum >= 1 && pageNum <= totalPages.value) {
    currentPage.value = pageNum
    renderCurrentPage()
  }
}

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    renderCurrentPage()
  }
}

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    renderCurrentPage()
  }
}

// 重试加载
const retryLoad = () => {
  retryCount.value++
  loadPdfFile()
}

// 渲染当前页面 - 修复版本兼容性问题
const renderCurrentPage = async () => {
  if (!pdfDocument || !canvasRef.value) return

  try {
    const page = await pdfDocument.getPage(currentPage.value)
    const canvas = canvasRef.value
    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error('无法获取 Canvas 上下文')
    }

    // 使用固定的基础缩放比例，再应用用户缩放
    const viewport = page.getViewport({ scale: 1.5 })

    // 设置 canvas 尺寸
    canvas.height = viewport.height
    canvas.width = viewport.width

    // 渲染页面
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    }

    const renderTask = page.render(renderContext)
    await renderTask.promise
  } catch (err: any) {
    console.error('渲染 PDF 页面失败:', err)
    error.value = `渲染页面失败: ${err.message}`
  }
}

// 验证文件格式
const validateFile = (data: ArrayBuffer): void => {
  if (data.byteLength === 0) {
    throw new Error('文件为空，请选择有效的 PDF 文档')
  }

  if (data.byteLength > 100 * 1024 * 1024) {
    // 100MB 限制
    throw new Error('文件过大，请选择小于 100MB 的文档')
  }

  // 检查 PDF 文件头
  const uint8Array = new Uint8Array(data)
  const header = String.fromCharCode(...uint8Array.slice(0, 4))

  if (!header.startsWith('%PDF')) {
    throw new Error('文件格式不正确，请选择有效的 PDF 文件')
  }
}

// 加载 PDF 文件
const loadPdfFile = async () => {
  loading.value = true
  error.value = ''
  pdfDocument = null

  try {
    // 1. 获取文件数据
    let arrayBuffer: ArrayBuffer

    if (props.fileUrl.startsWith('blob:')) {
      // 本地文件
      arrayBuffer = await props.file.arrayBuffer()
    } else {
      // 远程文件
      const response = await fetch(props.fileUrl)
      if (!response.ok) {
        throw new Error(`文件下载失败: HTTP ${response.status}`)
      }
      arrayBuffer = await response.arrayBuffer()
    }

    // 2. 验证文件
    validateFile(arrayBuffer)

    // 3. 加载 PDF 文档 - 使用第二个版本的配置
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      cMapUrl: 'https://unpkg.com/pdfjs-dist@4.8.69/cmaps/',
      cMapPacked: true,
    })

    pdfDocument = await loadingTask.promise
    totalPages.value = pdfDocument.numPages
    currentPage.value = 1

    // 4. 渲染第一页
    await nextTick()
    await renderCurrentPage()

    retryCount.value = 0 // 重置重试计数
  } catch (err: any) {
    console.error('加载 PDF 文件时出错:', err)

    // 提供更详细的错误信息
    let errorMessage = '无法加载 PDF 文档'

    if (err.message.includes('文件为空')) {
      errorMessage = '文件为空，请选择有效的 PDF 文档'
    } else if (err.message.includes('文件过大')) {
      errorMessage = '文件过大，请选择小于 100MB 的文档'
    } else if (err.message.includes('文件格式不正确')) {
      errorMessage = '文件格式不正确，请选择有效的 PDF 文件'
    } else if (err.message.includes('文件下载失败') || err.message.includes('HTTP')) {
      errorMessage = '文件下载失败，请检查网络连接后重试'
    } else if (err.message.includes('Invalid PDF')) {
      errorMessage = 'PDF 文件损坏或格式不支持'
    } else if (err.message.includes('NetworkError') || err.message.includes('fetch')) {
      errorMessage = '网络错误，请检查连接后重试'
    } else if (err.message.includes('password')) {
      errorMessage = 'PDF 文件受密码保护，暂不支持预览'
    } else {
      errorMessage = `加载失败: ${err.message}`
    }

    error.value = errorMessage

    // 如果是网络问题且重试次数未达到上限，自动重试
    if ((err.message.includes('网络') || err.message.includes('下载')) && retryCount.value < maxRetries) {
      console.log(`自动重试 (${retryCount.value + 1}/${maxRetries})...`)
      setTimeout(() => {
        retryLoad()
      }, 1000)
    }
  } finally {
    loading.value = false
  }
}

// 监听文件变化，重新加载
watch(
  () => props.file,
  () => {
    retryCount.value = 0
    loadPdfFile()
  },
  { immediate: false }
)

// 组件挂载时加载文件
onMounted(async () => {
  // 确保组件完全挂载后再加载文件
  await nextTick()
  loadPdfFile()

  // 添加全局点击事件监听
  document.addEventListener('click', handleClickOutside)
})

// 组件卸载时清理事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* 输入框样式优化 */
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
