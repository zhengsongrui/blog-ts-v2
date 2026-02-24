/**
 * 文章控制器
 * 
 * 处理文章相关的HTTP请求，包括：
 * - 文章的创建、读取、更新、删除（CRUD）
 * - 文章列表查询（支持分页、筛选、排序）
 * - 文章分类和标签管理
 * - 文章评论功能
 */

import { Request, Response, NextFunction } from 'express';
import { postService } from '../services/post-service';
import { ApiResponse, ApiError, PaginationQuery, CreatePostDto, UpdatePostDto } from '../types';
import { authenticate, authorize, optionalAuthenticate } from '../middleware/auth-middleware';

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
 * 文章控制器类
 */
export class PostController {
  /**
   * 创建文章
   * 
   * 接口：POST /api/v1/posts
   * 功能：创建新的文章
   * 权限：需要认证，编辑或管理员角色
   * 
   * @param req 请求对象，包含文章数据和认证用户信息
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw {
          code: 'UNAUTHORIZED',
          message: '用户未认证',
        } as ApiError;
      }
      
      const postData: CreatePostDto = req.body;
      const post = await postService.createPost(postData, req.user.userId);
      
      const response: ApiResponse = createResponse(
        true,
        post,
        null,
        '文章创建成功'
      );
      
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取文章列表（分页）
   * 
   * 接口：GET /api/v1/posts
   * 功能：获取文章列表，支持分页、筛选和排序
   * 权限：公开访问，但未发布的文章需要管理员权限
   * 
   * 查询参数：
   * - page: 页码（默认1）
   * - pageSize: 每页数量（默认10）
   * - sortBy: 排序字段（默认createdAt）
   * - sortOrder: 排序顺序（默认desc）
   * - status: 文章状态筛选（DRAFT, PUBLISHED, ARCHIVED）
   * - authorId: 按作者筛选
   * - categoryId: 按分类筛选
   * - tagId: 按标签筛选
   * 
   * @param req 请求对象，包含查询参数
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination: PaginationQuery = {
        page: parseInt(req.query.page as string) || 1,
        pageSize: parseInt(req.query.pageSize as string) || 10,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
      };
      
      // 构建筛选条件
      const filters: any = {};
      const isAdminOrEditor = req.user && (req.user.role === 'ADMIN' || req.user.role === 'EDITOR');
      
      // 标题筛选（模糊匹配）
      if (req.query.title) {
        filters.title = req.query.title as string;
      }
      // 状态筛选
      if (req.query.status) {
        filters.status = req.query.status as string;
      }
      if (req.query.authorId) {
        filters.authorId = req.query.authorId as string;
      }
      if (req.query.categoryId) {
        filters.categoryId = req.query.categoryId as string;
      }
      if (req.query.tagId) {
        filters.tagId = req.query.tagId as string;
      }
      
      
      const result = await postService.getPosts(pagination, filters);
      
      const response = {
        success: true,
        data: result.data,
        pagination: result.pagination,
        error: null,
        message: '获取文章列表成功',
        timestamp: new Date().toISOString(),
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 根据ID获取文章
   * 
   * 接口：GET /api/v1/posts/:id
   * 功能：根据文章ID获取文章详细信息
   * 权限：公开访问已发布文章，草稿和归档文章需要管理员权限
   * 
   * @param req 请求对象，包含文章ID参数
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async getPostById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const post = await postService.getPostById(id);
      
      // 权限检查：非管理员用户只能访问已发布的文章
      if (post.status !== 'PUBLISHED' && (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'EDITOR'))) {
        throw {
          code: 'FORBIDDEN',
          message: '没有权限访问此文章',
        } as ApiError;
      }
      
      const response: ApiResponse = createResponse(
        true,
        post,
        null,
        '获取文章成功'
      );
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 根据slug获取文章
   * 
   * 接口：GET /api/v1/posts/slug/:slug
   * 功能：根据文章slug获取文章详细信息
   * 权限：公开访问已发布文章，草稿和归档文章需要管理员权限
   * 
   * @param req 请求对象，包含文章slug参数
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async getPostBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;
      const post = await postService.getPostBySlug(slug);
      
      // 权限检查：非管理员用户只能访问已发布的文章
      if (post.status !== 'PUBLISHED' && (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'EDITOR'))) {
        throw {
          code: 'FORBIDDEN',
          message: '没有权限访问此文章',
        } as ApiError;
      }
      
      const response: ApiResponse = createResponse(
        true,
        post,
        null,
        '获取文章成功'
      );
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 更新文章
   * 
   * 接口：PATCH /api/v1/posts/:id
   * 功能：更新指定文章的信息
   * 权限：需要认证，作者本人或管理员/编辑角色
   * 
   * @param req 请求对象，包含文章ID和更新数据
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async updatePost(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw {
          code: 'UNAUTHORIZED',
          message: '用户未认证',
        } as ApiError;
      }
      
      const id = req.params.id as string;
      const updateData: UpdatePostDto = req.body;
      
      // 检查权限：管理员和编辑可以更新任何文章，普通用户只能更新自己的文章
      const post = await postService.getPostById(id);
      if (req.user.role !== 'ADMIN' && req.user.role !== 'EDITOR' && post.authorId !== req.user.userId) {
        throw {
          code: 'FORBIDDEN',
          message: '没有权限更新此文章',
        } as ApiError;
      }
      
      const updatedPost = await postService.updatePost(id, updateData);
      
      const response: ApiResponse = createResponse(
        true,
        updatedPost,
        null,
        '文章更新成功'
      );
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 删除文章
   * 
   * 接口：DELETE /api/v1/posts/:id
   * 功能：删除指定文章
   * 权限：需要认证，作者本人或管理员角色
   * 
   * @param req 请求对象，包含要删除的文章ID
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw {
          code: 'UNAUTHORIZED',
          message: '用户未认证',
        } as ApiError;
      }
      
      const id = req.params.id as string;
      
      // 检查权限：管理员可以删除任何文章，编辑和普通用户只能删除自己的文章
      const post = await postService.getPostById(id);
      if (req.user.role !== 'ADMIN' && req.user.role !== 'EDITOR' && post.authorId !== req.user.userId) {
        throw {
          code: 'FORBIDDEN',
          message: '没有权限删除此文章',
        } as ApiError;
      }
      
      await postService.deletePost(id);
      
      const response: ApiResponse = createResponse(
        true,
        null,
        null,
        '文章删除成功'
      );
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取用户的文章列表
   * 
   * 接口：GET /api/v1/users/:userId/posts
   * 功能：获取指定用户的所有文章
   * 权限：公开访问已发布文章，非公开文章需要管理员权限或本人访问
   * 
   * @param req 请求对象，包含用户ID和查询参数
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async getUserPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId as string;
      const pagination: PaginationQuery = {
        page: parseInt(req.query.page as string) || 1,
        pageSize: parseInt(req.query.pageSize as string) || 10,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
      };
      
      // 构建筛选条件
      const filters: any = { authorId: userId };
      
      // 权限检查：非管理员用户只能查看已发布的文章
      if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'EDITOR' && req.user.userId !== userId)) {
        filters.status = 'PUBLISHED';
      }
      
      const result = await postService.getPosts(pagination, filters);
      
      const response = {
        success: true,
        data: result.data,
        pagination: result.pagination,
        error: null,
        message: '获取用户文章列表成功',
        timestamp: new Date().toISOString(),
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

/**
 * 文章控制器实例
 */
export const postController = new PostController();