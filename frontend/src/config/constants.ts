// 应用常量定义

export const APP_NAME = '个人博客';
export const APP_VERSION = '1.0.0';
export const COPYRIGHT = `© ${new Date().getFullYear()} 个人博客. 保留所有权利。`;

// API 配置
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
export const API_TIMEOUT = 30000; // 30秒

// 存储键名
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_INFO: 'user_info',
  THEME_MODE: 'theme_mode',
  LANGUAGE: 'language',
} as const;

// 分页配置
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: ['10', '20', '50', '100'],
  DEFAULT_PAGE: 1,
} as const;

// 路由路径
export const ROUTE_PATHS = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  POSTS: '/posts',
  POST_DETAIL: '/posts/:id',
  POST_EDIT: '/posts/edit/:id',
  POST_CREATE: '/posts/create',
  USER_PROFILE: '/profile',
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_POSTS: '/admin/posts',
  NOT_FOUND: '/404',
} as const;

// 文章状态
export const POST_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const;

export const POST_STATUS_LABEL: Record<string, string> = {
  [POST_STATUS.DRAFT]: '草稿',
  [POST_STATUS.PUBLISHED]: '已发布',
  [POST_STATUS.ARCHIVED]: '已归档',
};

// 用户角色
export const USER_ROLES = {
  USER: 'USER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
} as const;

export const USER_ROLE_LABEL: Record<string, string> = {
  [USER_ROLES.USER]: '普通用户',
  [USER_ROLES.EDITOR]: '编辑',
  [USER_ROLES.ADMIN]: '管理员',
};

// 主题模式
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// 正则表达式
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,20}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
} as const;

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  SERVER_ERROR: '服务器内部错误，请稍后重试',
  UNAUTHORIZED: '未授权，请重新登录',
  FORBIDDEN: '权限不足，无法访问该资源',
  NOT_FOUND: '请求的资源不存在',
  VALIDATION_ERROR: '输入数据验证失败',
  UNKNOWN_ERROR: '未知错误，请联系管理员',
} as const;