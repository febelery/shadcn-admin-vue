<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { ArrowLeft, Eye, Save } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { createArticleApi, updateArticleApi } from '@/api/articles'
import type { Article } from '@/api/articles'
import { FileType } from '@/components/file-upload/types'

interface Props {
  mode: 'create' | 'edit'
  articleData?: Article // 编辑模式下传入的文章数据
}

const props = defineProps<Props>()
const router = useRouter()

// 定义表单验证 schema
const formSchema = z.object({
  title: z.string().min(5, '标题至少需要5个字符').max(100, '标题不能超过100个字符'),
  excerpt: z.string().min(10, '摘要至少需要10个字符').max(300, '摘要不能超过300个字符').optional(),
  content: z.string().min(10, '文章内容至少需要10个字符'),

  // 单个封面图片
  cover: z
    .string()
    .fileUpload({
      acceptedTypes: FileType.IMAGE_ALL,
      maxFiles: 1,
      maxSize: 5 * 1024 * 1024, // 5MB
    })
    .describe('文章封面图片'),

  // 多个附件（混合类型）
  attachments: z
    .array(z.string())
    .fileUpload({
      acceptedTypes: [FileType.IMAGE_ALL, FileType.DOCUMENT_ALL, FileType.VIDEO_ALL],
      maxFiles: 5,
      maxSize: 10 * 1024 * 1024, // 10MB
    })
    .optional()
    .describe('附件文件（支持图片和文档）'),

  category: z.enum(['tech', 'tools', 'tutorial', 'news'], {
    required_error: '请选择文章分类',
  }),
  tags: z
    .union([z.string(), z.array(z.string())]) // 接受字符串或字符串数组
    .optional()
    .transform((val) => {
      if (!val) return []

      // 如果已经是数组，直接返回
      if (Array.isArray(val)) {
        return val.filter(Boolean)
      }

      // 如果是字符串，按逗号分割
      return val
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    }),
  status: z.enum(['draft', 'published'], {
    required_error: '请选择发布状态',
  }),
})

// 创建表单实例
const form = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    title: '',
    excerpt: '',
    content: '',
    cover: '',
    attachments: [],
    category: 'tech' as const,
    tags: '',
    status: 'draft' as const,
  },
})

const isSubmitting = form.isSubmitting

// 监听 articleData 变化，设置表单值
watch(
  () => props.articleData,
  (articleData) => {
    if (props.mode === 'edit' && articleData) {
      form.setValues(articleData as any)
    }
  },
  { immediate: true }
)

// 页面标题和描述
const pageTitle = computed(() => {
  return props.mode === 'create' ? '写文章' : '编辑文章'
})

const pageDescription = computed(() => {
  return props.mode === 'create' ? '创建新的文章内容' : '修改文章内容'
})

const cardTitle = computed(() => {
  return props.mode === 'create' ? '文章信息' : '文章信息'
})

const cardDescription = computed(() => {
  return props.mode === 'create' ? '填写文章的基本信息和内容' : '修改文章的基本信息和内容'
})

const submitButtonText = computed(() => {
  if (isSubmitting.value) {
    return props.mode === 'create' ? '发布中...' : '保存中...'
  }
  return props.mode === 'create' ? '发布文章' : '保存更改'
})

const handleSubmit = async (values: any) => {
  try {
    if (props.mode === 'create') {
      // 创建模式：直接使用表单值
      await createArticleApi(values)
      const action = values.status === 'published' ? '发布' : '保存'
      toast.success(`文章${action}成功`)
    } else if (props.articleData) {
      // 编辑模式：基于表单值构建更新数据
      const updateData = {
        id: props.articleData.id,
        ...values,
      }

      await updateArticleApi(updateData)
      const action = values.status === 'published' ? '发布' : '保存'
      toast.success(`文章${action}成功`)
    }

    router.push('/articles')
  } catch (error: any) {
    const message = error?.response?.data?.message || `${props.mode === 'create' ? '发布' : '更新'}文章失败`
    toast.error(message)
  }
}

const goBack = () => {
  router.push('/articles')
}

