/**
 * 用户控制器
 * 
 * 处理用户相关的HTTP请求，包括：
 * - 用户注册、登录
 * - 用户信息管理
 * - 用户列表查询
 * - 用户权限管理
 */

import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user-service';
import { ApiResponse, ApiError, PaginationQuery, CreateUserDto, UpdateUserDto, LoginDto } from '../types';
import { authenticate, authorize } from '../middleware/auth-middleware';

/**
 * 创建格式化API响应的辅助函数
 */
const createResponse = <T>(
  success: boolean,
  data: T | null,
  error: ApiError | null,
  message: string
): ApiResponse<T> => ({
  success,
  data,
  error,
  message,
  timestamp: new Date().toISOString(),
});

/**
 * 用户控制器类
 */
export class UserController {
  /**
   * 用户注册
   * 
   * 接口：POST /api/v1/users/register
   * 功能：创建新用户账户
   * 
   * @param req 请求对象，包含用户注册信息
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: CreateUserDto = req.body;
      const user = await userService.createUser(userData);
      
      const response: ApiResponse = createResponse(
        true,
        user,
        null,
        '用户注册成功'
      );
      
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 用户登录
   * 
   * 接口：POST /api/v1/users/login
   * 功能：验证用户凭证并返回JWT令牌
   * 
   * @param req 请求对象，包含登录邮箱和密码
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginData: LoginDto = req.body;
      const authResponse = await userService.login(loginData);
      
      const response: ApiResponse = createResponse(
        true,
        authResponse,
        null,
        '登录成功'
      );
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取当前用户信息
   * 
   * 接口：GET /api/v1/users/me
   * 功能：获取当前已认证用户的详细信息
   * 权限：需要认证
   * 
   * @param req 请求对象（包含认证用户信息）
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw {
          code: 'UNAUTHORIZED',
          message: '用户未认证',
        } as ApiError;
      }
      
      const user = await userService.getCurrentUser(req.user.userId);
      
      const response: ApiResponse = createResponse(
        true,
        user,
        null,
        '获取当前用户信息成功'
      );
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 更新当前用户信息
   * 
   * 接口：PATCH /api/v1/users/me
   * 功能：更新当前已认证用户的个人信息
   * 权限：需要认证
   * 
   * @param req 请求对象（包含认证用户信息和更新数据）
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async updateCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw {
          code: 'UNAUTHORIZED',
          message: '用户未认证',
        } as ApiError;
      }
      
      const updateData: UpdateUserDto = req.body;
      const user = await userService.updateCurrentUser(req.user.userId, updateData);
      
      const response: ApiResponse = createResponse(
        true,
        user,
        null,
        '用户信息更新成功'
      );
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取用户列表（分页）
   * 
   * 接口：GET /api/v1/users
   * 功能：获取用户列表，支持分页、排序和筛选
   * 权限：需要管理员权限
   * 
   * @param req 请求对象，包含分页和查询参数
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination: PaginationQuery = {
        page: parseInt(req.query.page as string) || 1,
        pageSize: parseInt(req.query.pageSize as string) || 10,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
      };
      
      const result = await userService.getUsers(pagination);
      
      const response = {
        success: true,
        data: result.data,
        pagination: result.pagination,
        error: null,
        message: '获取用户列表成功',
        timestamp: new Date().toISOString(),
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 根据ID获取用户信息
   *
   * 接口：GET /api/v1/users/:id
   * 功能：根据用户ID获取用户详细信息
   * 权限：需要管理员权限或自己的用户信息
   *
   * @param req 请求对象，包含用户ID参数
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const user = await userService.getUserById(id);
      
      const response: ApiResponse = createResponse(
        true,
        user,
        null,
        '获取用户信息成功'
      );
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 更新用户信息（管理员）
   *
   * 接口：PATCH /api/v1/users/:id
   * 功能：管理员更新指定用户的信息
   * 权限：需要管理员权限
   *
   * @param req 请求对象，包含用户ID和更新数据
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const updateData: UpdateUserDto = req.body;
      
      const user = await userService.updateUser(id, updateData);
      
      const response: ApiResponse = createResponse(
        true,
        user,
        null,
        '用户信息更新成功'
      );
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 删除用户
   *
   * 接口：DELETE /api/v1/users/:id
   * 功能：删除指定用户账户
   * 权限：需要管理员权限
   *
   * @param req 请求对象，包含要删除的用户ID
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await userService.deleteUser(id);
      
      const response: ApiResponse = createResponse(
        true,
        null,
        null,
        '用户删除成功'
      );
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取作者列表（公开）
   *
   * 接口：GET /api/v1/users/authors
   * 功能：获取所有作者的ID和用户名，用于文章列表筛选等场景
   * 权限：公开访问
   *
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async getAuthors(req: Request, res: Response, next: NextFunction) {
    try {
      const authors = await userService.getAuthors();
      
      const response: ApiResponse = createResponse(
        true,
        authors,
        null,
        '获取作者列表成功'
      );
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

/**
 * 用户控制器实例
 */
export const userController = new UserController();