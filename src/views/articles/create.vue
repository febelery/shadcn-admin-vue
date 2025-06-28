<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, Save, Eye } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { Editor } from '@/components/editor'
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

const content = ref('')
const isSubmitting = ref(false)

const handleSubmit = async (values: z.infer<typeof formSchema>, status?: string) => {
  // 验证内容
  if (!content.value.trim()) {
    toast.error('请输入文章内容')
    return
  }

  const finalStatus = status || values.status
  isSubmitting.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const action = finalStatus === 'published' ? '发布' : '保存'
    toast.success(`文章${action}成功`)
    router.push('/articles') // 会自动重定向到 /articles/list
  } catch (error) {
    toast.error('操作失败')
  } finally {
    isSubmitting.value = false
  }
}

const goBack = () => {
  router.push('/articles') // 会自动重定向到 /articles/list
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
        <!-- 基本信息 -->
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
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
              <div class="flex gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  @click="(values) => handleSubmit(values, 'draft')" 
                  :disabled="isSubmitting"
                >
                  <Save class="mr-2 h-4 w-4" />
                  保存草稿
                </Button>
                <Button 
                  type="submit" 
                  @click="(values) => handleSubmit(values, 'published')" 
                  :disabled="isSubmitting"
                >
                  <Eye class="mr-2 h-4 w-4" />
                  发布文章
                </Button>
              </div>
            </AutoForm>
          </CardContent>
        </Card>

        <!-- 文章内容 -->
        <Card>
          <CardHeader>
            <CardTitle>文章内容</CardTitle>
          </CardHeader>
          <CardContent>
            <Editor v-model="content" mode="full" />
          </CardContent>
        </Card>
      </div>

      <!-- 侧边栏 -->
      <div class="space-y-6">
        <!-- 封面图片 -->
        <Card>
          <CardHeader>
            <CardTitle>封面图片</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                <div class="text-center">
                  <p class="text-sm text-muted-foreground">点击上传封面图片</p>
                  <p class="text-xs text-muted-foreground mt-1">支持 JPG、PNG 格式</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
      </div>
    </div>
  </div>
</template>