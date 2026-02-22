/**
 * 认证状态管理
 * 使用 Zustand 管理用户登录状态、token 等
 */

import { create } from 'zustand';
import type { User } from '@/api/types';
import { STORAGE_KEYS } from '@/config/constants';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  (set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: (user, token) => {
      // 存储到 localStorage
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, JSON.stringify(token));
      set({ user, token, isAuthenticated: true, error: null });
    },

    logout: () => {
      // 清除状态和持久化存储
      localStorage.removeItem(STORAGE_KEYS.USER_INFO);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      set({ user: null, token: null, isAuthenticated: false, error: null });
    },

    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
  })
);

/**
 * 从 localStorage 中提取 token
 */
const extractTokenFromStorage = (): string | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (!stored) return null;
  
  try {
    const parsed = JSON.parse(stored);
    // 如果是字符串格式，直接返回
    if (typeof parsed === 'string') {
      return parsed;
    }
    // 如果是其他格式的对象，返回 null
    return null;
  } catch {
    // 解析失败，说明 stored 是纯字符串 token
    return stored;
  }
};

/**
 * 从 localStorage 中提取用户信息
 */
const extractUserFromStorage = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_INFO);
  if (!stored) return null;
  
  try {
    const parsed = JSON.parse(stored);
    // 如果解析成功且包含用户信息，返回用户对象
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
    return null;
  } catch {
    // 解析失败，返回 null
    return null;
  }
};

/**
 * 检查本地是否存在认证信息（用于初始化）
 */
export const checkLocalAuth = (): boolean => {
  const token = extractTokenFromStorage();
  return !!token;
};

// 初始化时恢复认证状态
const storedToken = extractTokenFromStorage();
const storedUser = extractUserFromStorage();

if (storedToken && storedUser) {
  // 如果有本地存储的认证信息，更新 store 状态
  useAuthStore.getState().login(storedUser, storedToken);
}