<script setup lang="ts">
import { AudioWaveform, BookOpen, Bot, CircleHelp, Command, Settings, Settings2, SquareTerminal } from 'lucide-vue-next'
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
  navMain: [
    {
      title: '第一级菜单',
      url: '#',
      icon: BookOpen,
    },
    {
      title: 'Playground',
      url: '#',
      icon: SquareTerminal,
      items: [
        {
          title: 'History',
          url: '#',
        },
        {
          title: 'Starred',
          url: '#',
        },
        {
          title: '第二级菜单',
          url: '#',
          items: [
            {
              title: '第三级菜单',
              url: '#',
            },
            {
              title: 'Starred',
              url: '#',
            },
            {
              title: 'Hell Ross',
              icon: AudioWaveform,
              url: '#',
              items: [
                {
                  title: '第四级菜单',
                  isActive: true,
                  url: '#',
                },
                {
                  title: 'Starred',
                  url: '#',
                },
                {
                  title: 'Settings',
                  url: '#',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Models',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
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
              <a href="#">
                <div
                  class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
                >
                  <Command class="size-4" />
                </div>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-semibold">Acme Inc</span>
                  <span class="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain :items="data.navMain" />
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
