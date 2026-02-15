/**
 * 系统相关 API 端点定义
 * 根据 OpenAPI 规范生成
 */

import { apiClient } from '../client';
import type {
  HealthResponse,
  WelcomeResponse,
} from '../types';

/**
 * 系统 API 端点
 */
export const systemApi = {
  /**
   * 健康检查
   * @returns 健康状态
   */
  healthCheck: () =>
    apiClient.get<HealthResponse>('/health', { skipAuth: true }),

  /**
   * 欢迎页面
   * @returns 欢迎信息
   */
  getWelcome: () =>
    apiClient.get<WelcomeResponse>('/', { skipAuth: true }),
};