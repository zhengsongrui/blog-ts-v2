/**
 * 分类相关 API 端点定义
 * 根据 OpenAPI 规范生成
 */

import { apiClient } from '../client';
import type {
  CreateCategoryDto,
  UpdateCategoryDto,
  ApiResponseCategory,
  PaginatedResponseCategory,
  CategoryQueryParams,
  ApiResponseCategoryStats,
  BatchCreateCategoryDto,
} from '../types';

/**
 * 分类 API 端点
 */
export const categoryApi = {
  /**
   * 获取分类列表（分页）
   * @param params 查询参数
   * @returns 分页分类列表
   */
  getCategories: (params?: CategoryQueryParams) =>
    apiClient.get<PaginatedResponseCategory>('/categories', { 
      params,
      skipAuth: true 
    }),

  /**
   * 创建分类
   * @param data 分类数据
   * @returns 创建的分类
   */
  createCategory: (data: CreateCategoryDto) =>
    apiClient.post<ApiResponseCategory>('/categories', data),

  /**
   * 获取所有分类（不分页）
   * @returns 所有分类列表
   */
  getAllCategories: () =>
    apiClient.get<ApiResponseCategory[]>('/categories/all', { skipAuth: true }),

  /**
   * 根据ID获取分类
   * @param id 分类ID
   * @returns 分类详情
   */
  getCategoryById: (id: string) =>
    apiClient.get<ApiResponseCategory>(`/categories/${id}`, { skipAuth: true }),

  /**
   * 更新分类
   * @param id 分类ID
   * @param data 更新数据
   * @returns 更新后的分类
   */
  updateCategory: (id: string, data: UpdateCategoryDto) =>
    apiClient.patch<ApiResponseCategory>(`/categories/${id}`, data),

  /**
   * 删除分类
   * @param id 分类ID
   * @returns 删除结果
   */
  deleteCategory: (id: string) =>
    apiClient.delete<{ message: string }>(`/categories/${id}`),

  /**
   * 根据slug获取分类
   * @param slug 分类slug
   * @returns 分类详情
   */
  getCategoryBySlug: (slug: string) =>
    apiClient.get<ApiResponseCategory>(`/categories/slug/${slug}`, { skipAuth: true }),

  /**
   * 获取分类统计信息
   * @param id 分类ID
   * @returns 分类统计信息
   */
  getCategoryStats: (id: string) =>
    apiClient.get<ApiResponseCategoryStats>(`/categories/${id}/stats`, { skipAuth: true }),

  /**
   * 批量创建分类
   * @param data 批量创建数据
   * @returns 创建的分类列表
   */
  batchCreateCategories: (data: BatchCreateCategoryDto) =>
    apiClient.post<ApiResponseCategory[]>('/categories/batch', data),
};