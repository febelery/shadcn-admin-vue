<template>
  <div class="space-y-4">
    <!-- 搜索和筛选栏 -->
    <div class="flex items-center justify-between">
      <div class="flex flex-1 items-center space-x-2">
        <!-- 搜索框 -->
        <div class="relative w-full max-w-sm">
          <Search class="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
          <Input v-model="searchQuery" placeholder="搜索用户..." class="pl-8" @keyup.enter="handleSearch" />
        </div>

        <!-- 状态筛选 -->
        <Popover v-model:open="statusFilterOpen">
          <PopoverTrigger as-child>
            <Button variant="outline" class="border-dashed">
              <PlusCircle class="mr-2 h-4 w-4" />
              状态
              <Badge v-if="selectedStatuses.length > 0" variant="secondary" class="ml-2 rounded-sm px-1 font-normal">
                {{ selectedStatuses.length }}
              </Badge>
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-[200px] p-0" align="start">
            <div class="p-2">
              <div class="flex items-center space-x-2 p-2">
                <Search class="text-muted-foreground h-4 w-4" />
                <Input
                  v-model="statusSearchQuery"
                  placeholder="搜索状态..."
                  class="h-8 border-0 p-0 focus-visible:ring-0"
                />
              </div>
              <Separator />
              <div class="p-1">
                <div
                  v-for="status in filteredStatuses"
                  :key="status.value"
                  class="hover:bg-muted flex cursor-pointer items-center space-x-2 rounded-sm p-2"
                  @click="toggleStatus(status.value)"
                >
                  <Checkbox
                    :checked="selectedStatuses.includes(status.value)"
                    @update:checked="toggleStatus(status.value)"
                  />
                  <div class="flex items-center space-x-2">
                    <div
                      class="h-2 w-2 rounded-full"
                      :class="status.value === 'active' ? 'bg-green-500' : 'bg-gray-400'"
                    />
                    <span class="text-sm">{{ status.label }}</span>
                  </div>
                  <span class="text-muted-foreground ml-auto text-xs">{{ status.count }}</span>
                </div>
              </div>
              <Separator v-if="selectedStatuses.length > 0" />
              <div v-if="selectedStatuses.length > 0" class="p-1">
                <Button variant="ghost" size="sm" class="w-full justify-start" @click="clearStatusFilter">
                  清除筛选
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <!-- 角色筛选 -->
        <Popover v-model:open="roleFilterOpen">
          <PopoverTrigger as-child>
            <Button variant="outline" class="border-dashed">
              <PlusCircle class="mr-2 h-4 w-4" />
              角色
              <Badge v-if="selectedRoles.length > 0" variant="secondary" class="ml-2 rounded-sm px-1 font-normal">
                {{ selectedRoles.length }}
              </Badge>
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-[200px] p-0" align="start">
            <div class="p-2">
              <div class="flex items-center space-x-2 p-2">
                <Search class="text-muted-foreground h-4 w-4" />
                <Input
                  v-model="roleSearchQuery"
                  placeholder="搜索角色..."
                  class="h-8 border-0 p-0 focus-visible:ring-0"
                />
              </div>
              <Separator />
              <div class="p-1">
                <div
                  v-for="role in filteredRoles"
                  :key="role.value"
                  class="hover:bg-muted flex cursor-pointer items-center space-x-2 rounded-sm p-2"
                  @click="toggleRole(role.value)"
                >
                  <Checkbox :checked="selectedRoles.includes(role.value)" @update:checked="toggleRole(role.value)" />
                  <div class="flex items-center space-x-2">
                    <Badge :variant="getRoleBadgeVariant(role.value)" class="h-2 w-2 p-0" />
                    <span class="text-sm">{{ role.label }}</span>
                  </div>
                  <span class="text-muted-foreground ml-auto text-xs">{{ role.count }}</span>
                </div>
              </div>
              <Separator v-if="selectedRoles.length > 0" />
              <div v-if="selectedRoles.length > 0" class="p-1">
                <Button variant="ghost" size="sm" class="w-full justify-start" @click="clearRoleFilter">
                  清除筛选
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <!-- 重置筛选 - 修复：包含搜索条件 -->
        <Button
          v-if="searchQuery || selectedStatuses.length > 0 || selectedRoles.length > 0"
          variant="ghost"
          @click="resetFilters"
          class="px-2 lg:px-3"
        >
          重置
          <X class="ml-2 h-4 w-4" />
        </Button>
      </div>

      <!-- 右侧操作 -->
      <div class="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" size="sm" class="ml-auto h-8">
              <SlidersHorizontal class="mr-2 h-4 w-4" />
              视图
              <ChevronDown class="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-[150px]">
            <DropdownMenuLabel>切换列</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              v-for="column in toggleableColumns"
              :key="column.key"
              :checked="column.visible"
              @update:checked="(checked: any) => toggleColumn(column.key, checked)"
            >
              {{ column.label }}
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <!-- 添加用户按钮 -->
        <Button v-permission="'users.create'" @click="navigateToCreate" size="sm" class="h-8">
          <Plus class="mr-2 h-4 w-4" />
          添加用户
        </Button>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-[50px]">
              <Checkbox :checked="isAllSelected" :indeterminate="isIndeterminate" @update:checked="toggleSelectAll" />
            </TableHead>
            <TableHead v-if="visibleColumns.user" class="min-w-[200px]">
              <Button variant="ghost" @click="toggleSort('name')" class="h-auto p-0 font-medium">
                用户
                <ArrowUpDown class="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead v-if="visibleColumns.username">
              <Button variant="ghost" @click="toggleSort('username')" class="h-auto p-0 font-medium">
                用户名
                <ArrowUpDown class="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead v-if="visibleColumns.email">
              <Button variant="ghost" @click="toggleSort('email')" class="h-auto p-0 font-medium">
                邮箱
                <ArrowUpDown class="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead v-if="visibleColumns.role">角色</TableHead>
            <TableHead v-if="visibleColumns.status">状态</TableHead>
            <TableHead v-if="visibleColumns.createdAt">
              <Button variant="ghost" @click="toggleSort('createdAt')" class="h-auto p-0 font-medium">
                创建时间
                <ArrowUpDown class="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead v-if="visibleColumns.lastLoginAt">最后登录</TableHead>
            <TableHead class="w-[100px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="loading">
            <TableCell :colspan="getVisibleColumnCount() + 2" class="h-24 text-center">
              <div class="flex items-center justify-center">
                <div
                  class="border-primary mx-auto h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"
                ></div>
                <span class="text-muted-foreground ml-2 text-sm">正在加载...</span>
              </div>
            </TableCell>
          </TableRow>
          <TableRow v-else-if="users.length === 0">
            <TableCell :colspan="getVisibleColumnCount() + 2" class="h-24 text-center">
              <div class="flex flex-col items-center justify-center">
                <Users class="text-muted-foreground mb-2 h-8 w-8" />
                <span class="text-muted-foreground text-sm">没有找到用户</span>
              </div>
            </TableCell>
          </TableRow>
          <TableRow
            v-else
            v-for="user in users"
            :key="user.id"
            :class="{ 'bg-muted/50': selectedUsers.includes(user.id) }"
          >
            <TableCell>
              <Checkbox :checked="selectedUsers.includes(user.id)" @update:checked="toggleSelectUser(user.id)" />
            </TableCell>
            <TableCell v-if="visibleColumns.user">
              <div class="flex items-center space-x-3">
                <Avatar class="h-8 w-8">
                  <AvatarImage :src="user.avatar as any" :alt="user.name" />
                  <AvatarFallback>{{ user.name.charAt(0) }}</AvatarFallback>
                </Avatar>
                <div>
                  <div class="font-medium">{{ user.name }}</div>
                  <div class="text-muted-foreground text-sm">ID: {{ user.id }}</div>
                </div>
              </div>
            </TableCell>
            <TableCell v-if="visibleColumns.username">
              <code class="bg-muted rounded px-1.5 py-0.5 text-sm">{{ user.username }}</code>
            </TableCell>
            <TableCell v-if="visibleColumns.email" class="font-mono text-sm">
              {{ user.email }}
            </TableCell>
            <TableCell v-if="visibleColumns.role">
              <Badge :variant="getRoleBadgeVariant(user.role)">
                {{ getRoleText(user.role) }}
              </Badge>
            </TableCell>
            <TableCell v-if="visibleColumns.status">
              <div class="flex items-center space-x-2">
                <div class="h-2 w-2 rounded-full" :class="user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'" />
                <span class="text-sm">{{ getStatusText(user.status) }}</span>
              </div>
            </TableCell>
            <TableCell v-if="visibleColumns.createdAt" class="text-muted-foreground text-sm">
              {{ formatDate(user.createdAt) }}
            </TableCell>
            <TableCell v-if="visibleColumns.lastLoginAt" class="text-muted-foreground text-sm">
              {{ user.lastLoginAt ? formatDate(user.lastLoginAt) : '从未登录' }}
            </TableCell>
            <TableCell>
              <div v-permission="['users.edit', 'users.delete']">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon" class="h-8 w-8">
                      <MoreHorizontal class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem v-permission="'users.view'">
                      <Eye class="mr-2 h-4 w-4" />
                      查看详情
                    </DropdownMenuItem>
                    <DropdownMenuItem v-permission="'users.edit'" @click="navigateToEdit(user.id)">
                      <Edit class="mr-2 h-4 w-4" />
                      编辑
                    </DropdownMenuItem>
                    <DropdownMenuSeparator v-permission:all="['users.edit', 'users.delete']" />
                    <DropdownMenuItem
                      v-permission="'users.delete'"
                      variant="destructive"
                      @click="deleteUser(user.id, user.name)"
                    >
                      <Trash2 class="mr-2 h-4 w-4" />
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- 分页和选择信息 -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="text-muted-foreground flex-1 text-sm">
        <span v-if="selectedUsers.length > 0">
          已选择 {{ selectedUsers.length }} 行
          <Button
            v-if="selectedUsers.length > 0"
            variant="ghost"
            size="sm"
            @click="clearSelection"
            class="ml-2 h-auto p-0 text-sm underline"
          >
            清除选择
          </Button>
        </span>
        <span v-else> 共 {{ pagination.total }} 条记录 </span>
      </div>
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 lg:gap-8">
        <div class="flex items-center space-x-2">
          <p class="text-sm font-medium">每页显示</p>
          <Select v-model="pagination.pageSize" @update:model-value="(value: any) => handlePageSizeChange(value)">
            <SelectTrigger class="h-8 w-[70px]">
              <SelectValue :placeholder="String(pagination.pageSize)" />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="flex w-[110px] items-center justify-center text-sm font-medium">
          第 {{ pagination.page }} 页，共 {{ totalPages }} 页
        </div>
        <div class="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            :disabled="pagination.page <= 1"
            @click="goToPage(1)"
            class="hidden h-8 w-8 p-0 lg:flex"
          >
            <ChevronsLeft class="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            :disabled="pagination.page <= 1"
            @click="goToPage(pagination.page - 1)"
            class="h-8 w-8 p-0"
          >
            <ChevronLeft class="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            :disabled="pagination.page >= totalPages"
            @click="goToPage(pagination.page + 1)"
            class="h-8 w-8 p-0"
          >
            <ChevronRight class="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            :disabled="pagination.page >= totalPages"
            @click="goToPage(totalPages)"
            class="hidden h-8 w-8 p-0 lg:flex"
          >
            <ChevronsRight class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  PlusCircle,
  Search,
  SlidersHorizontal,
  Trash2,
  Users,
  X,
} from 'lucide-vue-next'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { deleteUserApi, getUsersApi } from '@/api/users'
import type { User, UserListParams } from '@/api/users'

