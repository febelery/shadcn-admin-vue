<script setup lang="ts">
import { CircleHelp, Command, Settings } from 'lucide-vue-next'
import type { SidebarProps } from '@/components/ui/sidebar'
import PageLayout from '@/layout/page/PageLayout.vue'
import NavMain from './NavMenu.vue'
import NavSecondary from './NavSecondary.vue'
import NavUser from './NavUser.vue'
import SiteHeader from './SiteHeader.vue'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
  variant: 'inset',
})

const data = {
  user: {
    name: 'Ross',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
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
        <NavUser :user="data.user" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    <SidebarInset>
      <SiteHeader />
      <PageLayout />
    </SidebarInset>
  </SidebarProvider>
</template>