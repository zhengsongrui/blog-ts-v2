import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiResponse } from '../types';

/**
 * 错误处理中间件
 */
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  let statusCode = 500;
  let errorResponse: ApiResponse = {
    success: false,
    data: null,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: '服务器内部错误',
    },
    message: '服务器内部错误',
    timestamp: new Date().toISOString(),
  };

  // 处理已知错误类型
  if (error.code) {
    switch (error.code) {
      case 'VALIDATION_ERROR':
        statusCode = 400;
        errorResponse.error = {
          code: error.code,
          message: error.message,
          details: error.details,
        };
        errorResponse.message = error.message;
        break;

      case 'EMAIL_EXISTS':
      case 'USERNAME_EXISTS':
        statusCode = 409;
        errorResponse.error = {
          code: error.code,
          message: error.message,
        };
        errorResponse.message = error.message;
        break;

      case 'INVALID_CREDENTIALS':
        statusCode = 401;
        errorResponse.error = {
          code: error.code,
          message: error.message,
        };
        errorResponse.message = error.message;
        break;

      case 'UNAUTHORIZED':
        statusCode = 401;
        errorResponse.error = {
          code: error.code,
          message: error.message,
        };
        errorResponse.message = error.message;
        break;

      case 'FORBIDDEN':
        statusCode = 403;
        errorResponse.error = {
          code: error.code,
          message: error.message,
        };
        errorResponse.message = error.message;
        break;

      case 'USER_NOT_FOUND':
      case 'POST_NOT_FOUND':
      case 'CATEGORY_NOT_FOUND':
      case 'TAG_NOT_FOUND':
      case 'COMMENT_NOT_FOUND':
        statusCode = 404;
        errorResponse.error = {
          code: error.code,
          message: error.message,
        };
        errorResponse.message = error.message;
        break;

      default:
        statusCode = 400;
        errorResponse.error = {
          code: error.code || 'BAD_REQUEST',
          message: error.message || '请求错误',
        };
        errorResponse.message = error.message || '请求错误';
    }
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorResponse.error = {
      code: 'INVALID_TOKEN',
      message: '无效的认证令牌',
    };
    errorResponse.message = '无效的认证令牌';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    errorResponse.error = {
      code: 'TOKEN_EXPIRED',
      message: '认证令牌已过期',
    };
    errorResponse.message = '认证令牌已过期';
  } else if (error.name === 'ZodError') {
    statusCode = 400;
    errorResponse.error = {
      code: 'VALIDATION_ERROR',
      message: '输入验证失败',
      details: error.issues.map((issue: any) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    };
    errorResponse.message = '输入验证失败';
  } else if (error.statusCode) {
    statusCode = error.statusCode;
    errorResponse.error = {
      code: error.code || 'ERROR',
      message: error.message || '发生错误',
    };
    errorResponse.message = error.message || '发生错误';
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * 404 中间件
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const errorResponse: ApiResponse = {
    success: false,
    data: null,
    error: {
      code: 'NOT_FOUND',
      message: `无法找到 ${req.method} ${req.originalUrl}`,
    },
    message: '资源不存在',
    timestamp: new Date().toISOString(),
  };

  res.status(404).json(errorResponse);
};