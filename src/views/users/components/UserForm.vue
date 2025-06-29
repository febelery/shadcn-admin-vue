<script setup lang="ts">
import { ArrowLeft, Save } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { createUserApi, updateUserApi } from '@/api/users'
import type { User } from '@/api/users'

interface Props {
  mode: 'create' | 'edit'
  userData?: User // 编辑模式下传入的用户数据
}

const props = defineProps<Props>()
const router = useRouter()

// 定义表单验证 schema
const createFormSchema = z
  .object({
    name: z.string().min(2, '姓名至少需要2个字符').max(50, '姓名不能超过50个字符'),
    username: z.string().min(2, '用户名至少需要2个字符').max(50, '用户名不能超过50个字符'),
    email: z.string().email('请输入有效的邮箱地址'),
    password: z
      .string()
      .min(8, '密码至少需要8个字符')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含大小写字母和数字'),
    confirmPassword: z.string(),
    role: z.enum(['admin', 'editor', 'user'], {
      required_error: '请选择用户角色',
    }),
    status: z.enum(['active', 'inactive'], {
      required_error: '请选择用户状态',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '密码确认不匹配',
    path: ['confirmPassword'],
  })

// 编辑模式的表单验证 schema（密码可选）
const editFormSchema = z
  .object({
    name: z.string().min(2, '姓名至少需要2个字符').max(50, '姓名不能超过50个字符'),
    username: z.string().min(2, '用户名至少需要2个字符').max(50, '用户名不能超过50个字符'),
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

// 根据模式选择验证 schema
const formSchema = computed(() => {
  return props.mode === 'create' ? createFormSchema : editFormSchema
})

// 创建表单实例
const form = useForm({
  validationSchema: toTypedSchema(formSchema.value),
  initialValues: {
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' as const,
    status: 'active' as const,
  },
})

const isSubmitting = form.isSubmitting

// 监听 userData 变化，设置表单值
watch(
  () => props.userData,
  (userData) => {
    if (props.mode === 'edit' && userData) {
      form.setValues({
        name: userData.name,
        username: userData.username,
        email: userData.email,
        password: '',
        confirmPassword: '',
        role: userData.role,
        status: userData.status,
      })
    }
  },
  { immediate: true }
)

// 监听模式变化，更新验证 schema
watch(
  () => props.mode,
  () => {
    form.setValidationSchema(toTypedSchema(formSchema.value))
  }
)

// 页面标题和描述
const pageTitle = computed(() => {
  return props.mode === 'create' ? '添加用户' : '编辑用户'
})

const pageDescription = computed(() => {
  return props.mode === 'create' ? '创建新的用户账户' : '修改用户账户信息'
})

const cardTitle = computed(() => {
  return props.mode === 'create' ? '用户信息' : '用户信息'
})

const cardDescription = computed(() => {
  return props.mode === 'create' ? '填写用户的基本信息' : '修改用户的基本信息'
})

const submitButtonText = computed(() => {
  if (isSubmitting.value) {
    return props.mode === 'create' ? '创建中...' : '保存中...'
  }
  return props.mode === 'create' ? '创建用户' : '保存更改'
})

const handleSubmit = form.handleSubmit(async (values) => {
  try {
    if (props.mode === 'create') {
      // 创建模式：直接使用表单值，排除 confirmPassword
      const { confirmPassword, ...createData } = values
      await createUserApi(createData)
      toast.success('用户创建成功')
    } else if (props.userData) {
      // 编辑模式：基于表单值构建更新数据
      const { confirmPassword, password, ...baseData } = values
      const updateData = {
        id: props.userData.id,
        ...baseData,
        // 只有在输入了密码时才包含密码字段
        ...(password && password.length > 0 && { password }),
      }
      
      await updateUserApi(updateData)
      toast.success('用户信息更新成功')
    }
    
    router.push('/users')
  } catch (error: any) {
    const message = error?.response?.data?.message || `${props.mode === 'create' ? '创建' : '更新'}用户失败`
    toast.error(message)
  }
})

const goBack = () => {
  router.push('/users')
}

// 字段配置
const fieldConfig = computed(() => ({
  name: {
    label: '姓名',
    description: '用户的真实姓名',
    inputProps: {
      placeholder: '请输入姓名',
    },
  },
  username: {
    label: '用户名',
    description: props.mode === 'create' ? '用于登录的用户名，不能重复' : '用于登录的用户名',
    inputProps: {
      placeholder: '请输入用户名',
      disabled: props.mode === 'edit', // 编辑模式下用户名不可修改
    },
  },
  email: {
    label: '邮箱',
    description: props.mode === 'create' ? '用于接收通知的邮箱地址' : '用于登录和接收通知的邮箱地址',
    inputProps: {
      placeholder: '请输入邮箱',
      type: 'email',
    },
  },
  password: {
    label: props.mode === 'create' ? '密码' : '新密码',
    description: props.mode === 'create' 
      ? '密码必须包含大小写字母和数字，至少8位' 
      : '留空则不修改密码。如需修改，密码必须包含大小写字母和数字，至少8位',
    inputProps: {
      placeholder: props.mode === 'create' ? '请输入密码' : '留空则不修改密码',
      type: 'password',
    },
  },
  confirmPassword: {
    label: props.mode === 'create' ? '确认密码' : '确认新密码',
    description: props.mode === 'create' ? '请再次输入密码以确认' : '如果修改密码，请再次输入新密码以确认',
    inputProps: {
      placeholder: props.mode === 'create' ? '请再次输入密码' : '确认新密码',
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
}))

// 提示信息
const tips = computed(() => {
  if (props.mode === 'create') {
    return [
      { text: '用户名用于登录，不能与其他用户重复', color: 'bg-blue-500' },
      { text: '密码至少8位字符，包含大小写字母和数字', color: 'bg-blue-500' },
      { text: '邮箱将用于接收系统通知', color: 'bg-blue-500' },
      { text: '角色决定用户在系统中的权限范围', color: 'bg-blue-500' },
      { text: '创建后可以随时修改用户信息', color: 'bg-blue-500' },
    ]
  } else {
    return [
      { text: '密码字段留空则不修改当前密码', color: 'bg-amber-500' },
      { text: '修改邮箱后用户需要使用新邮箱登录', color: 'bg-amber-500' },
      { text: '角色变更会立即影响用户权限', color: 'bg-amber-500' },
      { text: '禁用用户将阻止其登录系统', color: 'bg-amber-500' },
    ]
  }
})
</script>

<template>
  <div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
    <!-- 页面头部 -->
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="icon" @click="goBack">
        <ArrowLeft class="h-4 w-4" />
      </Button>
      <div>
        <h1 class="text-2xl font-bold tracking-tight">{{ pageTitle }}</h1>
        <p class="text-muted-foreground">{{ pageDescription }}</p>
      </div>
    </div>

    <!-- 表单 -->
    <div class="grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>{{ cardTitle }}</CardTitle>
            <CardDescription>{{ cardDescription }}</CardDescription>
          </CardHeader>
          <CardContent>
            <AutoForm
              :form="form"
              :schema="formSchema"
              :field-config="fieldConfig"
              @submit="handleSubmit"
              class="space-y-6"
            >
              <div class="flex gap-4 pt-4">
                <Button type="submit" :disabled="isSubmitting" class="flex-1">
                  <Save class="mr-2 h-4 w-4" />
                  {{ submitButtonText }}
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
            <CardTitle>{{ mode === 'create' ? '创建提示' : '编辑提示' }}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="text-muted-foreground space-y-2 text-sm">
              <li v-for="(tip, index) in tips" :key="index" class="flex items-start gap-2">
                <div :class="`mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full ${tip.color}`"></div>
                <span>{{ tip.text }}</span>
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

        <!-- 编辑模式下显示操作记录 -->
        <Card v-if="mode === 'edit' && userData">
          <CardHeader>
            <CardTitle>操作记录</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-muted-foreground">创建时间</span>
                <span>{{ new Date(userData.createdAt).toLocaleDateString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">最后登录</span>
                <span>{{ userData.lastLoginAt ? new Date(userData.lastLoginAt).toLocaleDateString() : '从未登录' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">最后修改</span>
                <span>{{ new Date(userData.updatedAt).toLocaleDateString() }}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>