<script setup lang="ts">
import { useSiteHeader } from '@/stores/siteHeader'
import SearchForm from './SearchForm.vue'

interface BreadcrumbItem {
  title: string
  href?: string
}

const props = defineProps<{
  title?: string
  breadcrumb?: BreadcrumbItem[]
}>()

const siteHeader = useSiteHeader()
</script>

<template>
  <header
    class="bg-background/50 sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 rounded-t-2xl border-b backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
  >
    <div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
      <SidebarTrigger class="-ml-1" />
      <Separator orientation="vertical" class="mx-2 data-[orientation=vertical]:h-4" />

      <h1 v-if="props.title || siteHeader.title" class="text-base font-medium">
        {{ title || siteHeader.title }}
      </h1>

      <Breadcrumb v-else>
        <BreadcrumbList>
          <template v-for="(item, index) in siteHeader.breadcrumb" :key="index">
            <BreadcrumbItem class="hidden md:block">
              <BreadcrumbLink v-if="item.href" :href="item.href">
                {{ item.title }}
              </BreadcrumbLink>
              <BreadcrumbPage v-else>{{ item.title }}</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator v-if="index < siteHeader.breadcrumb.length - 1" class="hidden md:block" />
          </template>
        </BreadcrumbList>
      </Breadcrumb>
      <SearchForm class="w-full sm:ml-auto sm:w-auto" />
    </div>
  </header>
</template>
