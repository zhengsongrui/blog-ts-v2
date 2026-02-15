/**
 * 用户相关类型定义
 * 根据 OpenAPI 规范生成
 */

import type { UserRole } from './common.types';

// ===== 用户实体 =====

/**
 * 用户信息
 */
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

// ===== 数据传输对象 =====

/**
 * 创建用户 DTO
 */
export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  avatar?: string | null;
  bio?: string | null;
}

/**
 * 更新用户 DTO
 */
export interface UpdateUserDto {
  username?: string | null;
  email?: string | null;
  password?: string | null;
  avatar?: string | null;
  bio?: string | null;
  role?: UserRole | null;
}

/**
 * 登录 DTO
 */
export interface LoginDto {
  email: string;
  password: string;
}

// ===== 响应类型 =====

/**
 * 认证响应
 */
export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number;
}

/**
 * 用户响应
 */
export type ApiResponseUser = User;

/**
 * 分页用户响应
 */
export interface PaginatedResponseUser {
  success: boolean;
  data: User[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  error: any | null;
  message: string | null;
  timestamp: string;
}

// ===== 查询参数 =====

/**
 * 用户列表查询参数
 */
export interface UserQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'username' | 'email';
  sortOrder?: 'asc' | 'desc';
}