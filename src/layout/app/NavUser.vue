<script setup lang="ts">
import { BadgeCheck, Bell, ChevronsUpDown, Lock, LogOut } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { useLockScreen } from '@/composables/useLockScreen'
import { useUserStore } from '@/stores/user'

const { isMobile } = useSidebar()
const userStore = useUserStore()
const router = useRouter()
const { lockScreen } = useLockScreen()

// 计算用户信息
const user = computed(() => {
  const userInfo = userStore.userInfo
  if (!userInfo) {
    return {
      name: '未登录',
      email: '',
      avatar: '',
      role: '',
    }
  }

  return {
    name: userInfo.name,
    email: userInfo.email,
    avatar: userInfo.avatar || '',
    role: getRoleText(userInfo.role),
  }
})

// 获取角色显示文本
function getRoleText(role: string): string {
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

// 退出登录 - 直接退出，不需要确认
const handleLogout = () => {
  userStore.logout()
  toast.success('已退出登录')
  router.push('/login')
}

// 锁定屏幕
const handleLockScreen = () => {
  lockScreen()
}

// 获取用户头像缩写
const getAvatarFallback = (name: string): string => {
  if (!name || name === '未登录') return 'U'
  return name.charAt(0).toUpperCase()
}
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarImage v-if="user.avatar" :src="user.avatar" :alt="user.name" />
              <AvatarFallback class="rounded-lg">{{ getAvatarFallback(user.name) }}</AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{{ user.name }}</span>
              <span class="truncate text-xs">{{ user.email || user.role }}</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          align="end"
          :side-offset="4"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarImage v-if="user.avatar" :src="user.avatar" :alt="user.name" />
                <AvatarFallback class="rounded-lg">{{ getAvatarFallback(user.name) }}</AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{ user.name }}</span>
                <span class="truncate text-xs">{{ user.email }}</span>
                <span v-if="user.role" class="text-muted-foreground truncate text-xs">{{ user.role }}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <BadgeCheck />
              账户设置
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell />
              通知中心
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem @click="handleLockScreen">
              <Lock />
              锁定屏幕
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="handleLogout" class="text-red-600 focus:text-red-600">
            <LogOut />
            退出登录
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
