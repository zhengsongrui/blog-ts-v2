# BlogV2 后端 API 文档

本文档提供了 BlogV2 后端 API 的完整接口规范，采用 OpenAPI 3.0 格式。此文档可用于：
- 前端开发人员理解 API 接口
- AI 代码生成工具自动生成客户端代码
- API 测试和调试
- 团队协作和接口约定

## 文档文件

- `openapi.yaml` - OpenAPI 3.0 规范文件（主要文档）
- `README.md` - 本说明文件

## API 概览

BlogV2 后端是一个基于 Express.js 和 TypeScript 构建的现代化博客系统，提供以下核心功能：

### 用户管理
- 用户注册和登录
- JWT 令牌认证
- 基于角色的权限控制（用户、编辑、管理员）
- 用户信息管理

### 文章管理
- 文章的创建、读取、更新、删除（CRUD）
- 文章分类和标签系统
- 分页、筛选和排序
- 草稿、发布、归档状态管理

### 系统功能
- 健康检查
- 数据库连接监控
- 错误处理中间件

## API 基础信息

- **基础 URL**: `http://localhost:3000/api/v1` (开发环境)
- **认证方式**: Bearer Token (JWT)
- **响应格式**: JSON
- **API 版本**: v1

## 如何使用 OpenAPI 文档

### 1. 查看文档

你可以使用以下工具查看和测试 API：

