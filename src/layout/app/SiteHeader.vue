<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useSiteHeader } from '@/composables/useSiteHeader'
import SearchForm from './SearchForm.vue'

const router = useRouter()
const siteHeader = useSiteHeader()

const goBack = () => {
  router.go(-1)
}
</script>

<template>
  <header
    class="bg-background/50 sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 rounded-t-2xl border-b backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
  >
    <div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
      <SidebarTrigger class="-ml-1" />
      <Separator orientation="vertical" class="mx-2 data-[orientation=vertical]:h-4" />

      <!-- 返回按钮 -->
      <Button v-if="siteHeader.showBackButton.value" variant="ghost" size="icon" @click="goBack" class="mr-2">
        <ArrowLeft class="h-4 w-4" />
      </Button>

      <!-- 页面标题 -->
      <h1 v-if="siteHeader.title.value && !siteHeader.showBreadcrumb.value" class="text-base font-medium">
        {{ siteHeader.title.value }}
      </h1>

      <!-- 面包屑导航 -->
      <Breadcrumb v-else-if="siteHeader.showBreadcrumb.value">
        <BreadcrumbList>
          <template v-for="(item, index) in siteHeader.breadcrumb.value" :key="index">
            <BreadcrumbItem class="hidden md:block">
              <BreadcrumbLink v-if="item.href" :href="item.href" class="flex items-center gap-1">
                <component :is="item.icon" v-if="item.icon" class="h-4 w-4" />
                {{ item.title }}
              </BreadcrumbLink>
              <BreadcrumbPage v-else class="flex items-center gap-1">
                <component :is="item.icon" v-if="item.icon" class="h-4 w-4" />
                {{ item.title }}
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator v-if="index < siteHeader.breadcrumb.value.length - 1" class="hidden md:block" />
          </template>
        </BreadcrumbList>
      </Breadcrumb>

      <!-- 自定义操作按钮 -->
      <div v-if="siteHeader.customActions.value.length > 0" class="ml-auto flex items-center gap-2">
        <component
          v-for="(action, index) in siteHeader.customActions.value"
          :key="index"
          :is="action.component"
          v-bind="action.props"
          @click="action.onClick"
        />
      </div>

      <!-- 右侧工具栏 -->
      <div class="ml-auto flex items-center gap-2">
        <!-- 搜索表单 -->
        <SearchForm class="w-full sm:w-auto" />

        <!-- 主题切换按钮 -->
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>
