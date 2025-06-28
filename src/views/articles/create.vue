<script setup lang="ts">
import { ArrowLeft, Save, Eye } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { createArticleApi } from '@/api/articles'
import type { CreateArticleParams } from '@/api/articles'
import { FileType } from '@/components/file-upload/types'
import * as z from 'zod'

const router = useRouter()

// 定义表单验证 schema
const formSchema = z.object({
  title: z.string()
    .min(5, '标题至少需要5个字符')
    .max(100, '标题不能超过100个字符'),
  excerpt: z.string()
    .min(10, '摘要至少需要10个字符')
    .max(300, '摘要不能超过300个字符')
    .optional(),
  content: z.string()
    .min(10, '文章内容至少需要10个字符'),
  cover: z.string()
    .url('请上传有效的封面图片')
    .optional(),
  category: z.enum(['tech', 'tools', 'tutorial', 'news'], {
    required_error: '请选择文章分类',
  }),
  tags: z.string()
    .optional()
    .transform((val) => val ? val.split(',').map(tag => tag.trim()).filter(Boolean) : []),
  status: z.enum(['draft', 'published'], {
    required_error: '请选择发布状态',
  }),
})

const handleSubmit = async (values: z.infer<typeof formSchema>) => {
  try {
    const createData: CreateArticleParams = {
      title: values.title,
      excerpt: values.excerpt,
      content: values.content,
      category: values.category,
      tags: values.tags,
      status: values.status,
      cover: values.cover,
    }

    await createArticleApi(createData)
    
    const action = values.status === 'published' ? '发布' : '保存'
    toast.success(`文章${action}成功`)
    router.push('/articles')
  } catch (error: any) {
    const message = error?.response?.data?.message || '操作失败'
    toast.error(message)
    throw error // 重新抛出错误，让 AutoForm 处理
  }
}

const goBack = () => {
  router.push('/articles')
}
</script>

<template>
  <div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
    <!-- 页面头部 -->
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="icon" @click="goBack">
        <ArrowLeft class="h-4 w-4" />
      </Button>
      <div class="flex-1">
        <h1 class="text-2xl font-bold tracking-tight">写文章</h1>
        <p class="text-muted-foreground">创建新的文章内容</p>
      </div>
    </div>

    <!-- 表单 -->
    <div class="grid gap-6 lg:grid-cols-4">
      <div class="lg:col-span-3 space-y-6">
        <!-- 文章表单 -->
        <Card>
          <CardHeader>
            <CardTitle>文章信息</CardTitle>
            <CardDescription>填写文章的基本信息和内容</CardDescription>
          </CardHeader>
          <CardContent>
            <AutoForm
              :schema="formSchema"
              :field-config="{
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
                  component: 'textarea',
                  inputProps: {
                    placeholder: '请输入文章摘要',
                    rows: 3,
                  },
                },
                content: {
                  label: '文章内容',
                  description: '文章的详细内容，支持富文本编辑',
                  component: 'editor',
                  inputProps: {
                    mode: 'full',
                    class: 'min-h-[400px]',
                  },
                },
                cover: {
                  label: '封面图片',
                  description: '文章的封面图片，建议尺寸 16:9',
                  component: 'fileUpload',
                  inputProps: {
                    maxFiles: 1,
                    acceptedTypes: [FileType.IMAGE_ALL],
                    maxSize: 5 * 1024 * 1024, // 5MB
                    autoUpload: true,
                    useQiniu: true,
                  },
                },
                category: {
                  label: '分类',
                  description: '选择文章所属的分类',
                  component: 'select',
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
                  component: 'select',
                },
              }"
              @submit="handleSubmit"
              class="space-y-6"
            >
              <template #customAutoForm="{ fields }">
                <!-- 基本信息字段 -->
                <div class="grid gap-6 md:grid-cols-2">
                  <AutoFormField
                    :config="fields.title.config"
                    :field-name="fields.title.fieldName"
                    :shape="fields.title.shape"
                  />
                  <AutoFormField
                    :config="fields.category.config"
                    :field-name="fields.category.fieldName"
                    :shape="fields.category.shape"
                  />
                </div>
                
                <!-- 摘要字段 -->
                <AutoFormField
                  :config="fields.excerpt.config"
                  :field-name="fields.excerpt.fieldName"
                  :shape="fields.excerpt.shape"
                />
                
                <!-- 封面图片 -->
                <AutoFormField
                  :config="fields.cover.config"
                  :field-name="fields.cover.fieldName"
                  :shape="fields.cover.shape"
                />
                
                <!-- 标签和状态 -->
                <div class="grid gap-6 md:grid-cols-2">
                  <AutoFormField
                    :config="fields.tags.config"
                    :field-name="fields.tags.fieldName"
                    :shape="fields.tags.shape"
                  />
                  <AutoFormField
                    :config="fields.status.config"
                    :field-name="fields.status.fieldName"
                    :shape="fields.status.shape"
                  />
                </div>
                
                <!-- 内容编辑器 -->
                <AutoFormField
                  :config="fields.content.config"
                  :field-name="fields.content.fieldName"
                  :shape="fields.content.shape"
                />
              </template>

              <div class="flex gap-4 pt-4">
                <Button type="submit" class="flex-1">
                  <Eye class="mr-2 h-4 w-4" />
                  发布文章
                </Button>
                <Button type="button" variant="outline" @click="goBack" class="flex-1">
                  取消
                </Button>
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
            <CardTitle>写作提示</CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="text-sm text-muted-foreground space-y-2">
              <li class="flex items-start gap-2">
                <div class="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                <span>标题要简洁明了，突出文章主题</span>
              </li>
              <li class="flex items-start gap-2">
                <div class="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                <span>摘要控制在150字以内，概括文章要点</span>
              </li>
              <li class="flex items-start gap-2">
                <div class="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                <span>封面图片建议使用 16:9 比例</span>
              </li>
              <li class="flex items-start gap-2">
                <div class="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                <span>合理使用标签便于读者检索</span>
              </li>
              <li class="flex items-start gap-2">
                <div class="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                <span>定期保存避免内容丢失</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <!-- 分类说明 -->
        <Card>
          <CardHeader>
            <CardTitle>分类说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-3 text-sm">
              <div>
                <div class="font-medium text-blue-600">技术</div>
                <div class="text-muted-foreground">技术教程、开发经验</div>
              </div>
              <div>
                <div class="font-medium text-green-600">工具</div>
                <div class="text-muted-foreground">工具推荐、使用指南</div>
              </div>
              <div>
                <div class="font-medium text-purple-600">教程</div>
                <div class="text-muted-foreground">步骤详细的操作指南</div>
              </div>
              <div>
                <div class="font-medium text-orange-600">资讯</div>
                <div class="text-muted-foreground">行业动态、新闻资讯</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 上传提示 -->
        <Card>
          <CardHeader>
            <CardTitle>上传说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-3 text-sm text-muted-foreground">
              <div class="flex items-start gap-2">
                <div class="mt-1 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0"></div>
                <span>支持 JPG、PNG、GIF、WebP 格式</span>
              </div>
              <div class="flex items-start gap-2">
                <div class="mt-1 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0"></div>
                <span>单个文件最大 5MB</span>
              </div>
              <div class="flex items-start gap-2">
                <div class="mt-1 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0"></div>
                <span>建议图片尺寸 1200x675 像素</span>
              </div>
              <div class="flex items-start gap-2">
                <div class="mt-1 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0"></div>
                <span>支持拖拽上传和粘贴上传</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>