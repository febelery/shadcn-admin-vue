<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-vue-next'
import { useSiteHeader } from '@/stores/siteHeader'

const siteHeader = useSiteHeader()

// 模拟用户数据
const users = ref([
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    role: '管理员',
    status: '活跃',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    role: '编辑',
    status: '活跃',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    createdAt: '2024-01-20',
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    role: '用户',
    status: '禁用',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    createdAt: '2024-02-01',
  },
])

const searchQuery = ref('')

onMounted(() => {
  siteHeader.replaceBreadcrumb([
    { title: '用户管理', href: '/dashboard/users' },
    { title: '用户列表' },
  ])
})

const getStatusBadgeVariant = (status: string) => {
  return status === '活跃' ? 'default' : 'secondary'
}

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case '管理员':
      return 'destructive'
    case '编辑':
      return 'default'
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
        <h1 class="text-2xl font-bold tracking-tight">用户管理</h1>
        <p class="text-muted-foreground">管理系统中的所有用户账户</p>
      </div>
      <Button>
        <Plus class="mr-2 h-4 w-4" />
        添加用户
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
              placeholder="搜索用户..."
              class="pl-9"
            />
          </div>
          <Select>
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
          <Select>
            <SelectTrigger class="w-32">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="active">活跃</SelectItem>
              <SelectItem value="inactive">禁用</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
    </Card>

    <!-- 用户列表 -->
    <Card>
      <CardHeader>
        <CardTitle>用户列表</CardTitle>
        <CardDescription>共 {{ users.length }} 个用户</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>用户</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead class="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="user in users" :key="user.id">
              <TableCell>
                <div class="flex items-center gap-3">
                  <Avatar class="h-8 w-8">
                    <AvatarImage :src="user.avatar" :alt="user.name" />
                    <AvatarFallback>{{ user.name.charAt(0) }}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div class="font-medium">{{ user.name }}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{{ user.email }}</TableCell>
              <TableCell>
                <Badge :variant="getRoleBadgeVariant(user.role)">
                  {{ user.role }}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge :variant="getStatusBadgeVariant(user.status)">
                  {{ user.status }}
                </Badge>
              </TableCell>
              <TableCell>{{ user.createdAt }}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon">
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
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>