const router = useRouter()

// 响应式数据
const users = ref<User[]>([])
const loading = ref(false)
const searchQuery = ref('')
const selectedUsers = ref<number[]>([])
const selectedStatuses = ref<string[]>([])
const selectedRoles = ref<string[]>([])
const statusFilterOpen = ref(false)
const roleFilterOpen = ref(false)
const statusSearchQuery = ref('')
const roleSearchQuery = ref('')
const sortField = ref<string>('')
const sortOrder = ref<'asc' | 'desc'>('asc')

// 分页数据
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
})

// 列显示控制
const visibleColumns = ref<any>({
  user: true,
  username: true,
  email: true,
  role: true,
  status: true,
  createdAt: true,
  lastLoginAt: true,
})

// 可切换的列
const toggleableColumns = computed(() => [
  { key: 'username', label: '用户名', visible: visibleColumns.value.username },
  { key: 'email', label: '邮箱', visible: visibleColumns.value.email },
  { key: 'role', label: '角色', visible: visibleColumns.value.role },
  { key: 'status', label: '状态', visible: visibleColumns.value.status },
  { key: 'createdAt', label: '创建时间', visible: visibleColumns.value.createdAt },
  { key: 'lastLoginAt', label: '最后登录', visible: visibleColumns.value.lastLoginAt },
])

