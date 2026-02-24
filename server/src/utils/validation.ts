import { z } from 'zod';

// 用户验证模式
export const createUserSchema = z.object({
  username: z.string()
    .min(3, '用户名至少3个字符')
    .max(50, '用户名最多50个字符')
    .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线'),
  email: z.string()
    .email('邮箱格式不正确')
    .max(100, '邮箱最多100个字符'),
  password: z.string()
    .min(8, '密码至少8个字符')
    .max(100, '密码最多100个字符')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含大小写字母和数字'),
  avatar: z.string().url('头像必须是有效的URL').optional(),
  role: z.enum(['ADMIN', 'EDITOR', 'USER']).optional().default('USER'),
});

export const updateUserSchema = z.object({
  username: z.string()
    .min(3, '用户名至少3个字符')
    .max(50, '用户名最多50个字符')
    .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线')
    .optional(),
  email: z.string()
    .email('邮箱格式不正确')
    .max(100, '邮箱最多100个字符')
    .optional(),
  avatar: z.string().url('头像必须是有效的URL').optional(),
  password: z.string()
    .min(8, '密码至少8个字符')
    .max(100, '密码最多100个字符')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含大小写字母和数字')
    .optional(),
  role: z.enum(['ADMIN', 'EDITOR', 'USER']).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: '至少提供一个更新字段',
});

export const loginSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(1, '密码不能为空'),
});

// 文章验证模式
export const createPostSchema = z.object({
  title: z.string()
    .min(3, '标题至少3个字符')
    .max(200, '标题最多200个字符'),
  content: z.string()
    .min(10, '内容至少10个字符')
    .max(50000, '内容最多50000个字符'),
  excerpt: z.string()
    .max(500, '摘要最多500个字符')
    .optional(),
  coverImage: z.string().url('封面图必须是有效的URL').optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional().default('DRAFT'),
  categoryIds: z.array(z.string().cuid()).optional().default([]),
  tagIds: z.array(z.string().cuid()).optional().default([]),
});

export const updatePostSchema = z.object({
  title: z.string()
    .min(3, '标题至少3个字符')
    .max(200, '标题最多200个字符')
    .optional(),
  content: z.string()
    .min(10, '内容至少10个字符')
    .max(50000, '内容最多50000个字符')
    .optional(),
  excerpt: z.string()
    .max(500, '摘要最多500个字符')
    .optional(),
  coverImage: z.string().url('封面图必须是有效的URL').optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  categoryIds: z.array(z.string().cuid()).optional(),
  tagIds: z.array(z.string().cuid()).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: '至少提供一个更新字段',
});

// 分类验证模式
export const createCategorySchema = z.object({
  name: z.string()
    .min(2, '分类名称至少2个字符')
    .max(50, '分类名称最多50个字符'),
  slug: z.string()
    .min(2, '分类别名至少2个字符')
    .max(50, '分类别名最多50个字符')
    .regex(/^[a-z0-9-]+$/, '分类别名只能包含小写字母、数字和连字符'),
  description: z.string().max(200, '描述最多200个字符').optional(),
});

export const updateCategorySchema = z.object({
  name: z.string()
    .min(2, '分类名称至少2个字符')
    .max(50, '分类名称最多50个字符')
    .optional(),
  slug: z.string()
    .min(2, '分类别名至少2个字符')
    .max(50, '分类别名最多50个字符')
    .regex(/^[a-z0-9-]+$/, '分类别名只能包含小写字母、数字和连字符')
    .optional(),
  description: z.string().max(200, '描述最多200个字符').optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: '至少提供一个更新字段',
});

// 标签验证模式
export const createTagSchema = z.object({
  name: z.string()
    .min(2, '标签名称至少2个字符')
    .max(50, '标签名称最多50个字符'),
  slug: z.string()
    .min(2, '标签别名至少2个字符')
    .max(50, '标签别名最多50个字符')
    .regex(/^[a-z0-9-]+$/, '标签别名只能包含小写字母、数字和连字符'),
});

export const updateTagSchema = z.object({
  name: z.string()
    .min(2, '标签名称至少2个字符')
    .max(50, '标签名称最多50个字符')
    .optional(),
  slug: z.string()
    .min(2, '标签别名至少2个字符')
    .max(50, '标签别名最多50个字符')
    .regex(/^[a-z0-9-]+$/, '标签别名只能包含小写字母、数字和连字符')
    .optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: '至少提供一个更新字段',
});

// 评论验证模式
export const createCommentSchema = z.object({
  content: z.string()
    .min(1, '评论内容不能为空')
    .max(2000, '评论内容最多2000个字符'),
  postId: z.string().cuid('文章ID格式不正确'),
  parentId: z.string().cuid('父评论ID格式不正确').optional(),
});

export const updateCommentSchema = z.object({
  content: z.string()
    .min(1, '评论内容不能为空')
    .max(2000, '评论内容最多2000个字符')
    .optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: '至少提供一个更新字段',
});

// 分页验证模式
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  name: z.string().optional(),
  slug: z.string().optional(),
});

// 验证函数
export const validate = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    throw {
      code: 'VALIDATION_ERROR',
      message: '输入验证失败',
      details: errors,
    };
  }
  return result.data;
};