<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMenuStore } from '@/stores/menu'
import { usePermissionStore } from '@/stores/permission'
import NavMenuItems from './NavMenuItems.vue'
import { type MenuItem, getMenuActiveState, hasActiveChild } from './useMenu'

const menuStore = useMenuStore()
const permissionStore = usePermissionStore()
const route = useRoute()

// 初始化菜单
onMounted(() => {
  menuStore.initializeMenu()
  menuStore.setActiveMenuPath(route.path)
})

// 根据用户权限过滤菜单
const filteredMenuItems = computed(() => {
  const items = menuStore.filteredMenuItems(permissionStore.permissions)
  return items
})

// 监听路由变化，设置激活状态
watch(
  () => route.path,
  (newPath) => {
    menuStore.setActiveMenuPath(newPath)
  }
)

// 检查菜单是否正在加载
const isLoading = computed(() => {
  return menuStore.menuItems.length === 0
})
</script>

<template>
  <SidebarGroup>
    <SidebarMenu>
      <!-- 加载状态 -->
      <template v-if="isLoading">
        <div class="p-4 text-sm text-muted-foreground">
          正在加载菜单...
        </div>
      </template>
      
      <!-- 菜单项 -->
      <template v-else>
        <template v-for="item in filteredMenuItems" :key="item.title">
          <!-- 没有子项的顶级菜单项 -->
          <SidebarMenuItem v-if="!item.items || item.items.length === 0">
            <SidebarMenuButton 
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
                <SidebarMenuButton 
                  :tooltip="item.title" 
                  :class="getMenuActiveState(item) && ''"
                  :disabled="item.disabled"
                >
                  <component :is="item.icon" v-if="item.icon" />
                  <span>{{ item.title }}</span>
                  <SidebarMenuBadge v-if="item.badge">{{ item.badge }}</SidebarMenuBadge>
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
      </template>
    </SidebarMenu>
  </SidebarGroup>
</template>