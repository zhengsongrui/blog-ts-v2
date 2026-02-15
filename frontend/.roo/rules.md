# Roo Code 规则 - 前端个人博客项目

## 项目概述

这是一个基于 TypeScript 的现代化 React 前端项目，面向个人博客系统，采用国内主流技术栈：

- **框架**: React 18 + TypeScript
- **UI 组件库**: Ant Design (antd) 5.x
- **状态管理**: Zustand 4.x
- **样式方案**: Less (CSS 预处理器) + CSS Modules
- **HTTP 客户端**: Axios
- **路由管理**: React Router DOM 6.x
- **构建工具**: Vite 5.x
- **代码检查**: ESLint 9.x + TypeScript ESLint
- **代码格式化**: Prettier
- **工具库**: dayjs, lodash-es, ahooks
- **包管理器**: npm

## 目录结构

```
frontend/
├── .roo/                    # Roo Code 前端规则
├── public/                  # 静态资源（不经过构建）
├── src/                     # 前端源代码
│   ├── api/                 # API 接口层
│   │   ├── client.ts        # Axios 实例和请求拦截器
│   │   ├── endpoints/       # 各个模块的 API 端点定义
│   │   │   ├── user.api.ts  # 用户相关接口
│   │   │   ├── post.api.ts  # 文章相关接口
│   │   │   └── index.ts     # 统一导出
│   │   └── types/           # 从 OpenAPI 生成的类型定义
│   ├── assets/              # 静态资源（图片、字体等）
│   ├── components/          # 通用 React 组件
│   │   ├── common/          # 全局通用组件（Button、Input 等封装）
│   │   ├── layout/          # 布局组件（Header、Sidebar 等）
│   │   └── ui/              # 基础 UI 组件（基于 antd 二次封装）
│   ├── config/              # 应用配置
│   │   ├── constants.ts     # 常量定义
│   │   ├── routes.ts        # 路由配置
│   │   └── theme.ts         # 主题配置
│   ├── hooks/               # 自定义 React Hooks
│   │   ├── useAuth.ts       # 认证相关逻辑
│   │   ├── usePosts.ts      # 文章相关逻辑
│   │   └── index.ts         # 统一导出
│   ├── layouts/             # 页面布局组件
│   │   ├── MainLayout.tsx   # 主布局
│   │   └── AuthLayout.tsx   # 认证相关布局
│   ├── pages/               # 页面组件
│   │   ├── Home/            # 首页
│   │   ├── Login/           # 登录页
│   │   ├── Register/        # 注册页
│   │   ├── Posts/           # 文章列表页
│   │   ├── PostDetail/      # 文章详情页
│   │   ├── UserProfile/     # 用户个人中心
│   │   └── Admin/           # 管理后台页面
│   ├── stores/              # Zustand 状态存储
│   │   ├── auth.store.ts    # 认证状态
│   │   ├── post.store.ts    # 文章状态
│   │   └── index.ts         # 统一导出
│   ├── styles/              # 全局样式
│   │   ├── globals.less     # 全局 Less 样式
│   │   ├── antd.less        # Ant Design 主题定制
│   │   ├── variables.less   # Less 变量定义
│   │   └── mixins.less      # Less Mixins
│   ├── types/               # TypeScript 类型定义
│   │   ├── api.types.ts     # API 相关类型
│   │   ├── common.types.ts  # 通用类型
│   │   └── index.ts         # 统一导出
│   ├── utils/               # 工具函数
│   │   ├── auth.ts          # 认证工具（token 管理）
│   │   ├── format.ts        # 格式化工具
│   │   ├── request.ts       # 请求工具封装
│   │   └── validation.ts    # 表单验证工具
│   ├── App.tsx              # 根组件
│   ├── main.tsx             # 应用入口
│   └── router.tsx           # 路由配置组件
├── .env.example             # 环境变量示例
├── .eslintrc.js             # ESLint 配置
├── .prettierrc              # Prettier 配置
├── index.html               # HTML 入口
├── package.json             # 依赖管理
├── tsconfig.json            # TypeScript 配置
├── tsconfig.node.json       # Node 类型配置
├── vite.config.ts           # Vite 配置
```

## 代码风格

