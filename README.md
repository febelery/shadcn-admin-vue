# shadcn-vue-admin

## 权限系统

### 权限指令

项目提供了强大的权限指令 `v-permission`，可以在模板中直接控制元素的显示和行为。

#### 基本用法

```vue
<!-- 需要单个权限 -->
<Button v-permission="'users.create'">添加用户</Button>

<!-- 需要多个权限中的任一个 -->
<Button v-permission="['users.create', 'users.edit']">操作</Button>

<!-- 需要所有权限 -->
<Button v-permission:all="['users.create', 'users.edit']">高级操作</Button>
```

#### 修饰符

```vue
<!-- 无权限时隐藏元素（而不是移除） -->
<Button v-permission.hide="'users.create'">添加用户</Button>

<!-- 无权限时禁用元素 -->
<Button v-permission.disable="'users.create'">添加用户</Button>
```

#### 权限包装器组件

对于复杂的权限控制场景，可以使用 `PermissionWrapper` 组件：

```vue
<PermissionWrapper 
  permission="users.view" 
  :show-fallback="true" 
  fallback-text="您没有权限查看用户列表"
>
  <UserTable />
  
  <template #fallback>
    <div class="custom-no-permission-message">
      自定义无权限提示
    </div>
  </template>
</PermissionWrapper>
```

#### 权限组合式函数

在组件逻辑中使用权限：

```vue
<script setup>
import { usePermission } from '@/composables/usePermission'

const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission()

// 响应式权限检查
const canCreateUser = hasPermission('users.create')
const canManageUsers = hasAnyPermission(['users.create', 'users.edit', 'users.delete'])
const canFullAccess = hasAllPermissions(['users.create', 'users.edit', 'users.delete'])

// 非响应式权限检查
const { checkPermission } = usePermission()
if (checkPermission('users.create')) {
  // 执行需要权限的操作
}
</script>
```

### 权限配置

权限在路由配置中定义：

```typescript
{
  path: '/users',
  meta: {
    title: '用户管理',
    permission: 'users.view', // 单个权限
    // permission: ['users.view', 'users.manage'], // 多个权限
  }
}
```

### 权限列表

系统中定义的权限包括：

- `dashboard.view` - 查看仪表板
- `users.view` - 查看用户列表
- `users.create` - 创建用户
- `users.edit` - 编辑用户
- `users.delete` - 删除用户
- `articles.view` - 查看文章
- `articles.create` - 创建文章
- `articles.edit` - 编辑文章
- `articles.delete` - 删除文章
- `system.view` - 查看系统设置
- `system.settings` - 修改系统设置
- `system.notifications` - 管理通知

## 1. 关于 `<motion />` 组件

由于目前 `<motion />` 组件不支持自动导入，请手动从 `motion-v` 中导入：

```ts
import { motion } from 'motion-v'
```

## 2. 启用组件类型提示

为了让编辑器正确识别自动导入的组件类型提示，请在 `tsconfig.app.json` 文件中添加以下配置：

```json
"include": ["components.d.ts"]
```

添加后，开发过程中可获得更好的类型提示和自动补全体验。

## 3. 配置 ESLint（`eslint.config.ts`）

建议使用以下配置以支持 Vue、TypeScript 和代码格式化，并避免未使用变量的报错：

```ts
export default defineConfigWithVueTs({
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
})
```

- vue/multi-word-component-names: 关闭组件名称的多单词命名规则，以支持自定义组件。
- @typescript-eslint/no-unused-vars: 关闭未使用变量的报错，以支持自定义组件。
- @typescript-eslint/no-explicit-any: 关闭显式的 any 类型，以支持自定义组件。