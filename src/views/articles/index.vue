<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Calendar } from 'lucide-vue-next'
import { useSiteHeader } from '@/stores/siteHeader'

const siteHeader = useSiteHeader()

// 模拟文章数据
const articles = ref([
  {
    id: 1,
    title: 'Vue 3 组合式 API 最佳实践',
    excerpt: '深入探讨 Vue 3 组合式 API 的使用技巧和最佳实践，帮助开发者更好地构建现代化的 Vue 应用...',
    author: '张三',
    status: '已发布',
    category: '技术',
    publishedAt: '2024-01-15',
    views: 1250,
    cover: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
  },
  {
    id: 2,
    title: 'TypeScript 进阶指南',
    excerpt: '从基础到高级，全面掌握 TypeScript 的类型系统、泛型、装饰器等高级特性...',
    author: '李四',
    status: '草稿',
    category: '技术',
    publishedAt: '2024-01-20',
    views: 890,
    cover: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
  },
  {
    id: 3,
    title: '现代前端开发工具链',
    excerpt: '介绍现代前端开发中常用的工具链，包括构建工具、代码质量工具、测试工具等...',
    author: '王五',
    status: '已发布',
    category: '工具',
    publishedAt: '2024-02-01',
    views: 2100,
    cover: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
  },
])

const searchQuery = ref('')

onMounted(() => {
  siteHeader.replaceBreadcrumb([
    { title: '文章管理', href: '/dashboard/articles' },
    { title: '文章列表' },
  ])
})

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case '已发布':
      return 'default'
    case '草稿':
      return 'secondary'
    case '已归档':
      return 'outline'
    default:
      return 'secondary'
  }
}

const getCategoryBadgeVariant = (category: string) => {
  switch (category) {
    case '技术':
      return 'default'
    case '工具':
      return 'secondary'
    case '教程':
      return 'outline'
    default:
      return 'outline'
  }
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
      <Button>
        <Plus class="mr-2 h-4 w-4" />
        写文章
      </Button>
    </div>

    <!-- 搜索和筛选 -->
    <Card>
      <CardHeader>
        <div class="flex items-center gap-4">
          <div class="relative flex-1 max-w-sm">
            <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              v-model="searchQuery"
              placeholder="搜索文章..."
              class="pl-9"
            />
          </div>
          <Select>
            <SelectTrigger class="w-32">
              <SelectValue placeholder="分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="tech">技术</SelectItem>
              <SelectItem value="tools">工具</SelectItem>
              <SelectItem value="tutorial">教程</SelectItem>
            </SelectContent>
          </Select>
          <Select>
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
        </div>
      </CardHeader>
    </Card>

    <!-- 文章列表 -->
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="icon" class="h-8 w-8">
                  <MoreHorizontal class="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye class="mr-2 h-4 w-4" />
                  查看
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit class="mr-2 h-4 w-4" />
                  编辑
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <Trash2 class="mr-2 h-4 w-4" />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription class="line-clamp-3">
            {{ article.excerpt }}
          </CardDescription>
        </CardHeader>
        <CardContent class="pt-0">
          <div class="flex items-center justify-between text-sm text-muted-foreground">
            <div class="flex items-center gap-2">
              <Calendar class="h-4 w-4" />
              {{ article.publishedAt }}
            </div>
            <div>{{ article.views }} 次浏览</div>
          </div>
          <div class="mt-3 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Badge :variant="getCategoryBadgeVariant(article.category)">
                {{ article.category }}
              </Badge>
              <Badge :variant="getStatusBadgeVariant(article.status)">
                {{ article.status }}
              </Badge>
            </div>
            <div class="text-sm text-muted-foreground">
              by {{ article.author }}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>