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

// 根据用户权限过滤菜单
const filteredMenuItems = computed(() => {
  return menuStore.filteredMenuItems(permissionStore.permissions)
})

// 监听路由变化，设置激活状态
watch(
  () => route.path,
  (newPath) => {
    menuStore.setActiveMenuItem(newPath)
  },
  { immediate: true }
)

onMounted(() => {
  // 初始化时设置当前路由的激活状态
  menuStore.setActiveMenuItem(route.path)
})
</script>

<template>
  <SidebarGroup>
    <SidebarMenu>
      <template v-for="item in filteredMenuItems" :key="item.title">
        <!-- 没有子项的顶级菜单项 -->
        <SidebarMenuItem v-if="!item.items || item.items.length === 0">
          <SidebarMenuButton as-child :data-active="item.isActive">
            <router-link :to="item.url">
              <component :is="item.icon" v-if="item.icon" />
              <span>{{ item.title }}</span>
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