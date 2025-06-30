<script setup lang="ts">
import UserDataTable from './components/UserDataTable.vue'
</script>

<template>
  <div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">用户管理</h1>
        <p class="text-muted-foreground">管理系统中的所有用户账户</p>
      </div>
    </div>

    <!-- 使用权限包装器控制整个数据表格的显示 -->
    <PermissionWrapper permission="users.view" :show-fallback="true" fallback-text="您没有权限查看用户列表">
      <UserDataTable />
    </PermissionWrapper>
  </div>
</template>