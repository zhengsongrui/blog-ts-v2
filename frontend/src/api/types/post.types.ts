/**
 * 文章相关类型定义
 * 根据 OpenAPI 规范生成
 */

import type { User } from './user.types';
import type { PostStatus } from './common.types';
import type { Category } from './category.types';
import type { Tag } from './tag.types';

// ===== 文章实体 =====

/**
 * 文章信息
 */
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featuredImage: string | null;
  status: PostStatus;
  views: number;
  authorId: string;
  author: User | null;
  categories: Category[];
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

// ===== 数据传输对象 =====

/**
 * 创建文章 DTO
 */
export interface CreatePostDto {
  title: string;
  content: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  status?: PostStatus;
  categoryIds: string[];
  tagIds: string[];
}

/**
 * 更新文章 DTO
 */
export interface UpdatePostDto {
  title?: string | null;
  content?: string | null;
  excerpt?: string | null;
  featuredImage?: string | null;
  status?: PostStatus | null;
  categoryIds?: string[] | null;
  tagIds?: string[] | null;
}

// ===== 响应类型 =====

/**
 * 文章响应
 */
export type ApiResponsePost = Post;

/**
 * 分页文章响应
 */
export interface PaginatedResponsePost {
  success: boolean;
  data: Post[];
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
 * 文章列表查询参数
 */
export interface PostQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'views';
  sortOrder?: 'asc' | 'desc';
  status?: PostStatus;
  authorId?: string;
  categoryId?: string;
  tagId?: string;
}

/**
 * 用户文章查询参数
 */
export interface UserPostsQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: PostStatus;
}