<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { getUserApi } from '@/api/users'
import type { User } from '@/api/users'
import UserForm from './components/UserForm.vue'

const route = useRoute()
const router = useRouter()
const userId = Number(route.params.id)

const loading = ref(true)
const userData = ref<User | null>(null)

// 获取用户数据
const fetchUserData = async () => {
  if (!userId || isNaN(userId)) {
    toast.error('无效的用户ID')
    router.push('/users')
    return
  }

  loading.value = true
  try {
    const response = await getUserApi(userId)
    userData.value = response.data
  } catch (error: any) {
    console.error('获取用户数据失败:', error)
    toast.error('获取用户数据失败')
    router.push('/users')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUserData()
})
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center py-8">
    <div class="text-center">
      <div class="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
      <p class="text-muted-foreground text-sm">正在加载用户数据...</p>
    </div>
  </div>
  
  <UserForm v-else-if="userData" mode="edit" :user-data="userData" />
  
  <div v-else class="flex items-center justify-center py-8">
    <div class="text-center">
      <p class="text-muted-foreground text-sm">用户数据加载失败</p>
    </div>
  </div>
</template>