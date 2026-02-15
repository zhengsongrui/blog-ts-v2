import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { ApiError } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

/**
 * JWT 认证中间件
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next({
      code: 'UNAUTHORIZED',
      message: '缺少认证令牌',
    } as ApiError);
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next({
      code: 'UNAUTHORIZED',
      message: '令牌格式错误',
    } as ApiError);
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as any;
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    return next({
      code: 'UNAUTHORIZED',
      message: '令牌无效或已过期',
    } as ApiError);
  }
};

/**
 * 授权中间件 (基于角色)
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next({
        code: 'UNAUTHORIZED',
        message: '用户未认证',
      } as ApiError);
    }

    if (!roles.includes(req.user.role)) {
      return next({
        code: 'FORBIDDEN',
        message: '权限不足',
      } as ApiError);
    }

    next();
  };
};

/**
 * 可选认证中间件
 */
export const optionalAuthenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as any;
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    // 令牌无效，但不阻止请求继续
  }

  next();
};