### TypeScript 配置
- 严格模式启用（`strict: true`）
- 目标版本：ES2022
- 模块解析：bundler（Vite）
- 禁止使用 `any` 类型，尽可能提供明确类型
- 使用 `import type` 进行类型导入
- 使用 `interface` 而非 `type` 定义对象类型（可扩展性）

### 命名约定
- **文件/目录**: kebab-case（例如 `user-profile.tsx`）
- **React 组件**: PascalCase（例如 `UserProfile.tsx`）
- **自定义 Hook**: camelCase，前缀 `use`（例如 `useAuth`）
- **状态存储**: camelCase，后缀 `.store.ts`（例如 `auth.store.ts`）
- **变量/函数**: camelCase
- **类型/接口**: PascalCase，后缀可加 `Type` 或 `Props`（例如 `UserProps`）
- **常量**: UPPER_SNAKE_CASE
- **CSS 类名**: 使用 kebab-case 或 BEM 命名法
- **枚举**: PascalCase，成员 UPPER_SNAKE_CASE

### 导入顺序
1. 第三方库（`react`, `antd`, `zustand` 等）
2. 项目内部模块（按层级从外到内）
3. 类型导入单独一行（`import type { ... }`）
4. 样式导入（CSS/LESS）
5. 资源导入（图片、字体）

示例：
```typescript
import React, { useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import { useAuthStore } from '@/stores';
import type { User } from '@/types';
import { formatDate } from '@/utils/format';
import './styles.module.css';
```

### React 组件规范
- 使用函数组件和 Hooks
- 组件文件扩展名：`.tsx`
- 使用 `export default` 导出主要组件
- 复杂组件应拆分为子组件，每个组件职责单一
- 使用 TypeScript 接口定义 Props，并提供默认值
- 使用 `React.memo` 优化性能（按需）
- 事件处理函数以 `handle` 前缀命名（例如 `handleSubmit`）
- 自定义 Hook 封装可复用逻辑

### 注释规范
- 公共组件/函数使用 JSDoc 注释，说明用途、参数、返回值
- 复杂业务逻辑添加行内注释
- TODO 注释需标明负责人/日期（例如：`// TODO: [姓名] 2026-02-15 - 优化性能`）
- 使用中文注释，保持清晰易懂

### 状态管理规范
- 全局状态使用 Zustand，按模块划分 store
- 每个 store 文件包含状态、actions、getters
- 使用 `immer` 处理不可变数据（Zustand 内置支持）
- 避免过度使用全局状态，优先使用局部状态

### 样式规范
- 使用 Less 作为 CSS 预处理器，支持嵌套、变量、Mixin 等特性
- 全局样式放在 `globals.less` 中，通过 Vite 自动导入
- 组件级别样式使用 CSS Modules（`*.module.less`）进行样式隔离
- Ant Design 组件通过 `antd.less` 和 `ConfigProvider` 进行主题定制
- 响应式设计采用移动优先，使用 Less 变量定义断点
- 避免使用内联样式，优先使用类名和 CSS Modules
- 样式文件组织：按功能模块划分，与组件目录结构保持一致

#### CSS Modules 使用规范
为了确保样式隔离并避免类名冲突，所有组件级别样式必须使用 CSS Modules（文件后缀 `.module.less`）。在 TypeScript/JSX 中引用类名时，必须遵循以下规范：

1. **导入样式对象**：使用 `import styles from './Component.module.less';` 导入样式对象。
2. **类名引用格式**：必须使用 `styles['class-name']` 格式引用类名，**禁止**使用 `styles.className` 点语法（因为类名可能包含连字符）。
3. **示例**：
   ```tsx
   // 正确 ✅
   import styles from './Login.module.less';
   
   const Login = () => {
     return <div className={styles['login-page']}>...</div>;
   };
   
   // 错误 ❌
   import './Login.module.less'; // 缺少 styles 导入
   const Login = () => {
     return <div className="login-page">...</div>; // 直接使用字符串类名
   };
   
   // 错误 ❌
   import styles from './Login.module.less';
   const Login = () => {
     return <div className={styles.loginPage}>...</div>; // 使用点语法（类名可能不存在）
   };
   ```
4. **类名命名**：CSS 类名使用 kebab-case（例如 `login-page`、`form-input`），与 Less 文件中的类名保持一致。
5. **动态类名**：如需动态拼接类名，可使用模板字符串或 `classnames` 库，但必须通过 `styles[]` 引用：
   ```tsx
   const className = `${styles['button']} ${styles['button-primary']}`;
   // 或使用 classnames 库
   import cn from 'classnames';
   const className = cn(styles['button'], styles['button-primary'], { [styles['disabled']]: isDisabled });
   ```