// 状态选项
const statusOptions = ref([
  { value: 'active', label: '活跃', count: 0 },
  { value: 'inactive', label: '禁用', count: 0 },
])

// 角色选项
const roleOptions = ref([
  { value: 'admin', label: '管理员', count: 0 },
  { value: 'editor', label: '编辑', count: 0 },
  { value: 'user', label: '用户', count: 0 },
])

// 计算属性
const totalPages = computed(() => Math.ceil(pagination.value.total / pagination.value.pageSize))

const isAllSelected = computed(() => {
  return users.value.length > 0 && selectedUsers.value.length === users.value.length
})

const isIndeterminate = computed(() => {
  return selectedUsers.value.length > 0 && selectedUsers.value.length < users.value.length
})

const filteredStatuses = computed(() => {
  if (!statusSearchQuery.value) return statusOptions.value
  return statusOptions.value.filter((status) =>
    status.label.toLowerCase().includes(statusSearchQuery.value.toLowerCase())
  )
})

const filteredRoles = computed(() => {
  if (!roleSearchQuery.value) return roleOptions.value
  return roleOptions.value.filter((role) => role.label.toLowerCase().includes(roleSearchQuery.value.toLowerCase()))
})

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true
  try {
    const params: UserListParams = {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      search: searchQuery.value || undefined,
      role: selectedRoles.value.length > 0 ? selectedRoles.value.join(',') : undefined,
      status: selectedStatuses.value.length > 0 ? selectedStatuses.value.join(',') : undefined,
    }

    const response = await getUsersApi(params)
    users.value = response.data.data
    pagination.value.total = response.data.total

    // 更新筛选选项的计数
    updateFilterCounts()
  } catch (error: any) {
    toast.error('获取用户列表失败')
    console.error('获取用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 更新筛选选项计数
const updateFilterCounts = () => {
  // 这里应该从API获取实际的计数，这里使用模拟数据
  statusOptions.value = [
    { value: 'active', label: '活跃', count: Math.floor(Math.random() * 100) },
    { value: 'inactive', label: '禁用', count: Math.floor(Math.random() * 50) },
  ]

  roleOptions.value = [
    { value: 'admin', label: '管理员', count: Math.floor(Math.random() * 10) },
    { value: 'editor', label: '编辑', count: Math.floor(Math.random() * 30) },
    { value: 'user', label: '用户', count: Math.floor(Math.random() * 100) },
  ]
}

// 搜索处理
const handleSearch = () => {
  pagination.value.page = 1
  fetchUsers()
}

// 分页大小变化 - 修复：正确处理字符串值
const handlePageSizeChange = (value: string) => {
  pagination.value.pageSize = parseInt(value)
  pagination.value.page = 1
  fetchUsers()
}

// 跳转到指定页面
const goToPage = (page: number) => {
  pagination.value.page = page
  fetchUsers()
}

// 排序处理
const toggleSort = (field: string) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
  fetchUsers()
}

// 选择处理
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedUsers.value = []
  } else {
    selectedUsers.value = users.value.map((user) => user.id)
  }
}

