<script setup lang="ts">
import { Search } from 'lucide-vue-next'
</script>

<template>
  <form>
    <div class="relative">
      <Label htmlFor="search" class="sr-only"> Search </Label>
      <SidebarInput id="search" placeholder="搜索..." class="h-8 pl-7" />
      <Search class="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
    </div>
  </form>
</template>