// 字段配置 - 修改部分
const fieldConfig = computed(() => ({
  title: {
    label: '标题',
    description: '文章的标题，建议简洁明了',
    inputProps: {
      placeholder: '请输入文章标题',
    },
  },
  excerpt: {
    label: '摘要',
    description: '文章的简短描述，用于搜索和预览',
    component: 'textarea' as const, // 添加 as const
    inputProps: {
      placeholder: '请输入文章摘要',
    },
  },
  content: {
    label: '文章内容',
    description: '文章的详细内容，支持富文本编辑',
    component: 'editor' as const, // 添加 as const
    inputProps: {
      mode: 'full',
      class: 'min-h-[400px]',
    },
  },
  cover: {
    label: '封面图片',
    description: '文章的封面图片，建议尺寸 16:9',
  },
  attachments: {
    label: '附件文件',
  },
  category: {
    label: '分类',
    description: '选择文章所属的分类',
    component: 'select' as const, // 添加 as const
  },
  tags: {
    label: '标签',
    description: '用逗号分隔多个标签，如：Vue,JavaScript,前端',
    inputProps: {
      placeholder: '用逗号分隔多个标签',
    },
  },
  status: {
    label: '状态',
    description: '选择文章的发布状态',
    component: 'select' as const, // 添加 as const
  },
}))

// 提示信息
const tips = computed(() => {
  if (props.mode === 'create') {
    return [
      { text: '标题要简洁明了，突出文章主题', color: 'bg-blue-500' },
      { text: '摘要控制在150字以内，概括文章要点', color: 'bg-blue-500' },
      { text: '封面图片建议使用 16:9 比例', color: 'bg-blue-500' },
      { text: '合理使用标签便于读者检索', color: 'bg-blue-500' },
      { text: '定期保存避免内容丢失', color: 'bg-blue-500' },
    ]
  } else {
    return [
      { text: '修改后的内容会立即生效', color: 'bg-amber-500' },
      { text: '状态变更会影响文章的可见性', color: 'bg-amber-500' },
      { text: '建议在草稿状态下完善内容', color: 'bg-amber-500' },
      { text: '发布后读者可以立即看到更新', color: 'bg-amber-500' },
    ]
  }
})
</script>

