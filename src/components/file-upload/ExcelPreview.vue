<template>
  <div class="flex h-full w-full flex-col bg-background">
    <!-- 工具栏 -->
    <div class="border-b border-border bg-muted/50 px-4 py-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <!-- 工作表选择器 -->
          <div v-if="sheetNames.length > 1" class="flex items-center gap-2">
            <span class="text-sm font-medium text-foreground">工作表:</span>
            <div class="relative">
              <select
                v-model="currentSheet"
                class="appearance-none rounded border border-input bg-background px-2 py-1 pr-8 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option v-for="name in sheetNames" :key="name" :value="name">
                  {{ name }}
                </option>
              </select>
              <!-- 自定义下拉箭头 -->
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <svg class="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- 数据信息 -->
          <div class="text-sm text-muted-foreground">{{ currentData.length }} 行 × {{ currentData[0]?.length || 0 }} 列</div>
        </div>
      </div>
    </div>

    <!-- 表格容器 -->
    <div class="flex-1 overflow-auto">
      <div v-if="loading" class="flex h-full items-center justify-center">
        <div class="text-center">
          <div
            class="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
          ></div>
          <p class="text-sm text-muted-foreground">正在解析 Excel 文件...</p>
        </div>
      </div>

      <div v-else-if="error" class="flex h-full items-center justify-center">
        <div class="text-center">
          <div class="mb-4 text-destructive">
            <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p class="text-sm text-muted-foreground">{{ error }}</p>
        </div>
      </div>

      <table v-else-if="currentData.length > 0" class="w-full border-collapse">
        <thead class="sticky top-0 bg-muted/80 backdrop-blur-sm">
          <tr>
            <!-- 行号列 -->
            <th class="w-12 border border-border bg-muted px-2 py-1 text-center text-xs font-medium text-muted-foreground">
              #
            </th>
            <!-- 数据列 -->
            <th
              v-for="(cell, colIndex) in currentData[0]"
              :key="colIndex"
              class="max-w-[200px] min-w-[100px] border border-border bg-muted px-2 py-1 text-left text-xs font-medium text-foreground"
            >
              {{ getColumnName(colIndex) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in displayData" :key="rowIndex" class="hover:bg-muted/50 transition-colors">
            <!-- 行号 -->
            <td class="border border-border bg-muted/30 px-2 py-1 text-center text-xs text-muted-foreground">
              {{ rowIndex + 1 }}
            </td>
            <!-- 数据单元格 -->
            <td
              v-for="(cell, colIndex) in row"
              :key="colIndex"
              class="max-w-[200px] truncate border border-border bg-background px-2 py-1 text-sm text-foreground"
              :title="String(cell || '')"
            >
              {{ formatCellValue(cell) }}
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="flex h-full items-center justify-center">
        <div class="text-center">
          <p class="text-sm text-muted-foreground">Excel 文件为空或无法读取</p>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="currentData.length > pageSize" class="border-t border-border bg-muted/50 px-4 py-2">
      <div class="flex items-center justify-between">
        <div class="text-sm text-muted-foreground">
          显示 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, currentData.length) }} 行，
          共 {{ currentData.length }} 行
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="currentPage--"
            :disabled="currentPage <= 1"
            class="rounded border border-input bg-background px-3 py-1 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            上一页
          </button>
          <span class="text-sm text-muted-foreground"> {{ currentPage }} / {{ totalPages }} </span>
          <button
            @click="currentPage++"
            :disabled="currentPage >= totalPages"
            class="rounded border border-input bg-background px-3 py-1 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as XLSX from 'xlsx'
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  file: File
  fileUrl: string
}>()

const loading = ref(true)
const error = ref('')
const workbook = ref<XLSX.WorkBook | null>(null)
const sheetNames = ref<string[]>([])
const currentSheet = ref('')
const currentPage = ref(1)
const pageSize = 100 // 每页显示的行数

// 当前工作表的数据
const currentData = computed(() => {
  if (!workbook.value || !currentSheet.value) return []

  const worksheet = workbook.value.Sheets[currentSheet.value]
  if (!worksheet) return []

  // 转换为二维数组，保留空单元格
  const jsonData = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: '', // 空单元格的默认值
    raw: false, // 不使用原始值，转换为字符串
  }) as any[][]

  return jsonData
})

// 分页后的数据
const displayData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return currentData.value.slice(start, end)
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(currentData.value.length / pageSize)
})

// 获取列名（A, B, C, ...）
const getColumnName = (index: number): string => {
  let result = ''
  let num = index

  while (num >= 0) {
    result = String.fromCharCode(65 + (num % 26)) + result
    num = Math.floor(num / 26) - 1
  }

  return result
}

// 格式化单元格值
const formatCellValue = (value: any): string => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number') {
    // 检查是否是日期（Excel 日期是从 1900-01-01 开始的天数）
    if (value > 25569 && value < 2958465) {
      // 大致的日期范围
      try {
        const date = XLSX.SSF.parse_date_code(value)
        if (date) {
          return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`
        }
      } catch {
        // 如果解析失败，就当作普通数字处理
      }
    }
    return value.toString()
  }
  return String(value)
}

// 加载 Excel 文件
const loadExcelFile = async () => {
  loading.value = true
  error.value = ''

  try {
    let arrayBuffer: ArrayBuffer

    if (props.fileUrl.startsWith('blob:')) {
      // 本地文件
      arrayBuffer = await props.file.arrayBuffer()
    } else {
      // 远程文件
      const response = await fetch(props.fileUrl)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      arrayBuffer = await response.arrayBuffer()
    }

    // 解析 Excel 文件
    const wb = XLSX.read(arrayBuffer, { type: 'array' })
    workbook.value = wb
    sheetNames.value = wb.SheetNames

    if (sheetNames.value.length > 0) {
      currentSheet.value = sheetNames.value[0]
    }
  } catch (err: any) {
    console.error('Error loading Excel file:', err)
    error.value = err.message || '无法加载 Excel 文件'
  } finally {
    loading.value = false
  }
}

// 监听工作表变化，重置分页
watch(currentSheet, () => {
  currentPage.value = 1
})

// 组件挂载时加载文件
onMounted(() => {
  loadExcelFile()
})
</script>

<style scoped>
/* 自定义滚动条样式 - 适配 dark 模式 */
.overflow-auto::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: hsl(var(--muted));
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}

/* 表格样式优化 */
table {
  font-variant-numeric: tabular-nums;
}

th,
td {
  white-space: nowrap;
}

/* 确保表格在小屏幕上也能正常显示 */
@media (max-width: 768px) {
  th,
  td {
    min-width: 80px;
    font-size: 12px;
    padding: 4px 8px;
  }
}

/* 表格头部固定时的阴影效果 */
thead {
  box-shadow: 0 1px 3px 0 hsl(var(--border));
}

/* 表格行的交替背景色 */
tbody tr:nth-child(even) {
  background-color: hsl(var(--muted) / 0.3);
}

/* 表格单元格的边框优化 */
th,
td {
  border-color: hsl(var(--border));
}

/* 选中状态的样式 */
tbody tr:hover {
  background-color: hsl(var(--muted) / 0.7);
}

/* 加载和错误状态的样式优化 */
.loading-spinner {
  border-color: hsl(var(--primary));
  border-top-color: transparent;
}

/* 分页按钮的样式优化 */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button:not(:disabled):hover {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}
</style>