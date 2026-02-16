/**
 * 标签路由
 * 
 * 定义标签相关的API端点路由，包括：
 * - 标签的创建、读取、更新、删除（CRUD）
 * - 标签列表查询（支持分页、排序）
 * - 标签统计信息
 * - 文章标签关联
 * 
 * 路由前缀：/api/v1/tags
 */

import { Router } from 'express';
import { tagController } from '../controllers/tag-controller';
import { authenticate, authorize, optionalAuthenticate } from '../middleware/auth-middleware';

const router = Router();

/**
 * 公开路由 - 不需要认证
 */

/**
 * 获取标签列表（分页）
 * 
 * GET /api/v1/tags
 * 功能：获取标签列表，支持分页和排序
 * 权限：公开访问
 * 查询参数：
 *   - page: 页码（默认1）
 *   - pageSize: 每页数量（默认10）
 *   - sortBy: 排序字段（默认createdAt）
 *   - sortOrder: 排序顺序（默认desc）
 * 返回：标签列表和分页信息
 */
router.get('/', tagController.getTags.bind(tagController));

/**
 * 获取所有标签（不分页）
 * 
 * GET /api/v1/tags/all
 * 功能：获取所有标签，用于下拉选择等场景
 * 权限：公开访问
 * 返回：所有标签列表
 */
router.get('/all', tagController.getAllTags.bind(tagController));

/**
 * 根据ID获取标签
 * 
 * GET /api/v1/tags/:id
 * 功能：根据标签ID获取标签详细信息
 * 权限：公开访问
 * 参数：标签ID
 * 返回：标签详细信息
 */
router.get('/:id', tagController.getTagById.bind(tagController));

/**
 * 根据slug获取标签
 * 
 * GET /api/v1/tags/slug/:slug
 * 功能：根据标签slug获取标签详细信息
 * 权限：公开访问
 * 参数：标签slug（URL友好格式）
 * 返回：标签详细信息
 */
router.get('/slug/:slug', tagController.getTagBySlug.bind(tagController));

/**
 * 获取标签统计信息
 * 
 * GET /api/v1/tags/:id/stats
 * 功能：获取标签的统计信息，如文章数量等
 * 权限：公开访问
 * 参数：标签ID
 * 返回：标签统计信息
 */
router.get('/:id/stats', tagController.getTagStats.bind(tagController));

/**
 * 获取文章的所有标签
 * 
 * GET /api/v1/tags/posts/:postId
 * 功能：获取指定文章的所有标签
 * 权限：公开访问
 * 参数：文章ID
 * 返回：文章标签列表
 */
router.get('/posts/:postId', tagController.getTagsByPostId.bind(tagController));

/**
 * 需要认证的路由 - 需要有效的JWT令牌
 */

/**
 * 创建标签
 * 
 * POST /api/v1/tags
 * 功能：创建新的标签
 * 权限：需要认证，编辑或管理员角色
 * 请求体：CreateTagDto
 * 返回：创建成功的标签信息
 */
router.post('/', authenticate, authorize('EDITOR', 'ADMIN'), tagController.createTag.bind(tagController));

/**
 * 批量创建标签
 * 
 * POST /api/v1/tags/batch
 * 功能：批量创建多个标签
 * 权限：需要认证，编辑或管理员角色
 * 请求体：CreateTagDto数组
 * 返回：创建成功的标签列表
 */
router.post('/batch', authenticate, authorize('EDITOR', 'ADMIN'), tagController.createManyTags.bind(tagController));

/**
 * 更新标签
 * 
 * PATCH /api/v1/tags/:id
 * 功能：更新指定标签的信息
 * 权限：需要认证，编辑或管理员角色
 * 参数：标签ID
 * 请求体：UpdateTagDto
 * 返回：更新后的标签信息
 */
router.patch('/:id', authenticate, authorize('EDITOR', 'ADMIN'), tagController.updateTag.bind(tagController));

/**
 * 删除标签
 * 
 * DELETE /api/v1/tags/:id
 * 功能：删除指定标签
 * 权限：需要认证，管理员角色
 * 参数：标签ID
 * 返回：操作成功消息
 */
router.delete('/:id', authenticate, authorize('ADMIN'), tagController.deleteTag.bind(tagController));

export default router;