<template>
  <div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
    <!-- 页面头部 -->
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="icon" @click="goBack">
        <ArrowLeft class="h-4 w-4" />
      </Button>
      <div class="flex-1">
        <h1 class="text-2xl font-bold tracking-tight">{{ pageTitle }}</h1>
        <p class="text-muted-foreground">{{ pageDescription }}</p>
      </div>
    </div>

    <!-- 表单 -->
    <div class="grid gap-6 lg:grid-cols-4">
      <div class="space-y-6 lg:col-span-3">
        <!-- 文章表单 -->
        <Card>
          <CardHeader>
            <CardTitle>{{ cardTitle }}</CardTitle>
            <CardDescription>{{ cardDescription }}</CardDescription>
          </CardHeader>
          <CardContent>
            <AutoForm
              :form="form"
              :schema="formSchema"
              :field-config="fieldConfig"
              @submit="handleSubmit"
              class="space-y-6"
            >
              <template #customAutoForm="{ fields }">
                <!-- 基本信息字段 -->
                <div class="grid gap-6 md:grid-cols-2">
                  <AutoFormField
                    v-if="fields.title"
                    :config="fields.title.config"
                    :field-name="fields.title.fieldName"
                    :shape="fields.title.shape"
                  />
                  <AutoFormField
                    v-if="fields.category"
                    :config="fields.category.config"
                    :field-name="fields.category.fieldName"
                    :shape="fields.category.shape"
                  />
                </div>

                <!-- 摘要字段 -->
                <AutoFormField
                  v-if="fields.excerpt"
                  :config="fields.excerpt.config"
                  :field-name="fields.excerpt.fieldName"
                  :shape="fields.excerpt.shape"
                />

                <!-- 封面图片 -->
                <AutoFormField
                  v-if="fields.cover"
                  :config="fields.cover.config"
                  :field-name="fields.cover.fieldName"
                  :shape="fields.cover.shape"
                />

                <!-- 附件文件 -->
                <AutoFormField
                  v-if="fields.attachments"
                  :config="fields.attachments.config"
                  :field-name="fields.attachments.fieldName"
                  :shape="fields.attachments.shape"
                />

                <!-- 标签和状态 -->
                <div class="grid gap-6 md:grid-cols-2">
                  <AutoFormField
                    v-if="fields.tags"
                    :config="fields.tags.config"
                    :field-name="fields.tags.fieldName"
                    :shape="fields.tags.shape"
                  />
                  <AutoFormField
                    v-if="fields.status"
                    :config="fields.status.config"
                    :field-name="fields.status.fieldName"
                    :shape="fields.status.shape"
                  />
                </div>

                <!-- 内容编辑器 -->
                <AutoFormField
                  v-if="fields.content"
                  :config="fields.content.config"
                  :field-name="fields.content.fieldName"
                  :shape="fields.content.shape"
                />
              </template>

              <div class="flex gap-4 pt-4">
                <Button type="submit" class="flex-1" :disabled="isSubmitting">
                  <Eye class="mr-2 h-4 w-4" />
                  {{ submitButtonText }}
                </Button>
                <Button type="button" variant="outline" @click="goBack" class="flex-1"> 取消 </Button>
              </div>
            </AutoForm>
          </CardContent>
        </Card>
      </div>

      <!-- 侧边栏 -->
      <div class="space-y-6">
        <!-- 写作提示 -->
        <Card>
          <CardHeader>
            <CardTitle>{{ mode === 'create' ? '写作提示' : '编辑提示' }}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="text-muted-foreground space-y-2 text-sm">
              <li v-for="(tip, index) in tips" :key="index" class="flex items-start gap-2">
                <div :class="`mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full ${tip.color}`"></div>
                <span>{{ tip.text }}</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <!-- 文件上传示例 -->
        <Card>
          <CardHeader>
            <CardTitle class="text-sm">文件上传示例</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <!-- 单文件上传 -->
            <div class="space-y-2">
              <div class="text-xs font-medium text-blue-600">单文件上传</div>
              <div class="bg-muted rounded-md p-2">
                <code class="text-xs break-all">
                  z.string().fileUpload({<br />
                  &nbsp;&nbsp;acceptedTypes: FileType.IMAGE_ALL,<br />
                  &nbsp;&nbsp;maxFiles: 1<br />
                  })
                </code>
              </div>
            </div>

            <!-- 多文件上传 -->
            <div class="space-y-2">
              <div class="text-xs font-medium text-green-600">多文件上传</div>
              <div class="bg-muted rounded-md p-2">
                <code class="text-xs break-all">
                  z.array(z.string()).fileUpload({<br />
                  &nbsp;&nbsp;acceptedTypes: FileType.IMAGE_ALL,<br />
                  &nbsp;&nbsp;maxFiles: 5<br />
                  })
                </code>
              </div>
            </div>

            <!-- 混合类型 -->
            <div class="space-y-2">
              <div class="text-xs font-medium text-purple-600">混合类型</div>
              <div class="bg-muted rounded-md p-2">
                <code class="text-xs break-all">
                  z.array(z.string()).fileUpload({<br />
                  &nbsp;&nbsp;acceptedTypes: [<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;FileType.IMAGE_ALL,<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;FileType.PDF,<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;FileType.WORD_DOCX<br />
                  &nbsp;&nbsp;]<br />
                  })
                </code>
              </div>
            </div>

            <!-- 大小限制 -->
            <div class="space-y-2">
              <div class="text-xs font-medium text-orange-600">大小限制</div>
              <div class="bg-muted rounded-md p-2">
                <code class="text-xs break-all">
                  .fileUpload({<br />
                  &nbsp;&nbsp;maxSize: 10 * 1024 * 1024 // 10MB<br />
                  })
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 上传提示 -->
        <Card>
          <CardHeader>
            <CardTitle class="text-sm">上传说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-muted-foreground space-y-2 text-xs">
              <div class="flex items-start gap-2">
                <div class="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-green-500"></div>
                <span>支持 JPG、PNG、GIF、WebP 格式</span>
              </div>
              <div class="flex items-start gap-2">
                <div class="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-green-500"></div>
                <span>单个文件最大 10MB</span>
              </div>
              <div class="flex items-start gap-2">
                <div class="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-green-500"></div>
                <span>建议图片尺寸 1200x675 像素</span>
              </div>
              <div class="flex items-start gap-2">
                <div class="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-green-500"></div>
                <span>支持拖拽上传和粘贴上传</span>
              </div>
              <div class="flex items-start gap-2">
                <div class="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-green-500"></div>
                <span>多文件上传支持混合类型</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 编辑模式下显示文章信息 -->
        <Card v-if="mode === 'edit' && articleData">
          <CardHeader>
            <CardTitle class="text-sm">文章信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-muted-foreground">作者</span>
                <span>{{ articleData.author }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">创建时间</span>
                <span>{{ new Date(articleData.createdAt).toLocaleDateString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">最后修改</span>
                <span>{{ new Date(articleData.updatedAt).toLocaleDateString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">浏览次数</span>
                <span>{{ articleData.views }}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
