# Roo Code 规则 - 后端（AI专用）

## 项目概述
- **运行时**: Node.js >= 18.0.0
- **框架**: Express 5.x
- **语言**: TypeScript 5.x
- **包管理器**: npm
- **数据库**: MySQL (本地端口 3307，数据库名 bolgV2)
- **ORM**: Prisma (推荐) 或 TypeORM
- **认证**: JWT + bcrypt
- **代码风格**: 遵循国内主流习惯，适当中文注释，RESTful API 设计

## 目录结构（关键）
```
server/src/controllers/   # 控制器（处理请求逻辑）
server/src/routes/        # 路由定义
server/src/services/      # 业务逻辑层
server/src/models/        # 数据模型
server/src/middleware/    # 中间件（认证、日志等）
server/src/utils/         # 工具函数
server/src/types/         # TypeScript 类型定义
server/src/config/        # 配置文件
server/prisma/            # Prisma 相关文件
server/dist/              # 编译后的 JavaScript 代码
```

## 代码风格
- **TypeScript**: 严格模式启用，目标 ES2020，模块 CommonJS，避免 `any`，使用 `import type`
- **命名约定**:
  - 文件/目录: kebab-case (`user-controller.ts`)
  - 类: PascalCase (`UserController`)
  - 变量/函数: camelCase
  - 类型/接口: PascalCase（可加 `Type`/`Interface` 后缀）
  - 常量: UPPER_SNAKE_CASE
  - 私有成员: 前缀 `_` (`_privateMethod`)
- **导入顺序**: 1) 第三方库 2) 内部模块 3) 类型导入单独一行
- **项目结构**: 控制器 → 服务 → 模型，中间件可重用，工具函数无副作用

## API 设计
- **RESTful**: 资源名词复数 (`/api/users`)，HTTP 方法语义化 (`GET`/`POST`/`PUT`/`PATCH`/`DELETE`)，版本控制 (`/api/v1/users`)
- **响应格式**:
```typescript
{
  "success": boolean,
  "data": any,          // 成功时的数据
  "error": null | { code: string, message: string, details?: any[] },
  "message": string,    // 可选的描述信息
  "timestamp": string   // ISO 8601
}
```
- **错误处理**: HTTP 状态码正确，统一错误响应格式（如上）

## 数据库
- **数据库**: MySQL (本地端口 3307)，数据库名 `bolgV2`
- **ORM**: Prisma (推荐) 或 TypeORM
- **数据模型**（博客系统）:
  - User (用户表)
  - Post (文章表)
  - Category (分类表)
  - Tag (标签表)
  - PostCategory, PostTag (关联表)
  - Comment (评论表)
- **操作原则**: 使用连接池，事务处理，避免 N+1 查询，索引优化

## 安全性
- **认证**: JWT（JSON Web Tokens）
- **授权**: 基于角色的访问控制（RBAC）
- **密码哈希**: bcrypt 或 Argon2
- **安全实践**: Helmet.js 安全头，输入验证（joi/zod），速率限制，CORS 配置限制来源

## 环境变量配置
```bash
NODE_ENV=development
PORT=3000
DATABASE_URL="mysql://root:@localhost:3307/bolgV2"
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

## 注意事项（针对AI）
1. **错误处理**: 所有异步操作都需要错误处理（try-catch 或 Promise.catch）
2. **资源清理**: 数据库连接、文件句柄需要正确关闭
3. **时区处理**: 使用 UTC 时间存储，按需转换为本地时间
4. **日志记录**: 使用 winston 或 pino 记录请求日志和错误日志
5. **代码生成**: 遵循上述规则，保持代码风格一致

---
**本规则专为 AI 助手设计，确保生成的代码符合项目规范。**