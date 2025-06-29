<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { getArticleApi } from '@/api/articles'
import type { Article } from '@/api/articles'
import ArticleForm from './components/ArticleForm.vue'

const route = useRoute()
const router = useRouter()
const articleId = Number(route.params.id)

const loading = ref(true)
const articleData = ref<Article | null>(null)

// 获取文章数据
const fetchArticleData = async () => {
  if (!articleId || isNaN(articleId)) {
    toast.error('无效的文章ID')
    router.push('/articles')
    return
  }

  loading.value = true
  try {
    const response = await getArticleApi(articleId)
    articleData.value = response.data
  } catch (error: any) {
    console.error('获取文章数据失败:', error)
    toast.error('获取文章数据失败')
    router.push('/articles')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchArticleData()
})
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center py-8">
    <div class="text-center">
      <div class="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
      <p class="text-muted-foreground text-sm">正在加载文章数据...</p>
    </div>
  </div>
  
  <ArticleForm v-else-if="articleData" mode="edit" :article-data="articleData" />
  
  <div v-else class="flex items-center justify-center py-8">
    <div class="text-center">
      <p class="text-muted-foreground text-sm">文章数据加载失败</p>
    </div>
  </div>
</template>