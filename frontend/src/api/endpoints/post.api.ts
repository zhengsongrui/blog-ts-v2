/**
 * 文章相关 API 端点定义
 * 根据 OpenAPI 规范生成
 */

import { apiClient } from '../client';
import type {
  CreatePostDto,
  UpdatePostDto,
  ApiResponsePost,
  PaginatedResponsePost,
  PostQueryParams,
  UserPostsQueryParams,
} from '../types';

/**
 * 文章 API 端点
 */
export const postApi = {
  /**
   * 获取文章列表（分页）
   * @param params 查询参数
   * @returns 分页文章列表
   */
  getPosts: (params?: PostQueryParams) =>
    apiClient.get<PaginatedResponsePost>('/posts', { params, skipAuth: true }),

  /**
   * 创建文章
   * @param data 文章数据
   * @returns 创建的文章
   */
  createPost: (data: CreatePostDto) =>
    apiClient.post<ApiResponsePost>('/posts', data),

  /**
   * 根据ID获取文章
   * @param id 文章ID
   * @returns 文章详情
   */
  getPostById: (id: string) =>
    apiClient.get<ApiResponsePost>(`/posts/${id}`, { skipAuth: true }),

  /**
   * 更新文章
   * @param id 文章ID
   * @param data 更新数据
   * @returns 更新后的文章
   */
  updatePost: (id: string, data: UpdatePostDto) =>
    apiClient.patch<ApiResponsePost>(`/posts/${id}`, data),

  /**
   * 删除文章
   * @param id 文章ID
   * @returns 删除结果
   */
  deletePost: (id: string) =>
    apiClient.delete<{ message: string }>(`/posts/${id}`),

  /**
   * 根据slug获取文章
   * @param slug 文章slug
   * @returns 文章详情
   */
  getPostBySlug: (slug: string) =>
    apiClient.get<ApiResponsePost>(`/posts/slug/${slug}`, { skipAuth: true }),

  /**
   * 获取用户的文章列表
   * @param userId 用户ID
   * @param params 查询参数
   * @returns 用户的文章列表
   */
  getUserPosts: (userId: string, params?: UserPostsQueryParams) =>
    apiClient.get<PaginatedResponsePost>(`/posts/users/${userId}/posts`, { 
      params,
      skipAuth: true 
    }),
};