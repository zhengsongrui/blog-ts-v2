# 前端 API 层

基于 OpenAPI 规范生成的 TypeScript API 客户端，提供类型安全的 HTTP 请求封装。

## 目录结构

```
src/api/
├── client.ts              # Axios 实例和请求拦截器
├── endpoints/             # API 端点定义
│   ├── user.api.ts       # 用户相关接口
│   ├── post.api.ts       # 文章相关接口
│   ├── system.api.ts     # 系统相关接口
│   └── index.ts          # 统一导出
└── types/                 # TypeScript 类型定义
    ├── common.types.ts   # 通用类型
    ├── user.types.ts     # 用户相关类型
    ├── post.types.ts     # 文章相关类型
    ├── system.types.ts   # 系统相关类型
    └── index.ts          # 统一导出
```

## 使用方式

### 1. 导入 API 端点

```typescript
import { userApi, postApi, systemApi } from '@/api/endpoints';
```

### 2. 使用 API 调用

```typescript
// 用户登录
const handleLogin = async () => {
  try {
    const response = await userApi.login({
      email: 'user@example.com',
      password: 'password123',
    });
    console.log('登录成功:', response);
  } catch (error) {
    console.error('登录失败:', error);
  }
};

// 获取文章列表
const fetchPosts = async () => {
  try {
    const response = await postApi.getPosts({
      page: 1,
      pageSize: 10,
      status: 'PUBLISHED',
    });
    console.log('文章列表:', response.data);
    console.log('分页信息:', response.pagination);
  } catch (error) {
    console.error('获取文章失败:', error);
  }
};

// 健康检查
const checkHealth = async () => {
  try {
    const health = await systemApi.healthCheck();
    console.log('系统状态:', health.data.status);
  } catch (error) {
    console.error('健康检查失败:', error);
  }
};
```

### 3. 在 React 组件中使用

```typescript
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
      <p>角色: {user.role}</p>
    </div>
  );
}
```

## 类型定义

### 通用类型

```typescript
import type {
  ApiResponse,      // 通用 API 响应
  ApiError,         // API 错误
  PaginationInfo,   // 分页信息
  PaginatedResponse, // 分页响应
} from '@/api/types';

import { UserRole, PostStatus } from '@/api/types'; // 枚举
```

### 用户相关类型

```typescript
import type {
  User,           // 用户信息
  CreateUserDto,  // 创建用户 DTO
  UpdateUserDto,  // 更新用户 DTO
  LoginDto,       // 登录 DTO
  AuthResponse,   // 认证响应
} from '@/api/types';
```

### 文章相关类型

```typescript
import type {
  Post,           // 文章信息
  CreatePostDto,  // 创建文章 DTO
  UpdatePostDto,  // 更新文章 DTO
  Category,       // 分类
  Tag,            // 标签
} from '@/api/types';
```

## 错误处理

API 客户端内置了错误处理机制：

1. **HTTP 错误**：自动处理 401、403、404、500 等状态码
2. **业务错误**：根据 `success: false` 的响应进行错误处理
3. **网络错误**：处理网络连接失败的情况

错误会自动显示为 antd 的 message 提示，特殊错误（如 401 未授权）会自动跳转到登录页。

## 认证

API 客户端会自动处理 JWT 认证：

1. 从 localStorage 获取 token
2. 自动添加到请求头的 `Authorization` 字段
3. 401 错误时自动清除 token 并跳转到登录页

如需跳过认证（如登录、注册接口），可在配置中添加 `skipAuth: true`：

```typescript
userApi.login(data, { skipAuth: true });
```

## 配置选项

每个 API 方法都支持 AxiosRequestConfig 配置：

```typescript
// 自定义配置
await userApi.getUsers({
  params: { page: 1, pageSize: 20 },
  skipAuth: false,      // 是否跳过认证（默认 false）
  skipErrorToast: true, // 是否跳过错误提示
  timeout: 10000,       // 自定义超时时间
});
```

## 基于 OpenAPI 规范

所有 API 定义和类型都基于 `server/docs/openapi.yaml` 规范生成，确保前后端类型一致性。

当后端 API 有变更时，需要：
1. 更新 OpenAPI 规范
2. 重新生成或手动更新对应的类型定义和 API 端点

## 最佳实践

1. **类型安全**：始终使用 TypeScript 类型，避免使用 `any`
2. **错误处理**：使用 try-catch 包装 API 调用
3. **加载状态**：管理 loading 状态以提供更好的用户体验
4. **数据缓存**：考虑使用 Zustand store 缓存 API 响应数据
5. **请求取消**：在组件卸载时取消未完成的请求