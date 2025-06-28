<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import * as z from 'zod'

// 定义系统设置表单验证 schema
const settingsSchema = z.object({
  siteName: z.string().min(2, '站点名称至少需要2个字符').max(100, '站点名称不能超过100个字符'),
  siteDescription: z.string().max(500, '站点描述不能超过500个字符').optional(),
  adminEmail: z.string().email('请输入有效的邮箱地址'),
  timezone: z.enum(['Asia/Shanghai', 'Asia/Tokyo', 'America/New_York', 'Europe/London'], {
    required_error: '请选择时区',
  }),
  language: z.enum(['zh-CN', 'en-US', 'ja-JP'], {
    required_error: '请选择语言',
  }),
  maintenanceMode: z.boolean().default(false),
  allowRegistration: z.boolean().default(true),
  emailNotifications: z.boolean().default(true),
  maxUploadSize: z.number().min(1, '最小上传大小为1MB').max(100, '最大上传大小为100MB'),
  sessionTimeout: z.number().min(5, '会话超时最少5分钟').max(1440, '会话超时最多1440分钟'),
})

const isSubmitting = ref(false)

// 默认值
const defaultValues = {
  siteName: 'Shadcn Vue Admin',
  siteDescription: '基于 Vue 3 和 Shadcn UI 构建的现代化管理系统',
  adminEmail: 'admin@example.com',
  timezone: 'Asia/Shanghai' as const,
  language: 'zh-CN' as const,
  maintenanceMode: false,
  allowRegistration: true,
  emailNotifications: true,
  maxUploadSize: 10,
  sessionTimeout: 60,
}

const handleSubmit = async (values: z.infer<typeof settingsSchema>) => {
  isSubmitting.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('系统设置保存成功')
  } catch (error) {
    toast.error('保存系统设置失败')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>系统设置</CardTitle>
        <CardDescription>配置系统的基本参数和行为</CardDescription>
      </CardHeader>
      <CardContent>
        <AutoForm
          :schema="settingsSchema"
          :default-values="defaultValues"
          :field-config="{
            siteName: {
              label: '站点名称',
              description: '显示在浏览器标题栏和页面头部的站点名称',
              inputProps: {
                placeholder: '请输入站点名称',
              },
            },
            siteDescription: {
              label: '站点描述',
              description: '站点的简短描述，用于SEO和页面介绍',
              component: 'textarea',
              inputProps: {
                placeholder: '请输入站点描述',
                rows: 3,
              },
            },
            adminEmail: {
              label: '管理员邮箱',
              description: '系统管理员的邮箱地址，用于接收重要通知',
              inputProps: {
                placeholder: '请输入管理员邮箱',
                type: 'email',
              },
            },
            timezone: {
              label: '时区',
              description: '系统使用的默认时区',
              component: 'select',
            },
            language: {
              label: '语言',
              description: '系统界面的默认语言',
              component: 'select',
            },
            maintenanceMode: {
              label: '维护模式',
              description: '启用后，普通用户将无法访问系统',
              component: 'switch',
            },
            allowRegistration: {
              label: '允许注册',
              description: '是否允许新用户自主注册账户',
              component: 'switch',
            },
            emailNotifications: {
              label: '邮件通知',
              description: '是否启用系统邮件通知功能',
              component: 'switch',
            },
            maxUploadSize: {
              label: '最大上传大小 (MB)',
              description: '单个文件的最大上传大小限制',
              component: 'number',
              inputProps: {
                min: 1,
                max: 100,
                step: 1,
              },
            },
            sessionTimeout: {
              label: '会话超时 (分钟)',
              description: '用户会话的超时时间，超时后需要重新登录',
              component: 'number',
              inputProps: {
                min: 5,
                max: 1440,
                step: 5,
              },
            },
          }"
          @submit="handleSubmit"
          class="space-y-6"
        >
          <div class="flex gap-4 pt-4">
            <Button type="submit" :disabled="isSubmitting">
              <Save class="mr-2 h-4 w-4" />
              {{ isSubmitting ? '保存中...' : '保存设置' }}
            </Button>
            <Button type="button" variant="outline">
              重置为默认值
            </Button>
          </div>
        </AutoForm>
      </CardContent>
    </Card>
  </div>
</template>