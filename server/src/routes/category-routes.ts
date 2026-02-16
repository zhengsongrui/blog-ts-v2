/**
 * 分类路由
 * 
 * 定义分类相关的API端点路由，包括：
 * - 分类的创建、读取、更新、删除（CRUD）
 * - 分类列表查询（支持分页、排序）
 * - 分类统计信息
 * 
 * 路由前缀：/api/v1/categories
 */

import { Router } from 'express';
import { categoryController } from '../controllers/category-controller';
import { authenticate, authorize, optionalAuthenticate } from '../middleware/auth-middleware';

const router = Router();

/**
 * 公开路由 - 不需要认证
 */

/**
 * 获取分类列表（分页）
 * 
 * GET /api/v1/categories
 * 功能：获取分类列表，支持分页和排序
 * 权限：公开访问
 * 查询参数：
 *   - page: 页码（默认1）
 *   - pageSize: 每页数量（默认10）
 *   - sortBy: 排序字段（默认createdAt）
 *   - sortOrder: 排序顺序（默认desc）
 * 返回：分类列表和分页信息
 */
router.get('/', categoryController.getCategories.bind(categoryController));

/**
 * 获取所有分类（不分页）
 * 
 * GET /api/v1/categories/all
 * 功能：获取所有分类，用于下拉选择等场景
 * 权限：公开访问
 * 返回：所有分类列表
 */
router.get('/all', categoryController.getAllCategories.bind(categoryController));

/**
 * 根据ID获取分类
 * 
 * GET /api/v1/categories/:id
 * 功能：根据分类ID获取分类详细信息
 * 权限：公开访问
 * 参数：分类ID
 * 返回：分类详细信息
 */
router.get('/:id', categoryController.getCategoryById.bind(categoryController));

/**
 * 根据slug获取分类
 * 
 * GET /api/v1/categories/slug/:slug
 * 功能：根据分类slug获取分类详细信息
 * 权限：公开访问
 * 参数：分类slug（URL友好格式）
 * 返回：分类详细信息
 */
router.get('/slug/:slug', categoryController.getCategoryBySlug.bind(categoryController));

/**
 * 获取分类统计信息
 * 
 * GET /api/v1/categories/:id/stats
 * 功能：获取分类的统计信息，如文章数量等
 * 权限：公开访问
 * 参数：分类ID
 * 返回：分类统计信息
 */
router.get('/:id/stats', categoryController.getCategoryStats.bind(categoryController));

/**
 * 需要认证的路由 - 需要有效的JWT令牌
 */

/**
 * 创建分类
 * 
 * POST /api/v1/categories
 * 功能：创建新的分类
 * 权限：需要认证，编辑或管理员角色
 * 请求体：CreateCategoryDto
 * 返回：创建成功的分类信息
 */
router.post('/', authenticate, authorize('EDITOR', 'ADMIN'), categoryController.createCategory.bind(categoryController));

/**
 * 批量创建分类
 * 
 * POST /api/v1/categories/batch
 * 功能：批量创建多个分类
 * 权限：需要认证，编辑或管理员角色
 * 请求体：CreateCategoryDto数组
 * 返回：创建成功的分类列表
 */
router.post('/batch', authenticate, authorize('EDITOR', 'ADMIN'), categoryController.createManyCategories.bind(categoryController));

/**
 * 更新分类
 * 
 * PATCH /api/v1/categories/:id
 * 功能：更新指定分类的信息
 * 权限：需要认证，编辑或管理员角色
 * 参数：分类ID
 * 请求体：UpdateCategoryDto
 * 返回：更新后的分类信息
 */
router.patch('/:id', authenticate, authorize('EDITOR', 'ADMIN'), categoryController.updateCategory.bind(categoryController));

/**
 * 删除分类
 * 
 * DELETE /api/v1/categories/:id
 * 功能：删除指定分类
 * 权限：需要认证，管理员角色
 * 参数：分类ID
 * 返回：操作成功消息
 */
router.delete('/:id', authenticate, authorize('ADMIN'), categoryController.deleteCategory.bind(categoryController));

export default router;