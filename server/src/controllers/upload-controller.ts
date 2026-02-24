/**
 * 文件上传控制器
 * 
 * 处理文件上传相关的HTTP请求，包括：
 * - 单个文件上传
 * - 多个文件上传
 * - 文件删除
 * - 文件列表查询
 * 
 * 注意：需要配合 multer 中间件使用
 */

import { Request, Response, NextFunction } from 'express';
import { uploadService, UploadedFile } from '../services/upload-service';
import { ApiResponse, ApiError, FileInfo, UploadResponse } from '../types';
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
 * 文件上传控制器类
 */
export class UploadController {
  /**
   * 上传单个文件
   * 
   * 接口：POST /api/v1/upload
   * 功能：上传单个文件到服务器
   * 权限：需要认证（登录用户）
   * 请求体：multipart/form-data，字段名为 "file"
   * 返回：文件信息对象
   * 
   * @param req 请求对象，包含上传的文件和认证用户信息
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw {
          code: 'UNAUTHORIZED',
          message: '用户未认证',
        } as ApiError;
      }

      const file = req.file as UploadedFile | undefined;
      if (!file) {
        throw {
          code: 'BAD_REQUEST',
          message: '请上传文件',
        } as ApiError;
      }
      const fileInfo = await uploadService.uploadFile(file, req.user.userId);

      const response: UploadResponse = createResponse(
        true,
        fileInfo,
        null,
        '文件上传成功'
      );

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 上传多个文件
   * 
   * 接口：POST /api/v1/upload/multiple
   * 功能：上传多个文件到服务器
   * 权限：需要认证（登录用户）
   * 请求体：multipart/form-data，字段名为 "files"
   * 返回：文件信息对象数组
   * 
   * @param req 请求对象，包含上传的文件数组和认证用户信息
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async uploadMultipleFiles(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw {
          code: 'UNAUTHORIZED',
          message: '用户未认证',
        } as ApiError;
      }

      const files = req.files as UploadedFile[] | undefined;
      if (!files || !Array.isArray(files) || files.length === 0) {
        throw {
          code: 'BAD_REQUEST',
          message: '请上传至少一个文件',
        } as ApiError;
      }
      const fileInfos = await uploadService.uploadMultipleFiles(files, req.user.userId);

      const response: ApiResponse<FileInfo[]> = createResponse(
        true,
        fileInfos,
        null,
        '文件上传成功'
      );

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 删除文件
   * 
   * 接口：DELETE /api/v1/upload/:filename
   * 功能：删除服务器上的指定文件
   * 权限：需要认证，管理员或文件上传者
   * 参数：文件名（不含路径）
   * 返回：删除结果
   * 
   * @param req 请求对象，包含文件名和认证用户信息
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async deleteFile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw {
          code: 'UNAUTHORIZED',
          message: '用户未认证',
        } as ApiError;
      }

      const filename = req.params.filename as string;
      const result = await uploadService.deleteFile(filename);

      const response: ApiResponse<boolean> = createResponse(
        true,
        result,
        null,
        '文件删除成功'
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取文件列表（分页）
   * 
   * 接口：GET /api/v1/upload
   * 功能：获取上传文件列表（仅管理员）
   * 权限：需要认证，管理员角色
   * 查询参数：
   *   - page: 页码（默认1）
   *   - pageSize: 每页数量（默认20）
   * 返回：文件列表和分页信息
   * 
   * @param req 请求对象，包含查询参数和认证用户信息
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  async listFiles(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw {
          code: 'UNAUTHORIZED',
          message: '用户未认证',
        } as ApiError;
      }

      // 仅管理员可访问
      if (req.user.role !== 'ADMIN') {
        throw {
          code: 'FORBIDDEN',
          message: '无权访问文件列表',
        } as ApiError;
      }

      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 20;
      const result = await uploadService.listFiles(page, pageSize);

      const response: ApiResponse = createResponse(
        true,
        result,
        null,
        '获取文件列表成功'
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

// 导出单例实例
export const uploadController = new UploadController();