#### Swagger UI
将 `openapi.yaml` 导入到 [Swagger Editor](https://editor.swagger.io/) 或本地运行的 Swagger UI 中。

#### Postman
1. 打开 Postman
2. 选择 "Import" → "File"
3. 选择 `openapi.yaml` 文件
4. Postman 会自动创建所有 API 端点的集合

#### Visual Studio Code 扩展
安装以下扩展之一：
- **OpenAPI (Swagger) Editor** - 提供语法高亮和验证
- **Swagger Viewer** - 在 VS Code 中预览文档

### 2. 生成客户端代码

使用 OpenAPI 生成器为各种语言生成客户端代码：

```bash
# 安装 OpenAPI Generator
npm install @openapitools/openapi-generator-cli -g

# 生成 TypeScript 客户端代码
openapi-generator-cli generate -i docs/openapi.yaml -g typescript-axios -o client-api/

# 生成 Python 客户端代码
openapi-generator-cli generate -i docs/openapi.yaml -g python -o client-api-python/

# 生成 JavaScript 客户端代码
openapi-generator-cli generate -i docs/openapi.yaml -g javascript -o client-api-js/
```

### 3. 用于 AI 代码生成

当使用 AI 助手（如 GitHub Copilot、ChatGPT 等）生成前端代码时，可以提供以下提示：

```
请使用以下 OpenAPI 规范为 BlogV2 后端生成 React 组件：
- API 规范位于 server/docs/openapi.yaml
- 使用 Axios 进行 HTTP 请求
- 实现用户登录、注册和文章列表功能
- 包含 JWT 令牌管理
```

## 主要 API 端点

### 用户相关

| 方法 | 端点 | 描述 | 权限 |
|------|------|------|------|
| POST | `/users/register` | 用户注册 | 公开 |
| POST | `/users/login` | 用户登录 | 公开 |
| GET | `/users/me` | 获取当前用户 | 认证用户 |
| PATCH | `/users/me` | 更新当前用户 | 认证用户 |
| GET | `/users` | 获取用户列表 | 管理员 |
| GET | `/users/{id}` | 根据ID获取用户 | 管理员或本人 |
| PATCH | `/users/{id}` | 更新用户 | 管理员 |
| DELETE | `/users/{id}` | 删除用户 | 管理员 |

### 文章相关

| 方法 | 端点 | 描述 | 权限 |
|------|------|------|------|
| GET | `/posts` | 获取文章列表 | 公开/可选认证 |
| POST | `/posts` | 创建文章 | 编辑/管理员 |
| GET | `/posts/{id}` | 根据ID获取文章 | 公开/可选认证 |
| PATCH | `/posts/{id}` | 更新文章 | 作者/编辑/管理员 |
| DELETE | `/posts/{id}` | 删除文章 | 作者/管理员 |
| GET | `/posts/slug/{slug}` | 根据slug获取文章 | 公开/可选认证 |
| GET | `/posts/users/{userId}/posts` | 获取用户文章列表 | 公开/可选认证 |

### 系统相关

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/health` | 健康检查 |
| GET | `/` | 欢迎页面 |

## 认证和授权

### JWT 认证
1. 用户通过 `/users/login` 接口登录，获取 JWT 令牌
2. 在后续请求的 `Authorization` 头中携带令牌：
   ```
   Authorization: Bearer <your-jwt-token>
   ```
3. 令牌在配置的过期时间后失效（默认7天）

### 角色权限
- **USER**: 普通用户，可以管理自己的资料和文章
- **EDITOR**: 编辑，可以创建和管理所有文章
- **ADMIN**: 管理员，可以管理所有用户和系统设置

## 请求/响应格式

### 成功响应示例
```json
{
  "success": true,
  "data": {
    "id": "123",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "USER"
  },
  "error": null,
  "message": "用户注册成功",
  "timestamp": "2026-02-15T09:20:00.000Z"
}
```

### 错误响应示例
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "邮箱格式不正确"
  },
  "message": "请求参数验证失败",
  "timestamp": "2026-02-15T09:20:00.000Z"
}
```

## 常见错误代码

| 错误代码 | HTTP 状态码 | 描述 |
|----------|-------------|------|
| VALIDATION_ERROR | 400 | 请求参数验证失败 |
| UNAUTHORIZED | 401 | 未提供有效令牌 |
| FORBIDDEN | 403 | 权限不足 |
| NOT_FOUND | 404 | 资源不存在 |
| CONFLICT | 409 | 资源冲突（如邮箱已注册） |
| INTERNAL_ERROR | 500 | 服务器内部错误 |

## 开发指南

### 1. 运行开发服务器
```bash
cd server
npm run dev
```

### 2. 测试 API
```bash
# 使用 curl 测试健康检查
curl http://localhost:3000/api/v1/health

# 使用 curl 测试用户注册
curl -X POST http://localhost:3000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

### 3. 数据库迁移
```bash
# 生成 Prisma 客户端
npm run prisma:generate

# 运行数据库迁移
npm run prisma:migrate

# 打开 Prisma Studio 查看数据
npm run prisma:studio
```

## 自动生成文档

现在项目包含了一个自动生成 OpenAPI 文档的工具，可以从 Express 路由文件自动生成 `openapi.yaml` 文件。

### 工具特点
- **自动解析路由**：从 `server/src/routes/` 目录读取所有 Express 路由文件
- **智能推断信息**：从 JSDoc 注释、HTTP 方法、路径参数和认证中间件中提取信息
- **完整的 OpenAPI 3.0 规范**：生成符合规范的文档，包含标签、路径、操作、参数和安全方案
- **验证功能**：生成后自动验证文档格式和完整性

### 使用方法

```bash
# 进入 server 目录
cd server

# 生成 OpenAPI 文档
npm run generate:openapi

# 或者使用快捷命令
npm run docs:generate

# 验证生成的文档
npm run docs:validate

# 启动文档预览服务器（需要安装 @redocly/cli）
npm run docs:serve
```

### 生成流程
1. 扫描 `server/src/routes/` 目录下的所有 `.ts` 路由文件
2. 解析每个路由定义，提取路径、HTTP 方法、认证要求和 JSDoc 注释
3. 根据路由信息生成 OpenAPI 规范
4. 将规范写入 `server/docs/openapi.yaml`
5. 验证生成的文档格式正确性

### 为 AI 生成代码优化
生成的文档特别适合 AI 代码生成工具使用，因为：
- 包含详细的端点描述和参数说明
- 提供完整的安全方案信息
- 支持生成 TypeScript 客户端代码
- 可以直接提供给 ChatGPT、GitHub Copilot 等 AI 助手生成前端代码

## 更新文档

现在你可以选择两种方式更新 OpenAPI 文档：

### 方式一：自动生成（推荐）
当路由有变更时，只需运行生成命令：
```bash
cd server
npm run generate:openapi
```

### 方式二：手动编辑
如果自动生成不能满足特殊需求，可以手动编辑文档：

1. 修改 `server/docs/openapi.yaml` 文件
2. 确保所有新的端点、参数和响应模式都被正确记录
3. 更新版本号（如果需要）
4. 运行验证命令确保文档格式正确：
   ```bash
   npm run docs:validate
   ```

## 相关资源

- [OpenAPI 规范](https://swagger.io/specification/)
- [Swagger Editor](https://editor.swagger.io/)
- [Postman API 文档](https://learning.postman.com/docs/designing-and-developing-your-api/documenting-your-api/)
- [Prisma 文档](https://www.prisma.io/docs)

---

*最后更新: 2026-02-15*
*文档版本: 1.0.0*