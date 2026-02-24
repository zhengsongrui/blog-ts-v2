/**
 * 文件上传路由
 * 
 * 定义文件上传相关的API端点路由，包括：
 * - 单个文件上传
 * - 多个文件上传
 * - 文件删除
 * - 文件列表查询
 * 
 * 路由前缀：/api/v1/upload
 */

import { Router } from 'express';
import multer from 'multer';
import { uploadController } from '../controllers/upload-controller';
import { authenticate, authorize } from '../middleware/auth-middleware';
import { MAX_FILE_SIZE, ALLOWED_MIME_TYPES } from '../services/upload-service';

const router = Router();

/**
 * Multer 配置
 * 使用磁盘存储，将文件保存到临时目录，由服务层处理最终存储
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 临时目录，确保存在
    const tempDir = 'uploads/temp';
    const fs = require('fs');
    const path = require('path');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    // 生成临时文件名，使用原始名称加上时间戳
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  },
});

/**
 * 文件过滤器
 */
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // 检查文件类型
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new Error(`不支持的文件类型，仅支持：${ALLOWED_MIME_TYPES.join(', ')}`));
  }

  // 检查文件大小（在服务层也会验证）
  if (file.size > MAX_FILE_SIZE) {
    return cb(new Error(`文件大小不能超过 ${MAX_FILE_SIZE / 1024 / 1024}MB`));
  }

  cb(null, true);
};

/**
 * 创建 multer 实例
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

/**
 * 需要认证的路由 - 需要有效的JWT令牌
 */

/**
 * 上传单个文件
 * 
 * POST /api/v1/upload
 * 功能：上传单个文件到服务器
 * 权限：需要认证（登录用户）
 * 请求体：multipart/form-data，字段名为 "file"
 * 返回：文件信息对象
 */
router.post(
  '/',
  authenticate,
  upload.single('file'),
  uploadController.uploadFile.bind(uploadController)
);

/**
 * 上传多个文件
 * 
 * POST /api/v1/upload/multiple
 * 功能：上传多个文件到服务器
 * 权限：需要认证（登录用户）
 * 请求体：multipart/form-data，字段名为 "files"
 * 返回：文件信息对象数组
 */
router.post(
  '/multiple',
  authenticate,
  upload.array('files', 10), // 最多10个文件
  uploadController.uploadMultipleFiles.bind(uploadController)
);

/**
 * 删除文件
 * 
 * DELETE /api/v1/upload/:filename
 * 功能：删除服务器上的指定文件
 * 权限：需要认证，管理员或文件上传者
 * 参数：文件名（不含路径）
 * 返回：删除结果
 */
router.delete(
  '/:filename',
  authenticate,
  uploadController.deleteFile.bind(uploadController)
);

/**
 * 获取文件列表（分页）
 * 
 * GET /api/v1/upload
 * 功能：获取上传文件列表（仅管理员）
 * 权限：需要认证，管理员角色
 * 查询参数：
 *   - page: 页码（默认1）
 *   - pageSize: 每页数量（默认20）
 * 返回：文件列表和分页信息
 */
router.get(
  '/',
  authenticate,
  authorize('ADMIN'),
  uploadController.listFiles.bind(uploadController)
);

export default router;