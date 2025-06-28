<script setup lang="ts">
// 移除手动设置标题的代码，现在完全自动化
// import { onMounted } from 'vue'
// import { useSiteHeader } from '@/stores/siteHeader'
// import SectionCards from './components/SectionCards.vue'

// onMounted(() => {
//   useSiteHeader().setTitle('Dashboard')
// })

import SectionCards from './components/SectionCards.vue'
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div class="@container/main flex flex-1 flex-col gap-2">
      <div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />
      </div>
    </div>
  </div>
</template>