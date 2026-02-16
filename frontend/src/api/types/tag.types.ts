/**
 * 标签相关类型定义
 * 根据 OpenAPI 规范生成
 */

// ===== 标签实体 =====

/**
 * 标签信息
 */
export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// ===== 数据传输对象 =====

/**
 * 创建标签 DTO
 */
export interface CreateTagDto {
  name: string;
  slug?: string | null;
}

/**
 * 更新标签 DTO
 */
export interface UpdateTagDto {
  name?: string | null;
  slug?: string | null;
}

// ===== 响应类型 =====

/**
 * 标签响应
 */
export type ApiResponseTag = Tag;

/**
 * 分页标签响应
 */
export interface PaginatedResponseTag {
  success: boolean;
  data: Tag[];
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
 * 标签统计信息
 */
export interface TagStats {
  postCount: number;
  totalViews: number;
  lastPostDate: string | null;
}

/**
 * 标签统计响应
 */
export interface ApiResponseTagStats {
  success: boolean;
  data: TagStats;
  error: any | null;
  message: string | null;
  timestamp: string;
}

// ===== 查询参数 =====

/**
 * 标签列表查询参数
 */
export interface TagQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

/**
 * 批量创建标签 DTO
 */
export interface BatchCreateTagDto {
  tags: CreateTagDto[];
}

/**
 * 文章标签查询参数
 */
export interface PostTagsQueryParams {
  postId: string;
}