6. **全局类名**：如需使用全局样式（如 Ant Design 组件覆盖），可在同一元素上混合使用：
   ```tsx
   <div className={`${styles['custom-wrapper']} ant-card`}>...</div>
   ```

违反上述规范将导致样式不生效或产生冲突，请所有开发人员严格遵守。

## 开发工作流

### 环境准备
```bash
cd frontend
npm install                   # 安装依赖
cp .env.example .env          # 配置环境变量
```

### 开发服务器
```bash
npm run dev
```
- 开发服务器运行在 `http://localhost:5173`
- 支持热重载（HMR）
- API 代理配置在 `vite.config.ts` 中

### 代码检查
```bash
npm run lint                  # ESLint 检查
npm run lint:fix              # 自动修复
npm run format                # Prettier 格式化
```

### 构建
```bash
npm run build
```
- 构建产物输出到 `dist/` 目录
- 自动优化和代码分割
- 类型检查通过 `tsc`

### 预览构建
```bash
npm run preview
```

## API 集成规范

### 请求层架构
1. **Axios 实例**：在 `src/api/client.ts` 中创建配置，包括 baseURL、超时、拦截器
2. **接口定义**：根据后端 OpenAPI 规范，在 `src/api/endpoints/` 目录下按模块定义
3. **类型安全**：使用从 OpenAPI 生成的 TypeScript 类型
4. **错误处理**：统一错误处理拦截器，转换错误消息

### 类型定义结构
根据 OpenAPI 规范，类型定义按模块组织在 `src/api/types/` 目录下：

- `common.types.ts` - 通用类型（ApiResponse、ApiError、PaginationInfo、枚举等）
- `user.types.ts` - 用户相关类型（User、CreateUserDto、LoginDto 等）
- `post.types.ts` - 文章相关类型（Post、Category、Tag、CreatePostDto 等）
- `system.types.ts` - 系统相关类型（HealthResponse、WelcomeResponse 等）
- `index.ts` - 统一导出所有类型

类型定义原则：
1. 使用 `interface` 而非 `type` 定义对象类型（可扩展性）
2. 枚举使用 `enum` 定义，成员使用 UPPER_SNAKE_CASE
3. DTO 类型使用 `Dto` 后缀
4. 响应类型使用 `ApiResponse{Entity}` 命名
5. 分页响应使用 `PaginatedResponse{Entity}` 命名

### 请求示例
```typescript
// src/api/endpoints/user.api.ts
import { apiClient } from '../client';
import type { LoginDto, AuthResponse, ApiResponseUser } from '../types';

export const userApi = {
  login: (data: LoginDto) => apiClient.post<AuthResponse>('/users/login', data),
  getCurrentUser: () => apiClient.get<ApiResponseUser>('/users/me'),
};
```

### 状态管理集成
- API 调用在组件或自定义 Hook 中进行
- 成功后将数据更新到对应的 Zustand store
- 使用 loading、error 状态管理请求状态

