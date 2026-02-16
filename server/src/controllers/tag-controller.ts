/**
 * 标签控制器
 * 
 * 处理标签相关的HTTP请求，包括：
 * - 标签的创建、读取、更新、删除（CRUD）
 * - 标签列表查询（支持分页、排序）
 * - 标签统计信息
 */

import { Request, Response, NextFunction } from 'express';
import { tagService } from '../services/tag-service';
import { 
  ApiResponse, 
  ApiError, 
  PaginationQuery, 
  CreateTagDto, 
  UpdateTagDto,
  Tag 
} from '../types';
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
 * 标签控制器类
 */
export class TagController {
  /**
   * 创建标签
   * 
   * 接口：POST /api/v1/tags
   * 功能：创建新的标签
   * 权限：需要认证，编辑或管理员角色
   * 
   * @param req 请求对象，包含标签数据
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async createTag(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw {
          code: 'UNAUTHORIZED',
          message: '用户未认证',
        } as ApiError;
      }

      const tagData: CreateTagDto = req.body;
      const tag = await tagService.createTag(tagData);
      
      const response: ApiResponse<Tag> = createResponse(
        true,
        tag,
        null,
        '标签创建成功'
      );
      
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取标签列表（分页）
   * 
   * 接口：GET /api/v1/tags
   * 功能：获取标签列表，支持分页和排序
   * 权限：公开访问
   * 
   * 查询参数：
   * - page: 页码（默认1）
   * - pageSize: 每页数量（默认10）
   * - sortBy: 排序字段（默认createdAt）
   * - sortOrder: 排序顺序（默认desc）
   * 
   * @param req 请求对象，包含查询参数
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async getTags(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination: PaginationQuery = {
        page: parseInt(req.query.page as string) || 1,
        pageSize: parseInt(req.query.pageSize as string) || 10,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
      };
      
      const result = await tagService.getTags(pagination);
      
      const response = {
        success: true,
        data: result.data,
        pagination: result.pagination,
        error: null,
        message: '获取标签列表成功',
        timestamp: new Date().toISOString(),
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取所有标签（不分页）
   * 
   * 接口：GET /api/v1/tags/all
   * 功能：获取所有标签，用于下拉选择等场景
   * 权限：公开访问
   * 
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async getAllTags(req: Request, res: Response, next: NextFunction) {
    try {
      const tags = await tagService.getAllTags();
      
      const response: ApiResponse<Tag[]> = createResponse(
        true,
        tags,
        null,
        '获取所有标签成功'
      );
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 根据ID获取标签
   * 
   * 接口：GET /api/v1/tags/:id
   * 功能：根据标签ID获取标签详细信息
   * 权限：公开访问
   * 
   * @param req 请求对象，包含标签ID参数
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async getTagById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const tag = await tagService.getTagById(id);
      
      const response: ApiResponse<Tag> = createResponse(
        true,
        tag,
        null,
        '获取标签成功'
      );
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 根据slug获取标签
   * 
   * 接口：GET /api/v1/tags/slug/:slug
   * 功能：根据标签slug获取标签详细信息
   * 权限：公开访问
   * 
   * @param req 请求对象，包含标签slug参数
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async getTagBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;
      const tag = await tagService.getTagBySlug(slug);
      
      const response: ApiResponse<Tag> = createResponse(
        true,
        tag,
        null,
        '获取标签成功'
      );
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 更新标签
   * 
   * 接口：PATCH /api/v1/tags/:id
   * 功能：更新指定标签的信息
   * 权限：需要认证，编辑或管理员角色
   * 
   * @param req 请求对象，包含标签ID和更新数据
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async updateTag(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw {
          code: 'UNAUTHORIZED',
          message: '用户未认证',
        } as ApiError;
      }

      const id = req.params.id as string;
      const updateData: UpdateTagDto = req.body;
      
      const updatedTag = await tagService.updateTag(id, updateData);
      
      const response: ApiResponse<Tag> = createResponse(
        true,
        updatedTag,
        null,
        '标签更新成功'
      );
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 删除标签
   * 
   * 接口：DELETE /api/v1/tags/:id
   * 功能：删除指定标签
   * 权限：需要认证，管理员角色
   * 
   * @param req 请求对象，包含要删除的标签ID
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async deleteTag(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw {
          code: 'UNAUTHORIZED',
          message: '用户未认证',
        } as ApiError;
      }

      const id = req.params.id as string;
      await tagService.deleteTag(id);
      
      const response: ApiResponse<null> = createResponse(
        true,
        null,
        null,
        '标签删除成功'
      );
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取标签统计信息
   * 
   * 接口：GET /api/v1/tags/:id/stats
   * 功能：获取标签的统计信息，如文章数量等
   * 权限：公开访问
   * 
   * @param req 请求对象，包含标签ID参数
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async getTagStats(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const stats = await tagService.getTagStats(id);
      
      const response: ApiResponse = createResponse(
        true,
        stats,
        null,
        '获取标签统计信息成功'
      );
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 批量创建标签
   * 
   * 接口：POST /api/v1/tags/batch
   * 功能：批量创建多个标签
   * 权限：需要认证，编辑或管理员角色
   * 
   * @param req 请求对象，包含标签数据数组
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async createManyTags(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw {
          code: 'UNAUTHORIZED',
          message: '用户未认证',
        } as ApiError;
      }

      const tagsData: CreateTagDto[] = req.body;
      const tags = await tagService.createManyTags(tagsData);
      
      const response: ApiResponse<Tag[]> = createResponse(
        true,
        tags,
        null,
        '批量创建标签成功'
      );
      
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 根据文章ID获取标签
   * 
   * 接口：GET /api/v1/posts/:postId/tags
   * 功能：获取指定文章的所有标签
   * 权限：公开访问
   * 
   * @param req 请求对象，包含文章ID参数
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async getTagsByPostId(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = req.params.postId as string;
      const tags = await tagService.getTagsByPostId(postId);
      
      const response: ApiResponse<Tag[]> = createResponse(
        true,
        tags,
        null,
        '获取文章标签成功'
      );
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

/**
 * 标签控制器实例
 */
export const tagController = new TagController();