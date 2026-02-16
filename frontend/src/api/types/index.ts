/**
 * API 类型定义统一导出
 */

// 通用类型
export type {
  ApiError,
  ApiResponse,
  ApiResponseMessage,
  PaginationInfo,
  PaginatedResponse,
  PaginationQuery,
  SortQuery,
  CommonQueryParams,
} from './common.types';

export { UserRole, PostStatus } from './common.types';

// 用户相关类型
export type {
  User,
  CreateUserDto,
  UpdateUserDto,
  LoginDto,
  AuthResponse,
  ApiResponseUser,
  PaginatedResponseUser,
  UserQueryParams,
} from './user.types';

// 文章相关类型
export type {
  Post,
  CreatePostDto,
  UpdatePostDto,
  ApiResponsePost,
  PaginatedResponsePost,
  PostQueryParams,
  UserPostsQueryParams,
} from './post.types';

// 分类相关类型
export type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  ApiResponseCategory,
  PaginatedResponseCategory,
  CategoryQueryParams,
  CategoryStats,
  ApiResponseCategoryStats,
  BatchCreateCategoryDto,
} from './category.types';

// 标签相关类型
export type {
  Tag,
  CreateTagDto,
  UpdateTagDto,
  ApiResponseTag,
  PaginatedResponseTag,
  TagQueryParams,
  TagStats,
  ApiResponseTagStats,
  BatchCreateTagDto,
  PostTagsQueryParams,
} from './tag.types';

// 系统相关类型
export type {
  HealthResponse,
  WelcomeResponse,
} from './system.types';