### API 使用示例
```typescript
// 在 React 组件中使用 API
import { useState, useEffect } from 'react';
import { userApi } from '@/api/endpoints';
import type { User } from '@/api/types';

function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await userApi.getCurrentUser();
        setUser(userData);
      } catch (err) {
        setError('获取用户信息失败');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>用户不存在</div>;

  return (
    <div>
      <h1>{user.username}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

## 组件开发规范

### Ant Design 使用规范
- 直接使用 antd 组件，避免过度封装
- 表单使用 `Form.Item` 和 `rules` 进行验证
- 表格使用 `Table` 组件，配置 `columns` 和 `dataSource`
- 模态框使用 `Modal` 组件，注意销毁时机

### 自定义组件规范
- 组件 props 使用接口定义，可选参数提供默认值
- 组件内部状态使用 `useState`，复杂逻辑提取为自定义 Hook
- 事件回调使用 `onEvent` 命名，传递参数时使用函数参数而非 event 对象

### 布局组件规范
- 使用 Ant Design 的 `Layout` 组件构建页面布局
- 侧边栏导航使用 `Menu` 组件

## 状态管理规范

### Zustand Store 结构
```typescript
// src/stores/auth.store.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        login: (user, token) => set({ user, token, isAuthenticated: true }),
        logout: () => set({ user: null, token: null, isAuthenticated: false }),
      }),
      { name: 'auth-storage' }
    )
  )
);
```

### Store 使用原则
- 每个业务模块一个 store 文件
- store 命名：`use{Module}Store`
- 复杂业务逻辑放在 store 的 actions 中
- 使用 selector 避免不必要的重渲染

## 样式与主题

### Less 配置
- 在 `vite.config.ts` 中配置 Less 支持，开启 CSS Modules
- 定义全局 Less 变量文件（`variables.less`），包含颜色、字体、间距等设计令牌
- 使用 `@import` 导入变量和 Mixin，保持样式一致性
- 支持自动前缀和 CSS 压缩

### Ant Design 主题定制
- 在 `src/styles/antd.less` 中修改 Less 变量，覆盖 Ant Design 默认主题
- 通过 `ConfigProvider` 配置主题 token，实现动态主题切换
- 保持设计系统一致性，自定义颜色与项目变量同步

### 响应式设计
- 移动优先：先写移动端样式，再使用媒体查询（`@media`）适配大屏幕
- 在 `variables.less` 中定义断点变量：`@screen-sm: 640px`, `@screen-md: 768px`, `@screen-lg: 1024px`, `@screen-xl: 1280px`, `@screen-2xl: 1536px`
- 使用 Less Mixin 封装响应式工具类，提高代码复用性

## 性能优化

### 构建优化
- 代码分割（路由级和组件级）
- 图片优化（使用 Vite 插件）
- 第三方库按需加载（antd 使用 `babel-plugin-import`）

### 运行时优化
- `React.memo` 用于纯组件
- `useMemo` / `useCallback` 避免不必要的重渲染
- 虚拟列表处理长列表（使用 `antd` 的 `Table` 虚拟滚动）
- 图片懒加载

### 状态优化
- Zustand 使用 selector 提取部分状态
- 避免在 store 中存储过大对象
- 使用持久化存储时注意性能影响

## 测试策略

### 测试工具
- **单元测试**: Vitest + React Testing Library
- **组件测试**: React Testing Library
- **E2E 测试**: Playwright（按需）

### 测试文件位置
- 与组件同目录：`Component.test.tsx`
- 测试工具函数放在 `__tests__/` 目录

### 测试覆盖范围
- 组件渲染是否正确
- 用户交互是否正常
- 状态管理是否正确更新
- API 调用是否正确 mock

## 部署与运维

### 环境变量
- 开发环境：`.env.development`
- 生产环境：`.env.production`
- 测试环境：`.env.test`

### 构建配置
- 配置 `base` 路径支持子目录部署
- 配置 CDN 资源路径
- 开启 gzip 压缩

### 监控与日志
- 前端错误监控（Sentry 或自建）
- 用户行为分析（按需）

## 代码提交规范

### Git Commit 规范
- 使用 Conventional Commits 格式
- 类型：feat, fix, docs, style, refactor, test, chore
- 示例：`feat(users): 添加用户登录功能`

### 分支策略
- `main`: 生产环境分支
- `develop`: 开发分支
- `feature/*`: 功能分支
- `hotfix/*`: 热修复分支

## 注意事项

1. **浏览器兼容性**: 支持现代浏览器（Chrome >= 90, Firefox >= 88, Safari >= 14），按需添加 polyfill
2. **SEO 考虑**: 使用 React Helmet 管理页面 meta 信息
3. **可访问性**: 遵循 WCAG 2.1 AA 标准，使用语义化 HTML 和 ARIA 属性
4. **安全性**: 防范 XSS 攻击，对用户输入进行转义和验证
5. **国际化**: 使用 `react-i18next` 支持多语言（按需）

## 参考资源

- [Ant Design 文档](https://ant.design/docs/react/introduce-cn)
- [Zustand 文档](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Less 中文文档](https://lesscss.org/)
- [Ant Design 主题定制](https://ant.design/docs/react/customize-theme-cn)
- [React 文档](https://react.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)

---

**以上规则为前端个人博客项目的开发规范，所有代码必须遵循此规范。如有更新，请及时同步。**

*最后更新: 2026-02-15（添加 CSS Modules 使用规范）*
*版本: 2.1.0*