<template>
  <div class="bg-background flex h-full w-full flex-col rounded-lg p-2">
    <!-- 工具栏 -->
    <div class="border-border bg-muted/50 border-b px-4 py-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <h3 class="text-foreground text-sm font-medium">Word 文档预览</h3>
          <div class="text-muted-foreground text-sm">{{ file.name }}</div>
        </div>
        <div class="flex items-center gap-2">
          <!-- 缩放控制 -->
          <button
            @click="zoomOut"
            :disabled="zoom <= 0.5"
            class="border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground rounded border px-2 py-1 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          <span class="text-muted-foreground text-sm">{{ Math.round(zoom * 100) }}%</span>
          <button
            @click="zoomIn"
            :disabled="zoom >= 2"
            class="border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground rounded border px-2 py-1 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            @click="resetZoom"
            class="border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground rounded border px-2 py-1 text-sm transition-colors"
          >
            重置
          </button>
        </div>
      </div>
    </div>

    <!-- 文档容器 -->
    <div class="flex-1 overflow-auto">
      <div v-if="loading" class="flex h-full items-center justify-center">
        <div class="text-center">
          <div
            class="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
          ></div>
          <p class="text-muted-foreground text-sm">正在加载 Word 文档...</p>
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
          <p class="text-muted-foreground mt-2 text-xs">请确保文件是有效的 Word 文档格式</p>
          <button
            @click="retryLoad"
            class="border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground mt-4 rounded border px-3 py-1 text-sm transition-colors"
          >
            重试
          </button>
        </div>
      </div>

      <div v-else class="flex justify-center p-4">
        <div
          ref="docxContainer"
          class="docx-preview-container border-border bg-background max-w-full rounded-lg border shadow-sm"
          :style="{ transform: `scale(${zoom})`, transformOrigin: 'top center' }"
          v-html="htmlContent"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import mammoth from 'mammoth'
import { nextTick, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  file: File
  fileUrl: string
}>()

const loading = ref(true)
const error = ref('')
const docxContainer = ref<HTMLElement | null>(null)
const htmlContent = ref('')
const zoom = ref(1)
const retryCount = ref(0)
const maxRetries = 3

// 缩放控制
const zoomIn = () => {
  if (zoom.value < 2) {
    zoom.value = Math.min(2, zoom.value + 0.1)
  }
}

const zoomOut = () => {
  if (zoom.value > 0.5) {
    zoom.value = Math.max(0.5, zoom.value - 0.1)
  }
}

const resetZoom = () => {
  zoom.value = 1
}

// 重试加载
const retryLoad = () => {
  retryCount.value++
  loadDocxFile()
}

// 验证文件格式
const validateFile = (data: ArrayBuffer): void => {
  if (data.byteLength === 0) {
    throw new Error('文件为空，请选择有效的 Word 文档')
  }

  if (data.byteLength > 50 * 1024 * 1024) {
    // 50MB 限制
    throw new Error('文件过大，请选择小于 50MB 的文档')
  }

  // 检查文件头，确保是 DOCX 格式
  const uint8Array = new Uint8Array(data)
  const header = Array.from(uint8Array.slice(0, 4))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')

  // DOCX 文件是 ZIP 格式，应该以 PK 开头 (50 4B)
  if (!header.startsWith('504b')) {
    throw new Error('文件格式不正确，请选择有效的 .docx 文件')
  }
}

// 加载 DOCX 文件
const loadDocxFile = async () => {
  loading.value = true
  error.value = ''
  htmlContent.value = ''

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

    // 3. 使用 mammoth 转换 DOCX 为 HTML
    const options = {
      // 样式映射，将 Word 样式转换为 HTML/CSS
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "p[style-name='Heading 4'] => h4:fresh",
        "p[style-name='Heading 5'] => h5:fresh",
        "p[style-name='Heading 6'] => h6:fresh",
        "p[style-name='Title'] => h1.title:fresh",
        "p[style-name='Subtitle'] => h2.subtitle:fresh",
        "r[style-name='Strong'] => strong",
        "r[style-name='Emphasis'] => em",
        "p[style-name='Quote'] => blockquote > p:fresh",
        "p[style-name='Code'] => pre:fresh",
        "r[style-name='Code Char'] => code",
      ],
      // 转换图片
      convertImage: mammoth.images.imgElement(function (image) {
        return image.read('base64').then(function (imageBuffer) {
          return {
            src: 'data:' + image.contentType + ';base64,' + imageBuffer,
          }
        })
      }),
      // 忽略空段落
      ignoreEmptyParagraphs: false,
      // 包含原始文本
      includeDefaultStyleMap: true,
    }

    const result = await mammoth.convertToHtml({ arrayBuffer }, options)

    // 4. 检查转换结果
    if (!result.value || result.value.trim().length === 0) {
      throw new Error('文档内容为空或无法解析')
    }

    // 5. 处理警告信息
    if (result.messages && result.messages.length > 0) {
      console.warn('转换警告:', result.messages)
      // 过滤出错误信息
      const errors = result.messages.filter((msg) => msg.type === 'error')
      if (errors.length > 0) {
        console.error('转换错误:', errors)
      }
    }

    // 6. 设置 HTML 内容
    htmlContent.value = result.value

    retryCount.value = 0 // 重置重试计数
  } catch (err: any) {
    console.error('加载 DOCX 文件时出错:', err)

    // 提供更详细的错误信息
    let errorMessage = '无法加载 Word 文档'

    if (err.message.includes('文件为空')) {
      errorMessage = '文件为空，请选择有效的 Word 文档'
    } else if (err.message.includes('文件过大')) {
      errorMessage = '文件过大，请选择小于 50MB 的文档'
    } else if (err.message.includes('文件格式不正确')) {
      errorMessage = '文件格式不正确，请选择有效的 .docx 文件'
    } else if (err.message.includes('文件下载失败') || err.message.includes('HTTP')) {
      errorMessage = '文件下载失败，请检查网络连接后重试'
    } else if (err.message.includes('文档内容为空')) {
      errorMessage = '文档内容为空或格式不支持'
    } else if (err.message.includes('NetworkError') || err.message.includes('fetch')) {
      errorMessage = '网络错误，请检查连接后重试'
    } else if (err.message.includes('not supported') || err.message.includes('unsupported')) {
      errorMessage = '不支持的文档格式或版本'
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
    loadDocxFile()
  },
  { immediate: false }
)

