<script setup lang="ts">
import { Edit, Eye, MoreHorizontal, Plus, Search, Trash2 } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { deleteUserApi, getUsersApi } from '@/api/users'
import type { User, UserListParams } from '@/api/users'

const router = useRouter()

// 响应式数据
const users = ref<User[]>([])
const loading = ref(false)
const searchQuery = ref('')
const selectedRole = ref('all')
const selectedStatus = ref('all')
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
})

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true
  try {
    const params: UserListParams = {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      search: searchQuery.value || undefined,
      role: selectedRole.value !== 'all' ? selectedRole.value : undefined,
      status: selectedStatus.value !== 'all' ? selectedStatus.value : undefined,
    }

    const response = await getUsersApi(params)
    users.value = response.data.data
    pagination.value.total = response.data.total
  } catch (error: any) {
    toast.error('获取用户列表失败')
    console.error('获取用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 删除用户
const deleteUser = async (id: number, name: string) => {
  if (!confirm(`确定要删除用户 "${name}" 吗？此操作不可恢复。`)) {
    return
  }

  try {
    await deleteUserApi(id)
    toast.success('用户删除成功')
    await fetchUsers()
  } catch (error: any) {
    toast.error('删除用户失败')
    console.error('删除用户失败:', error)
  }
}

// 搜索处理
const handleSearch = () => {
  pagination.value.page = 1
  fetchUsers()
}

// 筛选处理
const handleFilter = () => {
  pagination.value.page = 1
  fetchUsers()
}

// 页面加载时获取数据
onMounted(() => {
  fetchUsers()
})

const getStatusBadgeVariant = (status: string) => {
  return status === 'active' ? 'default' : 'secondary'
}

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case 'admin':
      return 'destructive'
    case 'editor':
      return 'default'
    default:
      return 'outline'
  }
}

const getRoleText = (role: string) => {
  switch (role) {
    case 'admin':
      return '管理员'
    case 'editor':
      return '编辑'
    case 'user':
      return '用户'
    default:
      return role
  }
}

const getStatusText = (status: string) => {
  return status === 'active' ? '活跃' : '禁用'
}

// 使用编程式导航
const navigateToCreate = () => {
  router.push('/users/create')
}

const navigateToEdit = (id: number) => {
  router.push(`/users/edit/${id}`)
}
</script>

<template>
  <div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">用户列表</h1>
        <p class="text-muted-foreground">管理系统中的所有用户账户</p>
      </div>
      <Button @click="navigateToCreate">
        <Plus class="mr-2 h-4 w-4" />
        添加用户
      </Button>
    </div>

    <!-- 搜索和筛选 -->
    <Card>
      <CardHeader>
        <div class="flex items-center gap-4">
          <div class="relative max-w-sm flex-1">
            <Search class="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input v-model="searchQuery" placeholder="搜索用户..." class="pl-9" @keyup.enter="handleSearch" />
          </div>
          <Select v-model="selectedRole" @update:model-value="handleFilter">
            <SelectTrigger class="w-32">
              <SelectValue placeholder="角色" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="admin">管理员</SelectItem>
              <SelectItem value="editor">编辑</SelectItem>
              <SelectItem value="user">用户</SelectItem>
            </SelectContent>
          </Select>
          <Select v-model="selectedStatus" @update:model-value="handleFilter">
            <SelectTrigger class="w-32">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="active">活跃</SelectItem>
              <SelectItem value="inactive">禁用</SelectItem>
            </SelectContent>
          </Select>
          <Button @click="handleSearch">搜索</Button>
        </div>
      </CardHeader>
    </Card>

    <!-- 用户列表 -->
    <Card>
      <CardHeader>
        <CardTitle>用户列表</CardTitle>
        <CardDescription>共 {{ pagination.total }} 个用户</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="loading" class="flex items-center justify-center py-8">
          <div class="text-center">
            <div
              class="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
            ></div>
            <p class="text-muted-foreground text-sm">正在加载...</p>
          </div>
        </div>

        <Table v-else>
          <TableHeader>
            <TableRow>
              <TableHead>用户</TableHead>
              <TableHead>用户名</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>最后登录</TableHead>
              <TableHead class="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="user in users" :key="user.id">
              <TableCell>
                <div class="flex items-center gap-3">
                  <Avatar class="h-8 w-8">
                    <AvatarImage :src="user.avatar as string" :alt="user.name" />
                    <AvatarFallback>{{ user.name.charAt(0) }}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div class="font-medium">{{ user.name }}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <code class="bg-muted rounded px-1.5 py-0.5 text-sm">{{ user.username }}</code>
              </TableCell>
              <TableCell>{{ user.email }}</TableCell>
              <TableCell>
                <Badge :variant="getRoleBadgeVariant(user.role)">
                  {{ getRoleText(user.role) }}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge :variant="getStatusBadgeVariant(user.status)">
                  {{ getStatusText(user.status) }}
                </Badge>
              </TableCell>
              <TableCell>{{ new Date(user.createdAt).toLocaleDateString() }}</TableCell>
              <TableCell>
                {{ user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : '从未登录' }}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click="navigateToEdit(user.id)">
                      <Edit class="mr-2 h-4 w-4" />
                      编辑
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" @click="deleteUser(user.id, user.name)">
                      <Trash2 class="mr-2 h-4 w-4" />
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

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
                  fetchUsers()
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
                  fetchUsers()
                }
              "
            >
              下一页
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
