<template>
  <div ref="divRef" :class="cn(modeClass, 'rounded-xl', $props.class)"></div>
</template>

<script setup lang="ts">
import { AiEditor } from 'aieditor'
import 'aieditor/dist/style.css'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import { toast } from 'vue-sonner'
import { uploadToQiniu, uploadUrl } from '@/components/file-upload/fileUploadService'
import { createUploadFile } from '@/components/file-upload/fileUtils'
import { cn } from '@/lib/utils'

const divRef = ref()
let aiEditor: AiEditor | null = null

type EditorMode = 'full' | 'lite' | 'pure'

interface EditorProps {
  class?: HTMLAttributes['class']
  modelValue: string
  mode?: EditorMode
}

const props = withDefaults(defineProps<EditorProps>(), {
  mode: 'full',
})

const emit = defineEmits(['update:modelValue'])

const toolbarFull = [
  'undo',
  'redo',
  'brush',
  'eraser',
  '|',
  'heading',
  'font-family',
  'font-size',
  '|',
  'bold',
  'italic',
  'underline',
  'strike',
  'link',
  'code',
  'subscript',
  'superscript',
  'hr',
  'todo',
  'emoji',
  '|',
  'highlight',
  'font-color',
  '|',
  'align',
  'line-height',
  '|',
  'bullet-list',
  'ordered-list',
  'indent-decrease',
  'indent-increase',
  'break',
  '|',
  'image',
  'video',
  // 'attachment',
  'quote',
  'code-block',
  'table',
  '|',
  'source-code',
  'printer',
  'fullscreen',
]

const toolbarLite = [
  'undo',
  'redo',
  '|',
  'heading',
  'font-size',
  '|',
  'bold',
  'italic',
  'underline',
  'strike',
  'link',
  'emoji',
  '|',
  'font-color',
  'align',
  '|',
  'bullet-list',
  'ordered-list',
  '|',
  'image',
  'quote',
  'table',
  '|',
  'fullscreen',
]

const toolbarPure = ['bold', 'italic', 'underline', 'strike', '|', 'bullet-list', 'ordered-list']

const getToolbar = (mode: EditorMode = 'full') => {
  switch (mode) {
    case 'pure':
      return toolbarPure
    case 'lite':
      return toolbarLite
    case 'full':
    default:
      return toolbarFull
  }
}

// ✅ 不同模式下的宽度样式
const modeClass = computed(() => {
  switch (props.mode) {
    case 'pure':
      return 'w-md h-40'
    case 'lite':
      return 'w-3xl h-80'
    case 'full':
    default:
      return 'w-full h-120'
  }
})

onMounted(() => {
  aiEditor = new AiEditor({
    element: divRef.value as Element,
    placeholder: '',
    content: props.modelValue,
    toolbarKeys: getToolbar(props.mode),
    textSelectionBubbleMenu: {
      enable: false,
    },
    onChange: (editor) => {
      emit('update:modelValue', editor.getHtml())
    },
    image: {
      allowBase64: false,
      defaultSize: 350,
      uploadUrl: uploadUrl,
      uploader: uploader,
      uploaderEvent: uploaderEvent,
    },
    video: {
      uploadUrl: uploadUrl,
      uploader: uploader,
      uploaderEvent: uploaderEvent,
    },
  })
})

const uploader = (file: File): Promise<Record<string, any>> => {
  return new Promise((resolve, reject) => {
    // 调用uploadToQiniu函数上传文件
    uploadToQiniu(
      createUploadFile(file),
      () => {},
      (url) => {
        // 返回AiEditor期望的格式
        resolve({
          errorCode: 0,
          data: {
            path: url,
          },
        })
      },
      (error) => {
        toast.error('上传失败', {
          description: error.message,
        })
        reject({
          errorCode: 1,
          msg: error.message,
        })
      }
    )
  })
}

const uploaderEvent = {
  // onUploadBefore: (file, uploadUrl, headers) => {},
  onSuccess: (file: any, response: any) => {
    return {
      errorCode: 0,
      data: {
        src: response?.data?.path,
      },
    }
  },
  // onFailed: (file, response) => {},
  // onError: (file, error) => {},
}

onUnmounted(() => {
  aiEditor?.destroy()
  aiEditor = null
})
</script>

<style scoped>
:deep(aie-footer) {
  display: none !important;
}
</style>
