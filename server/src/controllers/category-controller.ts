/**
 * 分类控制器
 * 
 * 处理分类相关的HTTP请求，包括：
 * - 分类的创建、读取、更新、删除（CRUD）
 * - 分类列表查询（支持分页、排序）
 * - 分类统计信息
 */

import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/category-service';
import { 
  ApiResponse, 
  ApiError, 
  PaginationQuery, 
  CreateCategoryDto, 
  UpdateCategoryDto,
  Category 
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
 * 分类控制器类
 */
export class CategoryController {
  /**
   * 创建分类
   * 
   * 接口：POST /api/v1/categories
   * 功能：创建新的分类
   * 权限：需要认证，编辑或管理员角色
   * 
   * @param req 请求对象，包含分类数据
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw {
          code: 'UNAUTHORIZED',
          message: '用户未认证',
        } as ApiError;
      }

      const categoryData: CreateCategoryDto = req.body;
      const category = await categoryService.createCategory(categoryData);
      
      const response: ApiResponse<Category> = createResponse(
        true,
        category,
        null,
        '分类创建成功'
      );
      
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取分类列表（分页）
   * 
   * 接口：GET /api/v1/categories
   * 功能：获取分类列表，支持分页和排序
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
  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination: PaginationQuery = {
        page: parseInt(req.query.page as string) || 1,
        pageSize: parseInt(req.query.pageSize as string) || 10,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
      };
      
      const result = await categoryService.getCategories(pagination);
      
      const response = {
        success: true,
        data: result.data,
        pagination: result.pagination,
        error: null,
        message: '获取分类列表成功',
        timestamp: new Date().toISOString(),
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取所有分类（不分页）
   * 
   * 接口：GET /api/v1/categories/all
   * 功能：获取所有分类，用于下拉选择等场景
   * 权限：公开访问
   * 
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.getAllCategories();
      
      const response: ApiResponse<Category[]> = createResponse(
        true,
        categories,
        null,
        '获取所有分类成功'
      );
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 根据ID获取分类
   * 
   * 接口：GET /api/v1/categories/:id
   * 功能：根据分类ID获取分类详细信息
   * 权限：公开访问
   * 
   * @param req 请求对象，包含分类ID参数
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const category = await categoryService.getCategoryById(id);
      
      const response: ApiResponse<Category> = createResponse(
        true,
        category,
        null,
        '获取分类成功'
      );
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 根据slug获取分类
   * 
   * 接口：GET /api/v1/categories/slug/:slug
   * 功能：根据分类slug获取分类详细信息
   * 权限：公开访问
   * 
   * @param req 请求对象，包含分类slug参数
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async getCategoryBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;
      const category = await categoryService.getCategoryBySlug(slug);
      
      const response: ApiResponse<Category> = createResponse(
        true,
        category,
        null,
        '获取分类成功'
      );
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 更新分类
   * 
   * 接口：PATCH /api/v1/categories/:id
   * 功能：更新指定分类的信息
   * 权限：需要认证，编辑或管理员角色
   * 
   * @param req 请求对象，包含分类ID和更新数据
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw {
          code: 'UNAUTHORIZED',
          message: '用户未认证',
        } as ApiError;
      }

      const id = req.params.id as string;
      const updateData: UpdateCategoryDto = req.body;
      
      const updatedCategory = await categoryService.updateCategory(id, updateData);
      
      const response: ApiResponse<Category> = createResponse(
        true,
        updatedCategory,
        null,
        '分类更新成功'
      );
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 删除分类
   * 
   * 接口：DELETE /api/v1/categories/:id
   * 功能：删除指定分类
   * 权限：需要认证，管理员角色
   * 
   * @param req 请求对象，包含要删除的分类ID
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw {
          code: 'UNAUTHORIZED',
          message: '用户未认证',
        } as ApiError;
      }

      const id = req.params.id as string;
      await categoryService.deleteCategory(id);
      
      const response: ApiResponse<null> = createResponse(
        true,
        null,
        null,
        '分类删除成功'
      );
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取分类统计信息
   * 
   * 接口：GET /api/v1/categories/:id/stats
   * 功能：获取分类的统计信息，如文章数量等
   * 权限：公开访问
   * 
   * @param req 请求对象，包含分类ID参数
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async getCategoryStats(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const stats = await categoryService.getCategoryStats(id);
      
      const response: ApiResponse = createResponse(
        true,
        stats,
        null,
        '获取分类统计信息成功'
      );
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 批量创建分类
   * 
   * 接口：POST /api/v1/categories/batch
   * 功能：批量创建多个分类
   * 权限：需要认证，编辑或管理员角色
   * 
   * @param req 请求对象，包含分类数据数组
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async createManyCategories(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw {
          code: 'UNAUTHORIZED',
          message: '用户未认证',
        } as ApiError;
      }

      const categoriesData: CreateCategoryDto[] = req.body;
      const categories = await categoryService.createManyCategories(categoriesData);
      
      const response: ApiResponse<Category[]> = createResponse(
        true,
        categories,
        null,
        '批量创建分类成功'
      );
      
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
}

/**
 * 分类控制器实例
 */
export const categoryController = new CategoryController();