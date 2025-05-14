# shadcn-vue-admin

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
