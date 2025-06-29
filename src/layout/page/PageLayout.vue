<template>
  <router-view v-slot="{ Component, route }">
    <Suspense>
      <template #default>
        <transition name="fade" mode="out-in" appear>
          <component :is="Component" v-if="!useKeepAlive" :key="route.name" />
          <keep-alive v-else :include="cacheList">
            <component :is="Component" :key="route.name" />
          </keep-alive>
        </transition>
      </template>
      <template #fallback>
        <div class="flex h-full items-center justify-center">
          <div class="text-center">
            <div
              class="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
            ></div>
            <p class="text-muted-foreground text-sm">正在加载...</p>
          </div>
        </div>
      </template>
    </Suspense>
  </router-view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const cacheList = ref([])
const useKeepAlive = ref(false)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
