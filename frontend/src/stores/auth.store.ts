/**
 * 认证状态管理
 * 使用 Zustand 管理用户登录状态、token 等
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
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
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        login: (user, token) => {
          // 存储到 localStorage（由 persist 中间件自动处理）
          set({ user, token, isAuthenticated: true, error: null });
        },

        logout: () => {
          // 清除状态
          set({ user: null, token: null, isAuthenticated: false, error: null });
          // 注意：persist 中间件会自动清除持久化存储，因为我们设置了 name
        },

        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),
      }),
      {
        name: STORAGE_KEYS.AUTH_TOKEN, // 存储键名
        // 仅持久化 token 和 user，其他状态不持久化
        partialize: (state) => ({
          token: state.token,
          user: state.user,
        }),
      }
    )
  )
);

/**
 * 从 localStorage 中提取 token（支持 persist 对象格式和纯字符串格式）
 */
const extractTokenFromStorage = (): string | null => {
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
};

/**
 * 检查本地是否存在认证信息（用于初始化）
 */
export const checkLocalAuth = (): boolean => {
  const token = extractTokenFromStorage();
  return !!token;
};