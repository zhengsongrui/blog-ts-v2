/**
 * 文件上传服务
 * 
 * 处理文件上传相关业务逻辑，包括：
 * - 文件验证（类型、大小）
 * - 文件存储（本地文件系统）
 * - 生成文件访问URL
 * - 文件信息记录
 * 
 * 注意：需要安装 multer 中间件来处理 multipart/form-data
 * npm install multer
 * npm install @types/multer
 */

import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { FileInfo, ApiError } from '../types';

// Multer 文件对象接口（如果未安装 @types/multer，可使用此接口）
export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer?: Buffer;
}

// 配置
const UPLOAD_DIR = path.join(__dirname, '../../uploads');
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// 导出配置常量供路由使用
export { MAX_FILE_SIZE, ALLOWED_MIME_TYPES, UPLOAD_DIR };

// 确保上传目录存在
const ensureUploadDir = () => {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
};

/**
 * 文件上传服务类
 */
export class UploadService {
  /**
   * 上传单个文件
   * 
   * @param file Multer 文件对象（来自 req.file）
   * @param userId 上传用户ID（可选，用于权限控制）
   * @returns 文件信息对象
   */
  async uploadFile(file: UploadedFile, userId?: string): Promise<FileInfo> {
    // 验证文件是否存在
    if (!file) {
      throw {
        code: 'FILE_REQUIRED',
        message: '请选择要上传的文件',
      } as ApiError;
    }

    // 验证文件大小
    if (file.size > MAX_FILE_SIZE) {
      throw {
        code: 'FILE_TOO_LARGE',
        message: `文件大小不能超过 ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      } as ApiError;
    }

    // 验证文件类型
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw {
        code: 'INVALID_FILE_TYPE',
        message: `不支持的文件类型，仅支持：${ALLOWED_MIME_TYPES.join(', ')}`,
      } as ApiError;
    }

    // 确保上传目录存在
    ensureUploadDir();

    // 生成唯一文件名，防止冲突
    const fileExt = path.extname(file.originalname);
    const uniqueFilename = `${randomUUID()}${fileExt}`;
    const filePath = path.join(UPLOAD_DIR, uniqueFilename);

    // 将文件从临时目录移动到上传目录
    try {
      await fs.promises.rename(file.path, filePath);
    } catch (error) {
      // 如果移动失败，可能是跨设备移动，改用复制后删除
      await fs.promises.copyFile(file.path, filePath);
      await fs.promises.unlink(file.path);
    }

    // 生成访问URL（假设服务器地址为 localhost:3000）
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/uploads/${uniqueFilename}`;

    // 返回文件信息
    const fileInfo: FileInfo = {
      filename: uniqueFilename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: filePath,
      url,
    };

    return fileInfo;
  }

  /**
   * 上传多个文件
   * 
   * @param files Multer 文件对象数组（来自 req.files）
   * @param userId 上传用户ID（可选）
   * @returns 文件信息对象数组
   */
  async uploadMultipleFiles(files: UploadedFile[], userId?: string): Promise<FileInfo[]> {
    if (!files || files.length === 0) {
      throw {
        code: 'FILES_REQUIRED',
        message: '请选择要上传的文件',
      } as ApiError;
    }

    const results: FileInfo[] = [];
    for (const file of files) {
      const result = await this.uploadFile(file, userId);
      results.push(result);
    }

    return results;
  }

  /**
   * 删除文件
   * 
   * @param filename 文件名（不含路径）
   * @returns 删除是否成功
   */
  async deleteFile(filename: string): Promise<boolean> {
    const filePath = path.join(UPLOAD_DIR, filename);
    
    if (!fs.existsSync(filePath)) {
      throw {
        code: 'FILE_NOT_FOUND',
        message: '文件不存在',
      } as ApiError;
    }

    try {
      await fs.promises.unlink(filePath);
      return true;
    } catch (error) {
      throw {
        code: 'DELETE_FAILED',
        message: '文件删除失败',
        details: error,
      } as ApiError;
    }
  }

  /**
   * 获取上传目录中的文件列表（仅用于管理）
   * 
   * @param page 页码
   * @param pageSize 每页数量
   * @returns 文件列表和分页信息
   */
  async listFiles(page: number = 1, pageSize: number = 20) {
    ensureUploadDir();
    
    const files = await fs.promises.readdir(UPLOAD_DIR);
    const total = files.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedFiles = files.slice(start, end);

    const fileInfos = await Promise.all(
      paginatedFiles.map(async (filename) => {
        const filePath = path.join(UPLOAD_DIR, filename);
        const stat = await fs.promises.stat(filePath);
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const url = `${baseUrl}/uploads/${filename}`;

        return {
          filename,
          originalname: filename,
          mimetype: this.getMimeType(filename),
          size: stat.size,
          path: filePath,
          url,
          createdAt: stat.birthtime,
          updatedAt: stat.mtime,
        };
      })
    );

    return {
      files: fileInfos,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        hasNext: end < total,
        hasPrev: start > 0,
      },
    };
  }

  /**
   * 根据文件扩展名猜测 MIME 类型
   */
  private getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeMap: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
      '.json': 'application/json',
    };
    return mimeMap[ext] || 'application/octet-stream';
  }
}

// 导出单例实例
export const uploadService = new UploadService();