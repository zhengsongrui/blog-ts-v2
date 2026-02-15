# Roo Code 规则 - 前端

## 项目概述

这是一个使用 TypeScript 的 React 前端项目，基于 Vite 构建工具：

- **框架**: React 19 + TypeScript
- **构建工具**: Vite
- **样式**: CSS 模块（可扩展为 Tailwind CSS 或 Sass）
- **代码检查**: ESLint 9.x
- **包管理器**: npm

## 目录结构

```
frontend/
├── .roo/                # Roo Code 前端规则
├── src/                 # 前端源代码
│   ├── assets/          # 静态资源（图片、字体等）
│   ├── components/      # React 组件
│   ├── pages/           # 页面组件
│   ├── hooks/           # 自定义 React Hooks
│   ├── utils/           # 工具函数
│   ├── types/           # TypeScript 类型定义
│   ├── styles/          # 全局样式
│   ├── App.tsx          # 根组件
│   ├── main.tsx         # 应用入口
│   └── index.css        # 全局样式
├── public/              # 静态资源（不经过构建）
├── package.json
├── vite.config.ts       # Vite 配置
├── tsconfig.json        # TypeScript 配置
└── eslint.config.js     # ESLint 配置
```

## 代码风格

### TypeScript 配置
- 严格模式启用（`strict: true`）
- 目标版本：ES2022
- 模块解析：bundler（Vite）
- 避免使用 `any` 类型，尽可能提供明确类型
- 使用 `import type` 进行类型导入

### 命名约定
- **文件/目录**: kebab-case（例如 `user-profile.tsx`）
- **React 组件**: PascalCase（例如 `UserProfile.tsx`）
- **变量/函数**: camelCase
- **类型/接口**: PascalCase（后缀可加 `Type` 或 `Props`）
- **常量**: UPPER_SNAKE_CASE
- **CSS 类名**: kebab-case

### 导入顺序
1. 第三方库（`react`, `react-dom` 等）
2. 内部模块（相对路径）
3. 类型导入单独一行（`import type { ... }`）
4. CSS/样式导入

### React 组件规范
- 使用函数组件和 Hooks
- 组件文件扩展名：`.tsx`
- 使用 `export default` 导出主要组件
- 复杂组件应拆分为子组件
- 使用 TypeScript 接口定义 Props

### 注释规范
- 公共组件/函数使用 JSDoc 注释
- 复杂逻辑添加行内注释
- TODO 注释需标明负责人/日期（例如：`// TODO: [姓名] 2024-01-01 - 优化性能`）

## 开发工作流

### 开发服务器
```bash
cd frontend
npm run dev
```
- 开发服务器运行在 `http://localhost:5173`
- 支持热重载（HMR）

### 构建
```bash
npm run build
```
- 构建产物输出到 `dist/` 目录
- 自动优化和代码分割

### 代码检查
```bash
npm run lint
```
- 使用 ESLint 进行代码质量检查
- 遵循 React Hooks 规则

### 预览构建
```bash
npm run preview
```
- 本地预览生产构建

## 状态管理

### 推荐方案
1. **简单状态**: React `useState` / `useReducer`
2. **跨组件状态**: React Context
3. **复杂应用状态**: Zustand 或 Redux Toolkit（按需引入）

### 状态管理原则
- 保持状态局部化
- 避免过度使用全局状态
- 使用自定义 Hooks 封装状态逻辑

## API 集成

### 数据获取
- 使用 `fetch` 或 `axios` 进行 HTTP 请求
- 推荐使用 React Query 或 SWR 进行数据缓存和同步
- 错误处理统一封装

### 环境变量
- 使用 `import.meta.env` 访问环境变量
- 前缀 `VITE_` 的环境变量会暴露给客户端
- 敏感信息不应存储在客户端代码中

## 样式指南

### CSS 方案
- 基础样式：`index.css`（全局样式）
- 组件样式：CSS 模块（`*.module.css`）
- 可选扩展：Tailwind CSS 或 Sass

### 响应式设计
- 使用移动优先的响应式设计
- 断点定义：`sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px)

## 测试策略

### 测试工具
- **单元测试**: Vitest + React Testing Library
- **组件测试**: React Testing Library
- **E2E 测试**: Playwright 或 Cypress（按需）

### 测试文件位置
- 与组件同目录：`Component.test.tsx`
- 或集中放在 `__tests__/` 目录

## 性能优化

### 构建优化
- 代码分割（路由级和组件级）
- 图片优化（使用 Vite 插件）
- 第三方库按需加载

### 运行时优化
- React.memo 用于纯组件
- useMemo / useCallback 避免不必要的重渲染
- 虚拟列表处理长列表

## 注意事项

1. **浏览器兼容性**: 支持现代浏览器（Chrome >= 90, Firefox >= 88, Safari >= 14）
2. **SEO 考虑**: 如需 SEO，考虑使用 Next.js 或 React Helmet
3. **可访问性**: 遵循 WCAG 2.1 AA 标准，使用语义化 HTML 和 ARIA 属性
4. **安全性**: 防范 XSS 攻击，对用户输入进行转义

---

**详细规则请参考项目文档和代码示例。**