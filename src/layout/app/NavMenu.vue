<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import NavMenuItems from './NavMenuItems.vue'
import { type MenuItem, getMenuActiveState, hasActiveChild } from './useMenu'

const props = defineProps<{
  items: MenuItem[]
}>()
</script>

<template>
  <SidebarGroup>
    <!-- <SidebarGroupLabel>Platform</SidebarGroupLabel> -->
    <SidebarMenu>
      <template v-for="item in items" :key="item.title">
        <!-- 没有子项的顶级菜单项 -->
        <SidebarMenuItem v-if="!item.items || item.items.length === 0">
          <SidebarMenuButton as-child :data-active="item.isActive">
            <a :href="item.url">
              <component :is="item.icon" v-if="item.icon" />
              <span>{{ item.title }}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <!-- 有子项的菜单项使用可折叠菜单 -->
        <Collapsible
          v-else
          as-child
          :default-open="item.isActive || hasActiveChild(item.items)"
          class="group/collapsible"
          :animated="true"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger as-child>
              <SidebarMenuButton :tooltip="item.title" :class="getMenuActiveState(item) && ''">
                <component :is="item.icon" v-if="item.icon" />
                <span>{{ item.title }}</span>
                <ChevronRight
                  class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <NavMenuItems :items="item.items" />
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </template>
    </SidebarMenu>
  </SidebarGroup>
</template>
