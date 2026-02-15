/**
 * 系统相关类型定义
 * 根据 OpenAPI 规范生成
 */

// ===== 健康检查响应 =====

/**
 * 健康检查响应
 */
export interface HealthResponse {
  success: boolean;
  data: {
    status: string;
    timestamp: string;
    database: boolean;
  };
  error: any | null;
  message: string | null;
  timestamp: string;
}

/**
 * 欢迎页面响应
 */
export interface WelcomeResponse {
  success: boolean;
  data: {
    message: string;
  };
  error: any | null;
  message: string | null;
  timestamp: string;
}