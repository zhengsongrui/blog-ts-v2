# Roo Code 规则 - 后端

## 项目概述

这是一个使用 TypeScript 的 Node.js 后端项目，基于 Express 框架：

- **运行时**: Node.js >= 18.0.0
- **框架**: Express 5.x
- **语言**: TypeScript 5.x
- **包管理器**: npm
- **开发工具**: nodemon, ts-node
- **数据库**: MySQL (本地端口 3307，数据库名 bolgV2)
- **ORM**: Prisma (推荐) 或 TypeORM
- **认证**: JWT + bcrypt
- **代码风格**: 遵循国内主流习惯，适当中文注释，RESTful API 设计

## 目录结构

```
server/
├── .roo/                # Roo Code 后端规则
├── src/                 # 后端源代码
│   ├── controllers/     # 控制器（处理请求逻辑）
│   ├── routes/          # 路由定义
│   ├── middleware/      # 中间件（认证、日志等）
│   ├── services/        # 业务逻辑层
│   ├── models/          # 数据模型（数据库模型）
│   ├── utils/           # 工具函数
│   ├── types/           # TypeScript 类型定义
│   ├── config/          # 配置文件
│   ├── index.ts         # 应用入口
│   └── app.ts           # Express 应用配置
├── prisma/              # Prisma 相关文件 (如果使用 Prisma)
│   ├── schema.prisma    # 数据模型定义
│   └── migrations/      # 数据库迁移
├── dist/                # 编译后的 JavaScript 代码
├── package.json
├── tsconfig.json        # TypeScript 配置
├── .env                 # 环境变量（模板）
└── .env.example         # 环境变量示例
```

## 代码风格

### TypeScript 配置
- 严格模式启用（`strict: true`）
- 目标版本：ES2020
- 模块系统：CommonJS（兼容 Node.js）
- 避免使用 `any` 类型，尽可能提供明确类型
- 使用 `import type` 进行类型导入

### 命名约定
- **文件/目录**: kebab-case（例如 `user-controller.ts`）
- **类**: PascalCase（例如 `UserController`）
- **变量/函数**: camelCase
- **类型/接口**: PascalCase（后缀可加 `Type` 或 `Interface`）
- **常量**: UPPER_SNAKE_CASE
- **私有成员**: 前缀 `_`（例如 `_privateMethod`）

### 导入顺序
1. 第三方库（`express`, `cors` 等）
2. 内部模块（相对路径）
3. 类型导入单独一行（`import type { ... }`）

### 项目结构规范
- **控制器**: 处理 HTTP 请求，调用服务层
- **服务**: 包含业务逻辑，独立于 HTTP 层
- **模型**: 数据模型和数据库操作
- **中间件**: 可重用的请求处理管道
- **工具函数**: 纯函数，无副作用

### 注释规范
- 公共函数/类使用 JSDoc 注释
- 复杂业务逻辑添加行内注释
- TODO 注释需标明负责人/日期（例如：`// TODO: [姓名] 2024-01-01 - 优化数据库查询`）
- API 端点使用 Swagger/OpenAPI 注释

## 开发工作流

### 开发模式
```bash
cd server
npm run dev
```
- 使用 nodemon 监听文件变化
- 自动重启服务器
- 默认端口：3000（可通过环境变量配置）

### 构建
```bash
npm run build
```
- 编译 TypeScript 到 JavaScript
- 输出到 `dist/` 目录
- 保留源映射（source maps）用于调试

### 生产启动
```bash
npm start
```
- 运行编译后的 `dist/index.js`
- 使用生产环境配置

## API 设计

### RESTful 原则
- 资源使用名词复数（例如 `/api/users`）
- HTTP 方法语义化：
  - `GET`: 获取资源
  - `POST`: 创建资源
  - `PUT`: 更新整个资源
  - `PATCH`: 部分更新资源
  - `DELETE`: 删除资源
- 版本控制：API 路径包含版本号（例如 `/api/v1/users`）

### 响应格式
```typescript
{
  "success": true,
  "data": { ... },      // 成功时的数据
  "error": null,        // 成功时为 null
  "message": "操作成功", // 可选的描述信息
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 错误处理
- HTTP 状态码正确反映错误类型
- 统一错误响应格式：
```typescript
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "输入验证失败",
    "details": [ ... ]  // 可选的错误详情
  },
  "message": "请求参数无效",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 数据库

### 数据库选择
- **关系型数据库**: MySQL (本地端口 3307)
- **ORM/ODM**: Prisma (推荐) 或 TypeORM
- **数据库名**: bolgV2

### 数据库操作原则
- 使用连接池管理数据库连接
- 事务处理确保数据一致性
- 避免 N+1 查询问题
- 索引优化查询性能

### 数据模型建议 (博客系统)
1. **User** (用户表)
   - id, username, email, passwordHash, avatar, role, createdAt, updatedAt
2. **Post** (文章表)
   - id, title, content, excerpt, coverImage, authorId, status (draft/published), publishedAt, createdAt, updatedAt
3. **Category** (分类表)
   - id, name, slug, description
4. **Tag** (标签表)
   - id, name, slug
5. **PostCategory** (文章-分类关联)
6. **PostTag** (文章-标签关联)
7. **Comment** (评论表)
   - id, content, authorId, postId, parentId, createdAt

## 安全性

### 认证与授权
- **认证**: JWT（JSON Web Tokens）
- **授权**: 基于角色的访问控制（RBAC）
- 密码哈希：使用 bcrypt 或 Argon2

### 安全最佳实践
- 使用 Helmet.js 设置安全 HTTP 头
- 输入验证和清理（使用 joi 或 zod）
- 速率限制防止暴力攻击
- CORS 配置限制来源

## 测试策略

### 测试工具
- **单元测试**: Jest
- **集成测试**: Supertest（HTTP 测试）

### 测试覆盖
- 控制器：请求/响应测试
- 服务：业务逻辑测试
- 模型：数据库操作测试
- 中间件：功能测试

## 环境变量配置
创建 `.env` 文件，包含以下变量：
```bash
NODE_ENV=development
PORT=3000
DATABASE_URL="mysql://root:@localhost:3307/bolgV2"
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

## 注意事项

1. **错误处理**: 所有异步操作都需要错误处理
2. **资源清理**: 数据库连接、文件句柄需要正确关闭
3. **时区处理**: 使用 UTC 时间存储，按需转换为本地时间
4. **日志记录**: 使用 winston 或 pino 记录请求日志和错误日志

---

**详细规则请参考项目文档和代码示例。**