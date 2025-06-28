import { ref, onMounted, watch } from 'vue'

type Theme = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = 'theme'

// 全局主题状态
const theme = ref<Theme>('system')
const isDark = ref(false)

// 获取系统主题偏好
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// 应用主题到 DOM
function applyTheme(newTheme: Theme) {
  const root = document.documentElement
  
  if (newTheme === 'system') {
    const systemTheme = getSystemTheme()
    isDark.value = systemTheme === 'dark'
    root.classList.toggle('dark', systemTheme === 'dark')
  } else {
    isDark.value = newTheme === 'dark'
    root.classList.toggle('dark', newTheme === 'dark')
  }
}

// 从本地存储加载主题
function loadTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme
    return stored || 'system'
  } catch {
    return 'system'
  }
}

// 保存主题到本地存储
function saveTheme(newTheme: Theme) {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
  } catch {
    // 忽略存储错误
  }
}

export function useTheme() {
  // 初始化主题
  const initTheme = () => {
    const savedTheme = loadTheme()
    theme.value = savedTheme
    applyTheme(savedTheme)
  }

  // 设置主题
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    saveTheme(newTheme)
    applyTheme(newTheme)
  }

  // 切换明暗主题（忽略系统主题）
  const toggleTheme = () => {
    const newTheme = isDark.value ? 'light' : 'dark'
    setTheme(newTheme)
  }

  // 监听系统主题变化
  const setupSystemThemeListener = () => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme.value === 'system') {
        applyTheme('system')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    
    // 返回清理函数
    return () => mediaQuery.removeEventListener('change', handleChange)
  }

  // 监听主题变化
  watch(theme, (newTheme) => {
    applyTheme(newTheme)
  })

  // 组件挂载时初始化
  onMounted(() => {
    initTheme()
    const cleanup = setupSystemThemeListener()
    
    // 组件卸载时清理
    return cleanup
  })

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
    initTheme,
  }
}