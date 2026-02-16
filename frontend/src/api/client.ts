import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { message, Modal } from 'antd';
import { API_BASE_URL, API_TIMEOUT, STORAGE_KEYS, ERROR_MESSAGES } from '@/config/constants';

// 导入 API 类型定义
import type { ApiResponse, ApiError } from './types';

// 扩展 AxiosRequestConfig，添加自定义配置
declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuth?: boolean; // 跳过身份验证
    skipErrorToast?: boolean; // 跳过错误提示
    skipLoading?: boolean; // 跳过加载状态
  }
}

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 添加认证 token
        if (!config.skipAuth) {
          const token = this.getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        // 添加请求时间戳（防止缓存）
        if (config.method?.toLowerCase() === 'get') {
          config.params = {
            ...config.params,
            _t: Date.now(),
          };
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
      this.instance.interceptors.response.use(
        (response: AxiosResponse) => {
          const { data } = response;
          
          // 处理业务逻辑错误
          if (data.success === false) {
            this.handleError(data.error || { code: 'UNKNOWN_ERROR', message: '未知错误' });
            return Promise.reject(data.error);
          }
  
          // 对于分页响应（包含 pagination 字段），返回完整数据
          // 否则返回 data.data（标准 ApiResponse 格式）
          if (data && typeof data === 'object' && 'pagination' in data) {
            // 分页响应已经是完整结构，直接返回
            return response;
          }
  
          // 标准 ApiResponse 格式，提取 data 字段
          return {
            ...response,
            data: data.data,
          };
        },
        (error) => {
          // 处理 HTTP 错误'
          this.handleHttpError(error);
          return Promise.reject(error);
        }
      );
  }

  private getToken(): string | null {
    const stored = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!stored) return null;
    
    try {
      const parsed = JSON.parse(stored);
      // 如果是 persist 对象格式 {state: {token: "...", user: {...}}, version: 0}
      if (parsed && typeof parsed === 'object' && parsed.state && parsed.state.token) {
        return parsed.state.token;
      }
      // 如果是旧格式的纯字符串 token
      if (typeof parsed === 'string') {
        return parsed;
      }
      // 如果 parsed 是其他对象，尝试直接作为 token（向后兼容）
      if (parsed && parsed.token) {
        return parsed.token;
      }
    } catch {
      // 解析失败，说明 stored 是纯字符串 token
      return stored;
    }
    
    // 默认返回 null
    return null;
  }

  private handleError(error: ApiError) {
  if (!error) return;

  const { code, message: errorMessage } = error;
  
  // 根据错误代码进行特殊处理
  switch (code) {
    case 'UNAUTHORIZED':
      // 1. 检查当前是否已经在登录页
      const isAtLoginPage = window.location.pathname === '/login';

      if (isAtLoginPage) {
        // 如果在登录页报 401，说明是用户名或密码错误
        // 只弹出提示，不清除 token 也不重定向，防止死循环闪烁
        console.log(errorMessage,isAtLoginPage)
      } else {
        // 如果在其他页面报 401，说明 token 过期或未登录
        // 弹出提示框，点击确定后跳转到登录页
        Modal.error({
          title: '会话已过期',
          content: '您的登录状态已失效，请重新登录',
          okText: '确定',
          cancelButtonProps: { style: { display: 'none' } },
          onOk: () => {
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER_INFO);
            // 使用 replace 防止用户点后退键回到被拦截的页面
            window.location.replace('/login');
          },
        });
      }
      break;

    case 'FORBIDDEN':
      message.error('权限不足，无法执行此操作');
      break;

    default:
      if (errorMessage) {
        message.error(errorMessage);
      }
  }
}

  private handleHttpError(error: any) {
    if (!error.response) {
      message.error(ERROR_MESSAGES.NETWORK_ERROR);
      return;
    }

    const { status, data } = error.response;

    switch (status) {
      case 401:
        this.handleError({ code: 'UNAUTHORIZED', message: ERROR_MESSAGES.UNAUTHORIZED });
        break;
      case 403:
        this.handleError({ code: 'FORBIDDEN', message: ERROR_MESSAGES.FORBIDDEN });
        break;
      case 404:
        message.error(ERROR_MESSAGES.NOT_FOUND);
        break;
      case 500:
        message.error(ERROR_MESSAGES.SERVER_ERROR);
        break;
      default:
        if (data?.error?.message) {
          message.error(data.error.message);
        } else {
          message.error(ERROR_MESSAGES.UNKNOWN_ERROR);
        }
    }
  }

  // HTTP 方法封装
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get<ApiResponse<T>>(url, config).then(res => res.data as T);
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post<ApiResponse<T>>(url, data, config).then(res => res.data as T);
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put<ApiResponse<T>>(url, data, config).then(res => res.data as T);
  }

  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.instance.patch<ApiResponse<T>>(url, data, config);
    return res.data as T;
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete<ApiResponse<T>>(url, config).then(res => res.data as T);
  }

  // 文件上传
  public async upload<T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    return this.instance.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    }).then(res => res.data as T);
  }
}

// 导出单例实例
export const apiClient = new ApiClient();

// 导出原始 axios 实例用于特殊情况
export const axiosInstance = axios.create();