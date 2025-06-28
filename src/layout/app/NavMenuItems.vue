<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import { type MenuItem, getMenuActiveState, hasActiveChild } from './useMenu'

const props = defineProps<{
  items: MenuItem[]
}>()
</script>

<template>
  <SidebarMenuSub>
    <template v-for="item in items" :key="item.title">
      <!-- 没有子项的菜单项 -->
      <SidebarMenuSubItem v-if="!item.items || item.items.length === 0">
        <SidebarMenuSubButton 
          as-child 
          :data-active="item.isActive"
          :disabled="item.disabled"
        >
          <router-link 
            :to="item.url"
            :target="item.target"
            :class="{ 'pointer-events-none opacity-50': item.disabled }"
          >
            <component :is="item.icon" v-if="item.icon" />
            <span>{{ item.title }}</span>
            <SidebarMenuBadge v-if="item.badge">{{ item.badge }}</SidebarMenuBadge>
          </router-link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>

      <!-- 有子项的菜单项 -->
      <Collapsible
        v-else
        as-child
        :default-open="item.isActive || hasActiveChild(item.items)"
        class="group/subcollapsible"
      >
        <SidebarMenuSubItem>
          <CollapsibleTrigger as-child>
            <SidebarMenuSubButton 
              :class="getMenuActiveState(item) && ''"
              :disabled="item.disabled"
            >
              <component :is="item.icon" v-if="item.icon" />
              <span>{{ item.title }}</span>
              <SidebarMenuBadge v-if="item.badge">{{ item.badge }}</SidebarMenuBadge>
              <ChevronRight
                class="ml-auto transition-transform duration-200 group-data-[state=open]/subcollapsible:rotate-90"
              />
            </SidebarMenuSubButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <NavMenuItems :items="item.items" />
          </CollapsibleContent>
        </SidebarMenuSubItem>
      </Collapsible>
    </template>
  </SidebarMenuSub>
</template>