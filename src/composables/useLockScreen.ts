import { onMounted, ref } from 'vue'

const LOCK_SCREEN_KEY = 'lock-screen-state'

// 从 sessionStorage 读取锁定状态
const getStoredLockState = (): boolean => {
  try {
    const stored = sessionStorage.getItem(LOCK_SCREEN_KEY)
    return stored === 'true'
  } catch {
    return false
  }
}

// 保存锁定状态到 sessionStorage
const setStoredLockState = (locked: boolean): void => {
  try {
    sessionStorage.setItem(LOCK_SCREEN_KEY, locked.toString())
  } catch {
    // sessionStorage 不可用时忽略错误
  }
}

const isLocked = ref(false)

export function useLockScreen() {
  // 组件挂载时恢复锁定状态
  onMounted(() => {
    isLocked.value = getStoredLockState()
  })

  const lockScreen = () => {
    isLocked.value = true
    setStoredLockState(true)
  }

  const unlockScreen = () => {
    isLocked.value = false
    setStoredLockState(false)
  }

  return {
    isLocked,
    lockScreen,
    unlockScreen,
  }
}
