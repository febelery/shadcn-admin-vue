<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, Save, Eye } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { Editor } from '@/components/editor'

const router = useRouter()

const form = ref({
  title: '',
  excerpt: '',
  content: '',
  category: '',
  tags: '',
  status: 'draft',
  cover: '',
})

const isSubmitting = ref(false)

const handleSubmit = async (status: string) => {
  form.value.status = status
  isSubmitting.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const action = status === 'published' ? '发布' : '保存'
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
      <div class="flex items-center gap-2">
        <Button variant="outline" @click="handleSubmit('draft')" :disabled="isSubmitting">
          <Save class="mr-2 h-4 w-4" />
          保存草稿
        </Button>
        <Button @click="handleSubmit('published')" :disabled="isSubmitting">
          <Eye class="mr-2 h-4 w-4" />
          发布文章
        </Button>
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
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <Label for="title">标题</Label>
              <Input
                id="title"
                v-model="form.title"
                placeholder="请输入文章标题"
                required
              />
            </div>
            <div class="space-y-2">
              <Label for="excerpt">摘要</Label>
              <Textarea
                id="excerpt"
                v-model="form.excerpt"
                placeholder="请输入文章摘要"
                rows="3"
              />
            </div>
          </CardContent>
        </Card>

        <!-- 文章内容 -->
        <Card>
          <CardHeader>
            <CardTitle>文章内容</CardTitle>
          </CardHeader>
          <CardContent>
            <Editor v-model="form.content" mode="full" />
          </CardContent>
        </Card>
      </div>

      <!-- 侧边栏 -->
      <div class="space-y-6">
        <!-- 发布设置 -->
        <Card>
          <CardHeader>
            <CardTitle>发布设置</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <Label for="category">分类</Label>
              <Select v-model="form.category">
                <SelectTrigger>
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">技术</SelectItem>
                  <SelectItem value="tools">工具</SelectItem>
                  <SelectItem value="tutorial">教程</SelectItem>
                  <SelectItem value="news">资讯</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <Label for="tags">标签</Label>
              <Input
                id="tags"
                v-model="form.tags"
                placeholder="用逗号分隔多个标签"
              />
            </div>
          </CardContent>
        </Card>

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

        <!-- 提示信息 -->
        <Card>
          <CardHeader>
            <CardTitle>写作提示</CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="text-sm text-muted-foreground space-y-1">
              <li>• 标题要简洁明了</li>
              <li>• 摘要控制在150字以内</li>
              <li>• 合理使用标签便于检索</li>
              <li>• 定期保存避免丢失</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>