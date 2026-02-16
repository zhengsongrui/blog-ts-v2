/**
 * 标签相关 API 端点定义
 * 根据 OpenAPI 规范生成
 */

import { apiClient } from '../client';
import type {
  CreateTagDto,
  UpdateTagDto,
  ApiResponseTag,
  PaginatedResponseTag,
  TagQueryParams,
  ApiResponseTagStats,
  BatchCreateTagDto,
} from '../types';

/**
 * 标签 API 端点
 */
export const tagApi = {
  /**
   * 获取标签列表（分页）
   * @param params 查询参数
   * @returns 分页标签列表
   */
  getTags: (params?: TagQueryParams) =>
    apiClient.get<PaginatedResponseTag>('/tags', { 
      params,
      skipAuth: true 
    }),

  /**
   * 创建标签
   * @param data 标签数据
   * @returns 创建的标签
   */
  createTag: (data: CreateTagDto) =>
    apiClient.post<ApiResponseTag>('/tags', data),

  /**
   * 获取所有标签（不分页）
   * @returns 所有标签列表
   */
  getAllTags: () =>
    apiClient.get<ApiResponseTag[]>('/tags/all', { skipAuth: true }),

  /**
   * 根据ID获取标签
   * @param id 标签ID
   * @returns 标签详情
   */
  getTagById: (id: string) =>
    apiClient.get<ApiResponseTag>(`/tags/${id}`, { skipAuth: true }),

  /**
   * 更新标签
   * @param id 标签ID
   * @param data 更新数据
   * @returns 更新后的标签
   */
  updateTag: (id: string, data: UpdateTagDto) =>
    apiClient.patch<ApiResponseTag>(`/tags/${id}`, data),

  /**
   * 删除标签
   * @param id 标签ID
   * @returns 删除结果
   */
  deleteTag: (id: string) =>
    apiClient.delete<{ message: string }>(`/tags/${id}`),

  /**
   * 根据slug获取标签
   * @param slug 标签slug
   * @returns 标签详情
   */
  getTagBySlug: (slug: string) =>
    apiClient.get<ApiResponseTag>(`/tags/slug/${slug}`, { skipAuth: true }),

  /**
   * 获取标签统计信息
   * @param id 标签ID
   * @returns 标签统计信息
   */
  getTagStats: (id: string) =>
    apiClient.get<ApiResponseTagStats>(`/tags/${id}/stats`, { skipAuth: true }),

  /**
   * 获取文章的所有标签
   * @param postId 文章ID
   * @returns 文章标签列表
   */
  getPostTags: (postId: string) =>
    apiClient.get<ApiResponseTag[]>(`/tags/posts/${postId}`, { skipAuth: true }),

  /**
   * 批量创建标签
   * @param data 批量创建数据
   * @returns 创建的标签列表
   */
  batchCreateTags: (data: BatchCreateTagDto) =>
    apiClient.post<ApiResponseTag[]>('/tags/batch', data),
};