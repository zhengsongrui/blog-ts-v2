/**
 * 文章路由
 * 
 * 定义文章相关的API端点路由，包括：
 * - 文章的创建、读取、更新、删除（CRUD）
 * - 文章列表查询（支持分页、筛选、排序）
 * - 文章分类和标签关联
 * - 用户文章管理
 * 
 * 路由前缀：/api/v1/posts
 */

import { Router } from 'express';
import { postController } from '../controllers/post-controller';
import { authenticate, authorize, optionalAuthenticate } from '../middleware/auth-middleware';

const router = Router();

/**
 * 公开路由 - 不需要认证（部分接口可选认证）
 * 使用 optionalAuthenticate 中间件，允许认证用户访问更多内容
 */

/**
 * 获取文章列表（分页）
 * 
 * GET /api/v1/posts
 * 功能：获取文章列表，支持分页、筛选和排序
 * 权限：公开访问已发布文章，未发布文章需要管理员权限
 * 查询参数：
 *   - page: 页码（默认1）
 *   - pageSize: 每页数量（默认10）
 *   - sortBy: 排序字段（默认createdAt）
 *   - sortOrder: 排序顺序（默认desc）
 *   - status: 文章状态筛选（DRAFT, PUBLISHED, ARCHIVED）
 *   - authorId: 按作者筛选
 *   - categoryId: 按分类筛选
 *   - tagId: 按标签筛选
 * 返回：文章列表和分页信息
 */
router.get('/', optionalAuthenticate, postController.getPosts.bind(postController));

/**
 * 根据ID获取文章
 * 
 * GET /api/v1/posts/:id
 * 功能：根据文章ID获取文章详细信息
 * 权限：公开访问已发布文章，草稿和归档文章需要管理员权限
 * 参数：文章ID
 * 返回：文章详细信息（包含作者、分类、标签、评论）
 */
router.get('/:id', optionalAuthenticate, postController.getPostById.bind(postController));

/**
 * 根据slug获取文章
 * 
 * GET /api/v1/posts/slug/:slug
 * 功能：根据文章slug获取文章详细信息
 * 权限：公开访问已发布文章，草稿和归档文章需要管理员权限
 * 参数：文章slug（URL友好格式）
 * 返回：文章详细信息
 */
router.get('/slug/:slug', optionalAuthenticate, postController.getPostBySlug.bind(postController));

/**
 * 需要认证的路由 - 需要有效的JWT令牌
 */

/**
 * 创建文章
 * 
 * POST /api/v1/posts
 * 功能：创建新的文章
 * 权限：需要认证，编辑或管理员角色
 * 请求体：CreatePostDto
 * 返回：创建成功的文章信息
 */
router.post('/', authenticate, authorize('EDITOR', 'ADMIN'), postController.createPost.bind(postController));

/**
 * 更新文章
 * 
 * PATCH /api/v1/posts/:id
 * 功能：更新指定文章的信息
 * 权限：需要认证，作者本人或管理员/编辑角色
 * 参数：文章ID
 * 请求体：UpdatePostDto
 * 返回：更新后的文章信息
 */
router.patch('/:id', authenticate, (req, res, next) => {
  // 权限检查将在控制器中处理
  postController.updatePost(req, res, next);
});

/**
 * 删除文章
 * 
 * DELETE /api/v1/posts/:id
 * 功能：删除指定文章
 * 权限：需要认证，作者本人或管理员角色
 * 参数：文章ID
 * 返回：操作成功消息
 */
router.delete('/:id', authenticate, (req, res, next) => {
  // 权限检查将在控制器中处理
  postController.deletePost(req, res, next);
});

/**
 * 用户相关文章路由
 */

/**
 * 获取用户的文章列表
 * 
 * GET /api/v1/users/:userId/posts
 * 功能：获取指定用户的所有文章
 * 权限：公开访问已发布文章，非公开文章需要管理员权限或本人访问
 * 参数：用户ID
 * 查询参数：同文章列表查询参数
 * 返回：用户文章列表和分页信息
 */
router.get('/users/:userId/posts', optionalAuthenticate, postController.getUserPosts.bind(postController));

export default router;