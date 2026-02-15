/**
 * API 通用类型定义
 * 根据 OpenAPI 规范生成
 */

// ===== 通用响应格式 =====

/**
 * API 错误信息
 */
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

/**
 * 通用 API 响应格式
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  error: ApiError | null;
  message: string | null;
  timestamp: string;
}

/**
 * 带消息的 API 响应
 */
export interface ApiResponseMessage {
  success: boolean;
  data: {
    message: string;
  };
  error: ApiError | null;
  message: string | null;
  timestamp: string;
}

/**
 * 分页信息
 */
export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationInfo;
  error: ApiError | null;
  message: string | null;
  timestamp: string;
}

// ===== 查询参数类型 =====

/**
 * 分页查询参数
 */
export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

/**
 * 排序查询参数
 */
export interface SortQuery {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 通用查询参数（分页 + 排序）
 */
export interface CommonQueryParams extends PaginationQuery, SortQuery {}

// ===== 枚举类型 =====

/**
 * 用户角色枚举
 */
export enum UserRole {
  USER = 'USER',
  EDITOR = 'EDITOR',
  ADMIN = 'ADMIN',
}

/**
 * 文章状态枚举
 */
export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}