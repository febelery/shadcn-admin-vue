# OfficeEditor 组件使用文档

## 概述

`OfficeEditor` 是一个基于 OnlyOffice 的 Vue 3 组件，支持 Word、Excel、PowerPoint 文档的创建、编辑和预览功能。

**注意**: 此组件已替代了原有的 `DocxPreview` 和 `ExcelPreview` 组件，现在 `FilePreview` 组件统一使用 `OfficeEditor` 来预览 Office 文档。

## 功能特性

- ✅ 支持新建文档（Word、Excel、PowerPoint）
- ✅ 支持打开本地文件
- ✅ 支持从 URL 加载远程文档
- ✅ 支持文档编辑和保存
- ✅ 支持只读模式
- ✅ 完整的工具栏界面
- ✅ 加载状态提示
- ✅ 错误处理
- ✅ **延迟初始化** - 编辑器仅在真正需要时才初始化，提升页面加载性能

## 安装依赖

确保项目中已安装以下依赖：

```bash
npm install vue-sonner @vueuse/core lucide-vue-next
```

## UI 组件

组件使用了以下 shadcn-vue UI 组件：

- `Dialog` - 模态对话框
- `Button` - 按钮组件
- `Badge` - 徽章组件
- `Input` - 输入框组件
- `Label` - 标签组件

确保项目中已安装这些组件。

## 基本使用

### 1. 导入组件

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { OfficeEditor } from '@/components/file-preview'

const editorRef = ref()
</script>
```

### 2. 基本模板

```vue
<template>
  <div class="h-screen">
    <OfficeEditor
      ref="editorRef"
      title="文档编辑器"
      height="100vh"
      :show-toolbar="true"
      :allow-create="true"
      :readonly="false"
      @document-loaded="onDocumentLoaded"
      @document-saved="onDocumentSaved"
      @error="onError"
    />
  </div>
</template>
```

## 组件属性 (Props)

| 属性名         | 类型      | 默认值      | 说明               |
| -------------- | --------- | ----------- | ------------------ |
| `title`        | `string`  | `undefined` | 编辑器标题         |
| `showToolbar`  | `boolean` | `true`      | 是否显示工具栏     |
| `allowCreate`  | `boolean` | `true`      | 是否允许创建新文档 |
| `height`       | `string`  | `'600px'`   | 编辑器高度         |
| `documentUrl`  | `string`  | `undefined` | 初始文档URL        |
| `documentFile` | `File`    | `undefined` | 初始文档文件       |
| `readonly`     | `boolean` | `false`     | 是否只读模式       |

## 事件 (Events)

| 事件名            | 参数                                        | 说明               |
| ----------------- | ------------------------------------------- | ------------------ |
| `document-loaded` | `document: DocumentType`                    | 文档加载完成时触发 |
| `document-saved`  | `document: DocumentType, data: ArrayBuffer` | 文档保存时触发     |
| `error`           | `error: Error`                              | 发生错误时触发     |

## 暴露的方法 (Exposed Methods)

通过 `ref` 可以调用以下方法：

```typescript
// 从 URL 加载文档
await editorRef.value.loadDocumentFromUrl('https://example.com/document.docx')

// 从文件加载文档
await editorRef.value.loadDocumentFromFile(file)

// 创建新文档
await editorRef.value.createNewDocument('docx') // 'docx' | 'xlsx' | 'pptx'

// 保存文档
editorRef.value.saveDocument()

// 获取当前文档信息
const currentDoc = editorRef.value.getCurrentDocument()

// 获取编辑器实例
const editor = editorRef.value.getEditor()
```

## 使用示例

### 1. 只读预览模式

```vue
<template>
  <OfficeEditor
    title="文档预览"
    :show-toolbar="false"
    :allow-create="false"
    :readonly="true"
    :document-url="documentUrl"
  />
</template>
```

### 2. 编辑模式

```vue
<template>
  <OfficeEditor
    title="文档编辑器"
    :show-toolbar="true"
    :allow-create="true"
    :readonly="false"
    @document-saved="handleSave"
  />
</template>

<script setup lang="ts">
const handleSave = (document: any, data: ArrayBuffer) => {
  // 处理保存逻辑，比如上传到服务器
  console.log('文档已保存:', document.fileName)
}
</script>
```

### 3. 预加载文档

```vue
<template>
  <OfficeEditor :document-file="selectedFile" @document-loaded="onLoaded" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedFile = ref<File>()

// 选择文件
const selectFile = (file: File) => {
  selectedFile.value = file
}

const onLoaded = (document: any) => {
  console.log('文档加载完成:', document)
}
</script>
```

### 4. 分离的打开方式

组件提供了两种独立的文档打开方式：

- **从本地打开**: 点击"从本地打开"按钮，选择本地文件
- **从URL打开**: 点击"从URL打开"按钮，在对话框中输入文档URL

这种设计让用户能够清楚地区分不同的文档来源，提供更好的用户体验。

```vue
<template>
  <!-- 工具栏中的按钮 -->
  <OfficeEditor>
    <!-- 会显示两个独立的按钮：
         - "从本地打开" - 打开文件选择器
         - "从URL打开" - 打开URL输入对话框 -->
  </OfficeEditor>
</template>
```

## 性能优化

### 延迟初始化

组件采用了延迟初始化策略，具有以下优势：

- **更快的页面加载**: 编辑器相关资源仅在需要时才加载
- **更少的内存占用**: 避免不必要的资源消耗
- **更好的用户体验**: 页面响应更快，用户可以立即看到界面

### 初始化时机

编辑器会在以下情况下自动初始化：

1. **组件挂载时有初始文档**: 如果传入了 `documentUrl` 或 `documentFile` 属性
2. **用户创建新文档**: 点击新建按钮时
3. **用户打开文档**: 点击打开按钮或选择文件时
4. **程序调用方法**: 调用 `loadDocumentFromUrl` 等方法时

### 预初始化

当用户点击"打开文档"按钮时，组件会预先初始化编辑器，这样在用户选择文件后可以更快地加载文档。

## 注意事项

1. **OnlyOffice 依赖**: 确保项目中已正确配置 OnlyOffice API，脚本路径为 `./web-apps/apps/api/documents/api.js`

2. **文件格式支持**: 目前支持以下格式：
   - Word: `.docx`, `.doc`
   - Excel: `.xlsx`, `.xls`
   - PowerPoint: `.pptx`, `.ppt`

3. **浏览器兼容性**: 需要现代浏览器支持，建议使用 Chrome、Firefox、Safari 等

4. **内存管理**: 组件会自动清理编辑器实例，避免内存泄漏

5. **错误处理**: 建议监听 `error` 事件来处理各种错误情况

6. **延迟初始化**: 首次使用时可能需要稍等片刻进行初始化，这是正常现象

## 样式定制

组件使用 Tailwind CSS 类名，可以通过以下方式自定义样式：

```vue
<template>
  <div class="custom-editor-container">
    <OfficeEditor class="custom-editor" />
  </div>
</template>

<style scoped>
.custom-editor-container {
  /* 自定义容器样式 */
}
</style>
```

## 故障排除

### 1. 编辑器无法加载

- 检查 OnlyOffice API 脚本是否正确加载
- 确认网络连接正常
- 查看浏览器控制台错误信息

### 2. 文档无法打开

- 确认文件格式是否支持
- 检查文件是否损坏
- 验证 URL 是否可访问（对于远程文档）

### 3. 保存功能异常

- 确认不是只读模式
- 检查文档转换工具是否正常工作
- 查看网络请求是否成功
