/**
 * 分类相关类型定义
 * 根据 OpenAPI 规范生成
 */

// ===== 分类实体 =====

/**
 * 分类信息
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

// ===== 数据传输对象 =====

/**
 * 创建分类 DTO
 */
export interface CreateCategoryDto {
  name: string;
  slug?: string | null;
  description?: string | null;
}

/**
 * 更新分类 DTO
 */
export interface UpdateCategoryDto {
  name?: string | null;
  slug?: string | null;
  description?: string | null;
}

// ===== 响应类型 =====

/**
 * 分类响应
 */
export type ApiResponseCategory = Category;

/**
 * 分页分类响应
 */
export interface PaginatedResponseCategory {
  success: boolean;
  data: Category[];
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

/**
 * 分类统计信息
 */
export interface CategoryStats {
  postCount: number;
  totalViews: number;
  lastPostDate: string | null;
}

/**
 * 分类统计响应
 */
export interface ApiResponseCategoryStats {
  success: boolean;
  data: CategoryStats;
  error: any | null;
  message: string | null;
  timestamp: string;
}

// ===== 查询参数 =====

/**
 * 分类列表查询参数
 */
export interface CategoryQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

/**
 * 批量创建分类 DTO
 */
export interface BatchCreateCategoryDto {
  categories: CreateCategoryDto[];
}