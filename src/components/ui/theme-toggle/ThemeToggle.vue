<template>
  <Button
    variant="ghost"
    size="icon"
    @click="toggleTheme"
    class="h-8 w-8 transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
    :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
  >
    <Motion
      :key="isDark ? 'dark' : 'light'"
      :initial="{ scale: 0, rotate: -90 }"
      :animate="{ scale: 1, rotate: 0 }"
      :exit="{ scale: 0, rotate: 90 }"
      :transition="{ type: 'spring', stiffness: 300, damping: 20 }"
    >
      <Sun v-if="!isDark" class="h-4 w-4" />
      <Moon v-else class="h-4 w-4" />
    </Motion>
  </Button>
</template>

<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'
import { Motion } from 'motion-v'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>