const toggleSelectUser = (userId: number) => {
  const index = selectedUsers.value.indexOf(userId)
  if (index > -1) {
    selectedUsers.value.splice(index, 1)
  } else {
    selectedUsers.value.push(userId)
  }
}

const clearSelection = () => {
  selectedUsers.value = []
}

// 筛选处理
const toggleStatus = (status: string) => {
  const index = selectedStatuses.value.indexOf(status)
  if (index > -1) {
    selectedStatuses.value.splice(index, 1)
  } else {
    selectedStatuses.value.push(status)
  }
}

const toggleRole = (role: string) => {
  const index = selectedRoles.value.indexOf(role)
  if (index > -1) {
    selectedRoles.value.splice(index, 1)
  } else {
    selectedRoles.value.push(role)
  }
}

const clearStatusFilter = () => {
  selectedStatuses.value = []
  statusFilterOpen.value = false
}

const clearRoleFilter = () => {
  selectedRoles.value = []
  roleFilterOpen.value = false
}

// 修复：重置筛选包含搜索条件
const resetFilters = () => {
  selectedStatuses.value = []
  selectedRoles.value = []
  searchQuery.value = ''
  pagination.value.page = 1
  fetchUsers()
}

// 列显示控制 - 修复：正确处理列切换
const toggleColumn = (columnKey: string, checked: boolean) => {
  visibleColumns.value[columnKey] = checked
}

const getVisibleColumnCount = () => {
  return Object.values(visibleColumns.value).filter(Boolean).length
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

// 导航
const navigateToCreate = () => {
  router.push('/users/create')
}

const navigateToEdit = (id: number) => {
  router.push(`/users/edit/${id}`)
}

// 工具函数
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// 监听筛选变化
watch(
  [selectedStatuses, selectedRoles],
  () => {
    pagination.value.page = 1
    fetchUsers()
  },
  { deep: true }
)

// 页面加载时获取数据
onMounted(() => {
  fetchUsers()
})
</script>
