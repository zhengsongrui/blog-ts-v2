    /**
 * 认证相关 Hook
 * 封装登录、注册、登出等认证逻辑
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { userApi } from '@/api/endpoints';
import type { LoginDto, CreateUserDto, AuthResponse, User } from '@/api/types';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTE_PATHS } from '@/config/constants';

/**
 * 认证相关操作 Hook
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const { login: storeLogin, logout: storeLogout, setLoading, setError } = useAuthStore();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  /**
   * 用户登录
   */
  const login = useCallback(
    async (data: LoginDto) => {
      try {
        setIsLoggingIn(true);
        setLoading(true);
        setError(null);

        console.log('开始登录请求', data);
        const response = await userApi.login(data);
        // 从响应中提取用户信息和 token
        console.log(response);
        const { user, token } = response;

        // 更新状态存储
        storeLogin(user, token);

        // 跳转到首页
        navigate(ROUTE_PATHS.HOME, { replace: true });

        return { success: true, user };
      } catch (err: any) {
        
        const errorMessage = err?.response?.data?.error?.message || '登录失败，请检查邮箱和密码';
        console.error('登录失败', err, errorMessage);
        setError(errorMessage);
        message.error(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoggingIn(false);
        setLoading(false);
      }
    },
    [navigate, setError, setLoading, storeLogin]
  );

  /**
   * 用户注册
   */
  const register = useCallback(
    async (data: CreateUserDto) => {
      try {
        setIsRegistering(true);
        setLoading(true);
        setError(null);

        const user = await userApi.register(data);

        // 注册成功后自动登录（如果有 token 的话）
        // 这里通常后端会在注册后返回 token，但根据 API 设计可能没有
        // 暂时只显示成功消息，让用户手动登录
        message.success('注册成功，请登录');

        // 跳转到登录页
        navigate(ROUTE_PATHS.LOGIN, { replace: true });

        return { success: true, user };
      } catch (err: any) {
        const errorMessage = err?.response?.data?.error?.message || '注册失败，请稍后重试';
        setError(errorMessage);
        message.error(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsRegistering(false);
        setLoading(false);
      }
    },
    [navigate, setError, setLoading]
  );

  /**
   * 用户登出
   */
  const logout = useCallback(() => {
    storeLogout();
    message.success('已退出登录');
    navigate(ROUTE_PATHS.LOGIN, { replace: true });
  }, [navigate, storeLogout]);

  /**
   * 检查是否已登录
   */
  const checkAuth = useCallback(() => {
    const { isAuthenticated } = useAuthStore.getState();
    return isAuthenticated;
  }, []);

  return {
    // 状态
    isLoggingIn,
    isRegistering,
    // 方法
    login,
    register,
    logout,
    checkAuth,
  };
};