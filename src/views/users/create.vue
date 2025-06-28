<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, Save } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { createUserApi } from '@/api/users'
import type { CreateUserParams } from '@/api/users'
import * as z from 'zod'

const router = useRouter()

// 定义表单验证 schema
const formSchema = z.object({
  name: z.string().min(2, '姓名至少需要2个字符').max(50, '姓名不能超过50个字符'),
  username: z.string().min(2, '用户名至少需要2个字符').max(50, '用户名不能超过50个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string()
    .min(8, '密码至少需要8个字符')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含大小写字母和数字'),
  confirmPassword: z.string(),
  role: z.enum(['admin', 'editor', 'user'], {
    required_error: '请选择用户角色',
  }),
  status: z.enum(['active', 'inactive'], {
    required_error: '请选择用户状态',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: '密码确认不匹配',
  path: ['confirmPassword'],
})

const isSubmitting = ref(false)

const handleSubmit = async (values: z.infer<typeof formSchema>) => {
  isSubmitting.value = true
  
  try {
    const createData: CreateUserParams = {
      name: values.name,
      username: values.username,
      email: values.email,
      password: values.password,
      role: values.role,
      status: values.status,
    }

    await createUserApi(createData)
    toast.success('用户创建成功')
    router.push('/users')
  } catch (error: any) {
    const message = error?.response?.data?.message || '创建用户失败'
    toast.error(message)
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
          <CardContent>
            <AutoForm
              :schema="formSchema"
              :field-config="{
                name: {
                  label: '姓名',
                  description: '用户的真实姓名',
                  inputProps: {
                    placeholder: '请输入姓名',
                  },
                },
                username: {
                  label: '用户名',
                  description: '用于登录的用户名，不能重复',
                  inputProps: {
                    placeholder: '请输入用户名',
                  },
                },
                email: {
                  label: '邮箱',
                  description: '用于接收通知的邮箱地址',
                  inputProps: {
                    placeholder: '请输入邮箱',
                    type: 'email',
                  },
                },
                password: {
                  label: '密码',
                  description: '密码必须包含大小写字母和数字，至少8位',
                  inputProps: {
                    placeholder: '请输入密码',
                    type: 'password',
                  },
                },
                confirmPassword: {
                  label: '确认密码',
                  description: '请再次输入密码以确认',
                  inputProps: {
                    placeholder: '请再次输入密码',
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
                  {{ isSubmitting ? '创建中...' : '创建用户' }}
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
        <Card>
          <CardHeader>
            <CardTitle>创建提示</CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="text-sm text-muted-foreground space-y-2">
              <li class="flex items-start gap-2">
                <div class="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                <span>用户名用于登录，不能与其他用户重复</span>
              </li>
              <li class="flex items-start gap-2">
                <div class="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                <span>密码至少8位字符，包含大小写字母和数字</span>
              </li>
              <li class="flex items-start gap-2">
                <div class="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                <span>邮箱将用于接收系统通知</span>
              </li>
              <li class="flex items-start gap-2">
                <div class="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                <span>角色决定用户在系统中的权限范围</span>
              </li>
              <li class="flex items-start gap-2">
                <div class="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                <span>创建后可以随时修改用户信息</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>角色说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-3 text-sm">
              <div>
                <div class="font-medium text-red-600">管理员</div>
                <div class="text-muted-foreground">拥有系统所有权限</div>
              </div>
              <div>
                <div class="font-medium text-blue-600">编辑</div>
                <div class="text-muted-foreground">可以管理内容和用户</div>
              </div>
              <div>
                <div class="font-medium text-green-600">用户</div>
                <div class="text-muted-foreground">基础使用权限</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>