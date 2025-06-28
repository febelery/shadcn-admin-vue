<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, Save } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
  status: 'active',
})

const isSubmitting = ref(false)

const handleSubmit = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    toast.error('密码确认不匹配')
    return
  }

  isSubmitting.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('用户创建成功')
    router.push('/users') // 会自动重定向到 /users/list
  } catch (error) {
    toast.error('创建用户失败')
  } finally {
    isSubmitting.value = false
  }
}

const goBack = () => {
  router.push('/users') // 会自动重定向到 /users/list
}
</script>

<template>
  <div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
    <!-- 页面头部 -->
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="icon" @click="goBack">
        <ArrowLeft class="h-4 w-4" />
      </Button>
      <div>
        <h1 class="text-2xl font-bold tracking-tight">添加用户</h1>
        <p class="text-muted-foreground">创建新的用户账户</p>
      </div>
    </div>

    <!-- 表单 -->
    <div class="grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>用户信息</CardTitle>
            <CardDescription>填写用户的基本信息</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <Label for="name">姓名</Label>
                <Input
                  id="name"
                  v-model="form.name"
                  placeholder="请输入姓名"
                  required
                />
              </div>
              <div class="space-y-2">
                <Label for="email">邮箱</Label>
                <Input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="请输入邮箱"
                  required
                />
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <Label for="password">密码</Label>
                <Input
                  id="password"
                  v-model="form.password"
                  type="password"
                  placeholder="请输入密码"
                  required
                />
              </div>
              <div class="space-y-2">
                <Label for="confirmPassword">确认密码</Label>
                <Input
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  type="password"
                  placeholder="请再次输入密码"
                  required
                />
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <Label for="role">角色</Label>
                <Select v-model="form.role">
                  <SelectTrigger>
                    <SelectValue placeholder="选择角色" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">管理员</SelectItem>
                    <SelectItem value="editor">编辑</SelectItem>
                    <SelectItem value="user">用户</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-2">
                <Label for="status">状态</Label>
                <Select v-model="form.status">
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">活跃</SelectItem>
                    <SelectItem value="inactive">禁用</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- 侧边栏 -->
      <div class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>操作</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <Button @click="handleSubmit" :disabled="isSubmitting" class="w-full">
              <Save class="mr-2 h-4 w-4" />
              {{ isSubmitting ? '创建中...' : '创建用户' }}
            </Button>
            <Button variant="outline" @click="goBack" class="w-full">
              取消
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>提示</CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="text-sm text-muted-foreground space-y-1">
              <li>• 密码至少8位字符</li>
              <li>• 邮箱将用于登录</li>
              <li>• 角色决定用户权限</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>