// 组件挂载时加载文件
onMounted(async () => {
  // 确保组件完全挂载后再加载文件
  await nextTick()
  loadDocxFile()
})
</script>

<style scoped>
/* 文档预览容器样式 */
.docx-preview-container {
  transition: transform 0.2s ease;
  min-width: 600px;
  max-width: 800px;
  min-height: 100px;
  padding: 2rem;
  line-height: 1.6;
}

/* 深度样式 - 美化 mammoth 生成的 HTML */
:deep(p) {
  color: hsl(var(--foreground));
  margin-bottom: 1rem;
  text-align: justify;
}

:deep(h1),
:deep(h2),
:deep(h3),
:deep(h4),
:deep(h5),
:deep(h6) {
  color: hsl(var(--foreground));
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
  line-height: 1.3;
}

:deep(h1) {
  font-size: 2rem;
  border-bottom: 2px solid hsl(var(--border));
  padding-bottom: 0.5rem;
}

:deep(h1.title) {
  font-size: 2.5rem;
  text-align: center;
  border-bottom: none;
  margin-bottom: 2rem;
}

:deep(h2) {
  font-size: 1.5rem;
}

:deep(h2.subtitle) {
  font-size: 1.25rem;
  text-align: center;
  color: hsl(var(--muted-foreground));
  font-weight: 400;
  margin-top: 0;
}

:deep(h3) {
  font-size: 1.25rem;
}

:deep(h4) {
  font-size: 1.125rem;
}

:deep(h5) {
  font-size: 1rem;
}

:deep(h6) {
  font-size: 0.875rem;
}

:deep(strong) {
  font-weight: 600;
  color: hsl(var(--foreground));
}

:deep(em) {
  font-style: italic;
  color: hsl(var(--muted-foreground));
}

:deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1.5rem 0;
  border: 1px solid hsl(var(--border));
  border-radius: 0.5rem;
  overflow: hidden;
}

:deep(table td),
:deep(table th) {
  border: 1px solid hsl(var(--border));
  padding: 0.75rem;
  text-align: left;
}

:deep(table th) {
  background-color: hsl(var(--muted));
  font-weight: 600;
  color: hsl(var(--foreground));
}

:deep(table tr:nth-child(even)) {
  background-color: hsl(var(--muted) / 0.3);
}

:deep(table tr:hover) {
  background-color: hsl(var(--muted) / 0.5);
}

:deep(ul),
:deep(ol) {
  margin: 1rem 0;
  padding-left: 2rem;
}

:deep(li) {
  margin-bottom: 0.5rem;
  color: hsl(var(--foreground));
}

:deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
  box-shadow: 0 4px 6px hsl(var(--border) / 0.1);
}

:deep(blockquote) {
  border-left: 4px solid hsl(var(--primary));
  padding-left: 1.5rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: hsl(var(--muted-foreground));
  background-color: hsl(var(--muted) / 0.3);
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
}

:deep(blockquote p) {
  margin-bottom: 0;
}

:deep(code) {
  background: hsl(var(--muted));
  color: hsl(var(--foreground));
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.875em;
}

:deep(pre) {
  background: hsl(var(--muted));
  color: hsl(var(--foreground));
  padding: 1.5rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1.5rem 0;
  border: 1px solid hsl(var(--border));
}

:deep(pre code) {
  background: transparent;
  padding: 0;
}

/* 文本选择样式 */
:deep(::selection) {
  background: hsl(var(--primary) / 0.2);
  color: hsl(var(--primary-foreground));
}

/* 链接样式 */
:deep(a) {
  color: hsl(var(--primary));
  text-decoration: underline;
  transition: color 0.2s ease;
}

:deep(a:hover) {
  color: hsl(var(--primary) / 0.8);
}

/* 水平分割线 */
:deep(hr) {
  border: none;
  height: 1px;
  background: hsl(var(--border));
  margin: 2rem 0;
}

/* 段落首行缩进（可选） */
:deep(p:not(:first-child)) {
  text-indent: 0; /* 如果需要首行缩进，可以设置为 2em */
}

/* 页面分隔效果 */
:deep(div) {
  page-break-inside: avoid;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .docx-preview-container {
    min-width: 100%;
    max-width: 100%;
    padding: 1rem;
  }

  :deep(h1) {
    font-size: 1.5rem;
  }

  :deep(h1.title) {
    font-size: 2rem;
  }

  :deep(h2) {
    font-size: 1.25rem;
  }

  :deep(h3) {
    font-size: 1.125rem;
  }

  :deep(table) {
    font-size: 0.875rem;
  }

  :deep(table td),
  :deep(table th) {
    padding: 0.5rem;
  }
}

/* 打印样式 */
@media print {
  .docx-preview-container {
    transform: none !important;
    box-shadow: none;
    border: none;
    max-width: none;
    min-width: none;
  }

  :deep(h1),
  :deep(h2),
  :deep(h3) {
    page-break-after: avoid;
  }

  :deep(table) {
    page-break-inside: avoid;
  }

  :deep(img) {
    page-break-inside: avoid;
  }
}
</style>
