<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade" mode="out-in" appear>
      <component :is="Component" v-if="!useKeepAlive" :key="route.fullPath" />
      <keep-alive v-else :include="cacheList">
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const cacheList = ref([])
const useKeepAlive = ref(false)
</script>
