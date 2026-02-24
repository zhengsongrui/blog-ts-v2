/**
 * 用户相关 API 端点定义
 * 根据 OpenAPI 规范生成
 */

import { apiClient } from '../client';
import type {
  CreateUserDto,
  UpdateUserDto,
  LoginDto,
  AuthResponse,
  ApiResponseUser,
  PaginatedResponseUser,
  UserQueryParams,
  ApiResponse,
} from '../types';

/**
 * 用户 API 端点
 */
export const userApi = {
  /**
   * 用户注册
   * @param data 注册数据
   * @returns 注册结果
   */
  register: (data: CreateUserDto) =>
    apiClient.post<ApiResponseUser>('/users/register', data, { skipAuth: true }),

  /**
   * 用户登录
   * @param data 登录数据
   * @returns 认证响应
   */
  login: (data: LoginDto) =>
    apiClient.post<AuthResponse>('/users/login', data, { skipAuth: true }),

  /**
   * 获取当前用户信息
   * @returns 当前用户信息
   */
  getCurrentUser: () =>
    apiClient.get<ApiResponseUser>('/users/me'),

  /**
   * 更新当前用户信息
   * @param data 更新数据
   * @returns 更新后的用户信息
   */
  updateCurrentUser: (data: UpdateUserDto) =>
    apiClient.patch<ApiResponseUser>('/users/me', data),

  /**
   * 获取用户列表（分页）
   * @param params 查询参数
   * @returns 分页用户列表
   */
  getUsers: (params?: UserQueryParams) =>
    apiClient.get<PaginatedResponseUser>('/users', { params }),

  /**
   * 获取作者列表（公开）
   * @returns 作者列表（仅包含ID和用户名）
   */
  getAuthors: () =>
    apiClient.get<Array<{ id: string; username: string }>>('/users/authors', { skipAuth: true }),

  /**
   * 根据ID获取用户信息
   * @param id 用户ID
   * @returns 用户信息
   */
  getUserById: (id: string) =>
    apiClient.get<ApiResponseUser>(`/users/${id}`),

  /**
   * 更新用户信息（管理员）
   * @param id 用户ID
   * @param data 更新数据
   * @returns 更新后的用户信息
   */
  updateUser: (id: string, data: UpdateUserDto) =>
    apiClient.patch<ApiResponseUser>(`/users/${id}`, data),

  /**
   * 删除用户
   * @param id 用户ID
   * @returns 删除结果
   */
  deleteUser: (id: string) =>
    apiClient.delete<{ message: string }>(`/users/${id}`),
};