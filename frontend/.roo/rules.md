# Roo Code 规则 - 前端（AI专用）

## 项目概述
- **框架**: React 18 + TypeScript
- **UI 组件库**: Ant Design (antd) 5.x
- **状态管理**: Zustand 4.x
- **样式方案**: Less + CSS Modules
- **HTTP 客户端**: Axios
- **路由管理**: React Router DOM 6.x
- **构建工具**: Vite 5.x
- **包管理器**: npm

## 目录结构（关键）
```
frontend/src/
├── api/                 # API 接口层（client.ts, endpoints/, types/）
├── assets/              # 静态资源
├── components/          # React 组件（common/, layout/, ui/）
├── config/              # 应用配置（constants.ts, routes.ts, theme.ts）
├── hooks/               # 自定义 React Hooks
├── layouts/             # 页面布局组件
├── pages/               # 页面组件（Home, Login, Posts, Admin等）
├── stores/              # Zustand 状态存储（auth.store.ts, post.store.ts等）
├── styles/              # 全局样式（globals.less, variables.less）
├── types/               # TypeScript 类型定义
├── utils/               # 工具函数
├── App.tsx              # 根组件
├── main.tsx             # 应用入口
└── router.tsx           # 路由配置组件
```

## 代码风格
- **TypeScript**: 严格模式启用，禁止使用 `any`，使用 `import type` 进行类型导入，接口优先于类型别名
- **命名约定**:
  - 文件/目录: kebab-case（`user-profile.tsx`）
  - React 组件: PascalCase（`UserProfile.tsx`）
  - 自定义 Hook: camelCase，前缀 `use`（`useAuth`）
  - 状态存储: camelCase，后缀 `.store.ts`（`auth.store.ts`）
  - 变量/函数: camelCase
  - 类型/接口: PascalCase，后缀可加 `Props`/`Type`（`UserProps`）
  - 常量: UPPER_SNAKE_CASE
- **导入顺序**: 1) 第三方库 2) 项目内部模块 3) 类型导入 4) 样式导入
- **React 组件规范**: 函数组件 + Hooks，Props 使用接口定义，事件处理函数以 `handle` 前缀命名，复杂逻辑提取为自定义 Hook

## 状态管理
- 全局状态使用 **Zustand**，按模块划分 store
- 每个 store 文件包含状态、actions、getters，使用 `immer` 处理不可变数据
- 避免过度使用全局状态，优先使用局部状态
- 使用 selector 避免不必要的重渲染

## 样式规范
- 使用 **Less** 作为 CSS 预处理器，支持变量、嵌套、Mixin
- 全局样式放在 `globals.less` 中，通过 Vite 自动导入
- 组件级别样式使用 **CSS Modules**（`*.module.less`）进行样式隔离
- **CSS Modules 使用规范**:
  - 导入样式对象: `import styles from './Component.module.less';`
  - 类名引用格式: **必须**使用 `styles['class-name']` 格式，禁止使用点语法
  - 类名命名: kebab-case（例如 `login-page`）
- Ant Design 组件通过 `antd.less` 和 `ConfigProvider` 进行主题定制
- 响应式设计采用移动优先，使用 Less 变量定义断点

## API 集成
- Axios 实例配置在 `src/api/client.ts`（baseURL、拦截器）
- 接口定义按模块放在 `src/api/endpoints/`（`user.api.ts`, `post.api.ts` 等）
- 类型定义使用从 OpenAPI 生成的 TypeScript 类型（位于 `src/api/types/`）
- 请求示例:
```typescript
import { apiClient } from '@/api/client';
export const userApi = {
  login: (data: LoginDto) => apiClient.post<AuthResponse>('/users/login', data),
};
```
- API 调用在组件或自定义 Hook 中进行，成功后将数据更新到对应的 Zustand store

## 开发工作流
```bash
cd frontend
npm install                    # 安装依赖
npm run dev                   # 启动开发服务器（http://localhost:5173）
npm run lint                  # ESLint 检查
npm run lint:fix              # 自动修复
npm run format                # Prettier 格式化
npm run build                 # 构建产物（dist/）
npm run preview               # 预览构建
```

## 注意事项（针对AI）
1. **CSS Modules 引用规范**：务必使用 `styles['class-name']` 格式，否则样式不生效
2. **类型安全**：禁止使用 `any`，确保所有函数和组件都有明确的类型定义
3. **组件拆分**：复杂组件应拆分为子组件，每个组件职责单一
4. **错误处理**：API 调用必须有错误处理（try-catch 或错误状态）
5. **性能优化**：合理使用 `React.memo`、`useMemo`、`useCallback`，避免不必要的重渲染

---
**本规则专为 AI 助手设计，确保生成的代码符合项目规范。**