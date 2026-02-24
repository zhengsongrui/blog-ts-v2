/**
 * 用户路由
 * 
 * 定义用户相关的API端点路由，包括：
 * - 用户注册和登录（公开访问）
 * - 用户信息管理（需要认证）
 * - 用户权限管理（需要管理员权限）
 * 
 * 路由前缀：/api/v1/users
 */

import { Router } from 'express';
import { userController } from '../controllers/user-controller';
import { authenticate, authorize } from '../middleware/auth-middleware';

const router = Router();

/**
 * 公开路由 - 不需要认证
 */

/**
 * 用户注册
 * 
 * POST /api/v1/users/register
 * 功能：创建新用户账户
 * 请求体：CreateUserDto
 * 返回：注册成功的用户信息（不含密码）
 */
router.post('/register', userController.register.bind(userController));

/**
 * 用户登录
 *
 * POST /api/v1/users/login
 * 功能：验证用户凭证并返回JWT令牌
 * 请求体：LoginDto
 * 返回：用户信息和JWT令牌
 */
router.post('/login', userController.login.bind(userController));

/**
 * 获取作者列表（公开）
 *
 * GET /api/v1/users/authors
 * 功能：获取所有作者的ID和用户名，用于文章列表筛选等场景
 * 返回：作者列表
 */
router.get('/authors', userController.getAuthors.bind(userController));

/**
 * 需要认证的路由 - 需要有效的JWT令牌
 */

/**
 * 获取当前用户信息
 * 
 * GET /api/v1/users/me
 * 功能：获取当前已认证用户的详细信息
 * 权限：任何已认证用户
 * 返回：当前用户信息
 */
router.get('/me', authenticate, userController.getCurrentUser.bind(userController));

/**
 * 更新当前用户信息
 * 
 * PATCH /api/v1/users/me
 * 功能：更新当前已认证用户的个人信息
 * 权限：任何已认证用户
 * 请求体：UpdateUserDto
 * 返回：更新后的用户信息
 */
router.patch('/me', authenticate, userController.updateCurrentUser.bind(userController));

/**
 * 需要管理员权限的路由
 */

/**
 * 获取用户列表（分页）
 * 
 * GET /api/v1/users
 * 功能：获取用户列表，支持分页、排序和筛选
 * 权限：管理员
 * 查询参数：
 *   - page: 页码（默认1）
 *   - pageSize: 每页数量（默认10）
 *   - sortBy: 排序字段
 *   - sortOrder: 排序顺序（asc/desc）
 * 返回：用户列表和分页信息
 */
router.get('/', authenticate, userController.getUsers.bind(userController));

/**
 * 根据ID获取用户信息
 * 
 * GET /api/v1/users/:id
 * 功能：根据用户ID获取用户详细信息
 * 权限：管理员或自己的用户信息
 * 参数：用户ID
 * 返回：用户信息
 */
router.get('/:id', authenticate, (req, res, next) => {
  // 权限检查：管理员可以查看任何用户，普通用户只能查看自己的信息
  if (req.user && (req.user.role === 'ADMIN' || req.user.userId === req.params.id)) {
    return userController.getUserById(req, res, next);
  } else {
    return res.status(403).json({
      success: false,
      data: null,
      error: {
        code: 'FORBIDDEN',
        message: '没有权限查看此用户信息',
      },
      message: '没有权限查看此用户信息',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * 更新用户信息（管理员）
 * 
 * PATCH /api/v1/users/:id
 * 功能：管理员更新指定用户的信息
 * 权限：管理员
 * 参数：用户ID
 * 请求体：UpdateUserDto
 * 返回：更新后的用户信息
 */
router.patch('/:id', authenticate, authorize('ADMIN'), userController.updateUser.bind(userController));

/**
 * 删除用户
 * 
 * DELETE /api/v1/users/:id
 * 功能：删除指定用户账户
 * 权限：管理员
 * 参数：用户ID
 * 返回：操作成功消息
 */
router.delete('/:id', authenticate, authorize('ADMIN'), userController.deleteUser.bind(userController));

export default router;