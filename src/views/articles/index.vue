<script setup lang="ts">
import { Calendar, Edit, Eye, MoreHorizontal, Plus, Search, Trash2 } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { deleteArticleApi, getArticlesApi } from '@/api/articles'
import type { Article, ArticleListParams } from '@/api/articles'

const router = useRouter()

// 响应式数据
const articles = ref<Article[]>([])
const loading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedStatus = ref('all')
const openDropdowns = ref<Record<number, boolean>>({})
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
})

// 获取文章列表
const fetchArticles = async () => {
  loading.value = true
  try {
    const params: ArticleListParams = {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      search: searchQuery.value || undefined,
      category: selectedCategory.value !== 'all' ? selectedCategory.value : undefined,
      status: selectedStatus.value !== 'all' ? selectedStatus.value : undefined,
    }

    const response = await getArticlesApi(params)
    articles.value = response.data.data
    pagination.value.total = response.data.total

    // 重置下拉菜单状态
    openDropdowns.value = {}
  } catch (error: any) {
    toast.error('获取文章列表失败')
    console.error('获取文章列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 删除文章
const deleteArticle = async (id: number, title: string) => {
  if (!confirm(`确定要删除文章 "${title}" 吗？此操作不可恢复。`)) {
    return
  }

  // 关闭对应的下拉菜单
  openDropdowns.value[id] = false

  try {
    await deleteArticleApi(id)
    toast.success('文章删除成功')
    await fetchArticles()
  } catch (error: any) {
    toast.error('删除文章失败')
    console.error('删除文章失败:', error)
  }
}

// 搜索处理
const handleSearch = () => {
  pagination.value.page = 1
  fetchArticles()
}

// 筛选处理
const handleFilter = () => {
  pagination.value.page = 1
  fetchArticles()
}

// 页面加载时获取数据
onMounted(() => {
  fetchArticles()
})

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'published':
      return 'default'
    case 'draft':
      return 'secondary'
    case 'archived':
      return 'outline'
    default:
      return 'secondary'
  }
}

const getCategoryBadgeVariant = (category: string) => {
  switch (category) {
    case 'tech':
      return 'default'
    case 'tools':
      return 'secondary'
    case 'tutorial':
      return 'outline'
    default:
      return 'outline'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'published':
      return '已发布'
    case 'draft':
      return '草稿'
    case 'archived':
      return '已归档'
    default:
      return status
  }
}

const getCategoryText = (category: string) => {
  switch (category) {
    case 'tech':
      return '技术'
    case 'tools':
      return '工具'
    case 'tutorial':
      return '教程'
    case 'news':
      return '资讯'
    default:
      return category
  }
}

// 导航到编辑页面
const navigateToEdit = (id: number) => {
  router.push(`/articles/edit/${id}`)
}

// 导航到创建页面
const navigateToCreate = () => {
  router.push('/articles/create')
}
</script>

<template>
  <div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">文章管理</h1>
        <p class="text-muted-foreground">管理系统中的所有文章内容</p>
      </div>
      <!-- 使用权限指令控制写文章按钮 -->
      <Button v-permission="'articles.create'" @click="navigateToCreate">
        <Plus class="mr-2 h-4 w-4" />
        写文章
      </Button>
    </div>

    <!-- 搜索和筛选 -->
    <Card>
      <CardHeader>
        <div class="flex items-center gap-4">
          <div class="relative max-w-sm flex-1">
            <Search class="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input v-model="searchQuery" placeholder="搜索文章..." class="pl-9" @keyup.enter="handleSearch" />
          </div>
          <Select v-model="selectedCategory" @update:model-value="handleFilter">
            <SelectTrigger class="w-32">
              <SelectValue placeholder="分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="tech">技术</SelectItem>
              <SelectItem value="tools">工具</SelectItem>
              <SelectItem value="tutorial">教程</SelectItem>
              <SelectItem value="news">资讯</SelectItem>
            </SelectContent>
          </Select>
          <Select v-model="selectedStatus" @update:model-value="handleFilter">
            <SelectTrigger class="w-32">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="published">已发布</SelectItem>
              <SelectItem value="draft">草稿</SelectItem>
              <SelectItem value="archived">已归档</SelectItem>
            </SelectContent>
          </Select>
          <Button @click="handleSearch">搜索</Button>
        </div>
      </CardHeader>
    </Card>

    <!-- 文章列表 -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="text-center">
        <div class="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
        <p class="text-muted-foreground text-sm">正在加载...</p>
      </div>
    </div>

    <!-- 使用权限包装器控制文章列表的显示 -->
    <PermissionWrapper permission="articles.view" :show-fallback="true" fallback-text="您没有权限查看文章列表">
      <div v-if="!loading" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card v-for="article in articles" :key="article.id" class="overflow-hidden">
          <div class="aspect-video overflow-hidden">
            <img
              :src="article.cover"
              :alt="article.title"
              class="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
          <CardHeader class="pb-3">
            <div class="flex items-start justify-between gap-2">
              <CardTitle class="line-clamp-2 text-lg">{{ article.title }}</CardTitle>
              <!-- 使用权限指令控制操作菜单 -->
              <div v-permission="['articles.edit', 'articles.delete']">
                <DropdownMenu v-model:open="openDropdowns[article.id]">
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon" class="h-8 w-8">
                      <MoreHorizontal class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem v-permission="'articles.view'">
                      <Eye class="mr-2 h-4 w-4" />
                      查看
                    </DropdownMenuItem>
                    <DropdownMenuItem v-permission="'articles.edit'" @click="navigateToEdit(article.id)">
                      <Edit class="mr-2 h-4 w-4" />
                      编辑
                    </DropdownMenuItem>
                    <DropdownMenuSeparator v-permission:all="['articles.edit', 'articles.delete']" />
                    <DropdownMenuItem
                      v-permission="'articles.delete'"
                      variant="destructive"
                      @click="deleteArticle(article.id, article.title)"
                    >
                      <Trash2 class="mr-2 h-4 w-4" />
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <CardDescription class="line-clamp-3">
              {{ article.excerpt }}
            </CardDescription>
          </CardHeader>
          <CardContent class="pt-0">
            <div class="text-muted-foreground flex items-center justify-between text-sm">
              <div class="flex items-center gap-2">
                <Calendar class="h-4 w-4" />
                {{ new Date(article.publishedAt || article.createdAt).toLocaleDateString() }}
              </div>
              <div>{{ article.views }} 次浏览</div>
            </div>
            <div class="mt-3 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Badge :variant="getCategoryBadgeVariant(article.category)">
                  {{ getCategoryText(article.category) }}
                </Badge>
                <Badge :variant="getStatusBadgeVariant(article.status)">
                  {{ getStatusText(article.status) }}
                </Badge>
              </div>
              <div class="text-muted-foreground text-sm">by {{ article.author }}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PermissionWrapper>

    <!-- 分页 -->
    <div v-if="pagination.total > pagination.pageSize" class="mt-4 flex items-center justify-between">
      <div class="text-muted-foreground text-sm">
        显示 {{ (pagination.page - 1) * pagination.pageSize + 1 }} -
        {{ Math.min(pagination.page * pagination.pageSize, pagination.total) }}
        共 {{ pagination.total }} 条
      </div>
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="pagination.page <= 1"
          @click="
            () => {
              pagination.page--
              fetchArticles()
            }
          "
        >
          上一页
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="pagination.page >= Math.ceil(pagination.total / pagination.pageSize)"
          @click="
            () => {
              pagination.page++
              fetchArticles()
            }
          "
        >
          下一页
        </Button>
      </div>
    </div>
  </div>
</template>
