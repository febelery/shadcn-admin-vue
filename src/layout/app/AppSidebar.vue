<script setup lang="ts">
import { CircleHelp, Command, Settings } from 'lucide-vue-next'
import { onMounted } from 'vue'
import LockScreen from '@/components/LockScreen.vue'
import type { SidebarProps } from '@/components/ui/sidebar'
import PageLayout from '@/layout/page/PageLayout.vue'
import { useUserStore } from '@/stores/user'
import NavMain from './NavMenu.vue'
import NavSecondary from './NavSecondary.vue'
import NavUser from './NavUser.vue'
import SiteHeader from './SiteHeader.vue'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
  variant: 'inset',
})

const userStore = useUserStore()

// 组件挂载时尝试获取用户信息
onMounted(async () => {
  if (userStore.isLoggedIn && !userStore.userInfo) {
    try {
      await userStore.getUserInfo()
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }
})

const data = {
  navSecondary: [
    {
      title: 'Get Help',
      url: '#',
      icon: CircleHelp,
    },
    {
      title: 'Setting',
      url: '#',
      icon: Settings,
    },
  ],
}
</script>

<template>
  <SidebarProvider>
    <Sidebar v-bind="props">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" as-child>
              <router-link to="/dashboard">
                <div
                  class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
                >
                  <Command class="size-4" />
                </div>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-semibold">Acme Inc</span>
                  <span class="truncate text-xs">Enterprise</span>
                </div>
              </router-link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavSecondary :items="data.navSecondary" class="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    <SidebarInset>
      <SiteHeader />
      <PageLayout />
    </SidebarInset>

    <!-- 锁屏组件 -->
    <LockScreen />
  </SidebarProvider>
</template>
