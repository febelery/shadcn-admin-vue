<script setup lang="ts">
import * as z from 'zod'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()
const route = useRoute()

// 定义表单验证 schema（编辑时密码可选）
const editFormSchema = z
  .object({
    name: z.string().min(2, '姓名至少需要2个字符').max(50, '姓名不能超过50个字符'),
    email: z.string().email('请输入有效的邮箱地址'),
    password: z
      .string()
      .min(8, '密码至少需要8个字符')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含大小写字母和数字')
      .optional()
      .or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal('')),
    role: z.enum(['admin', 'editor', 'user'], {
      required_error: '请选择用户角色',
    }),
    status: z.enum(['active', 'inactive'], {
      required_error: '请选择用户状态',
    }),
  })
  .refine(
    (data) => {
      // 如果输入了密码，则必须确认密码
      if (data.password && data.password.length > 0) {
        return data.password === data.confirmPassword
      }
      return true
    },
    {
      message: '密码确认不匹配',
      path: ['confirmPassword'],
    }
  )

const isSubmitting = ref(false)
const initialData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'user' as string,
  status: 'active' as const,
})

// 模拟加载用户数据
onMounted(async () => {
  const userId = route.params.id
  if (userId) {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 500))

    // 模拟数据
    initialData.value = {
      name: '张三',
      email: 'zhangsan@example.com',
      password: '',
      confirmPassword: '',
      role: 'editor',
      status: 'active',
    }
  }
})

const handleSubmit = async (values: z.infer<typeof editFormSchema>) => {
  isSubmitting.value = true

  try {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success('用户信息更新成功')
    router.push('/users')
  } catch (error) {
    toast.error('更新用户信息失败')
  } finally {
    isSubmitting.value = false
  }
}

const goBack = () => {
  router.push('/users')
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
        <h1 class="text-2xl font-bold tracking-tight">编辑用户</h1>
        <p class="text-muted-foreground">修改用户账户信息</p>
      </div>
    </div>

    <!-- 表单 -->
    <div class="grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>用户信息</CardTitle>
            <CardDescription>修改用户的基本信息</CardDescription>
          </CardHeader>
          <CardContent>
            <AutoForm
              :schema="editFormSchema"
              :default-values="initialData"
              :field-config="{
                name: {
                  label: '姓名',
                  description: '用户的真实姓名',
                  inputProps: {
                    placeholder: '请输入姓名',
                  },
                },
                email: {
                  label: '邮箱',
                  description: '用于登录和接收通知的邮箱地址',
                  inputProps: {
                    placeholder: '请输入邮箱',
                    type: 'email',
                  },
                },
                password: {
                  label: '新密码',
                  description: '留空则不修改密码。如需修改，密码必须包含大小写字母和数字，至少8位',
                  inputProps: {
                    placeholder: '留空则不修改密码',
                    type: 'password',
                  },
                },
                confirmPassword: {
                  label: '确认新密码',
                  description: '如果修改密码，请再次输入新密码以确认',
                  inputProps: {
                    placeholder: '确认新密码',
                    type: 'password',
                  },
                },
                role: {
                  label: '角色',
                  description: '用户在系统中的角色权限',
                  component: 'select',
                },
                status: {
                  label: '状态',
                  description: '用户账户的当前状态',
                  component: 'select',
                },
              }"
              @submit="handleSubmit"
              class="space-y-6"
            >
              <div class="flex gap-4 pt-4">
                <Button type="submit" :disabled="isSubmitting" class="flex-1">
                  <Save class="mr-2 h-4 w-4" />
                  {{ isSubmitting ? '保存中...' : '保存更改' }}
                </Button>
                <Button type="button" variant="outline" @click="goBack" class="flex-1"> 取消 </Button>
              </div>
            </AutoForm>
          </CardContent>
        </Card>
      </div>

      <!-- 侧边栏 -->
      <div class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>编辑提示</CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="text-muted-foreground space-y-2 text-sm">
              <li class="flex items-start gap-2">
                <div class="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500"></div>
                <span>密码字段留空则不修改当前密码</span>
              </li>
              <li class="flex items-start gap-2">
                <div class="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500"></div>
                <span>修改邮箱后用户需要使用新邮箱登录</span>
              </li>
              <li class="flex items-start gap-2">
                <div class="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500"></div>
                <span>角色变更会立即影响用户权限</span>
              </li>
              <li class="flex items-start gap-2">
                <div class="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500"></div>
                <span>禁用用户将阻止其登录系统</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>操作记录</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-muted-foreground">创建时间</span>
                <span>2024-01-15</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">最后登录</span>
                <span>2024-01-20</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">最后修改</span>
                <span>2024-01-18</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
