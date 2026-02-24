import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../utils/db';
import { config } from '../config';
import { 
  User, 
  CreateUserDto, 
  UpdateUserDto, 
  LoginDto, 
  AuthResponse,
  PaginationQuery,
  ApiError 
} from '../types';
import { 
  createUserSchema, 
  updateUserSchema, 
  loginSchema,
  paginationSchema,
  validate 
} from '../utils/validation';

export class UserService {
  /**
   * 创建用户
   */
  async createUser(data: CreateUserDto): Promise<User> {
    const validatedData = validate(createUserSchema, data);
    
    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    if (existingUser) {
      throw {
        code: 'EMAIL_EXISTS',
        message: '邮箱已被注册',
      } as ApiError;
    }

    // 检查用户名是否已存在
    const existingUsername = await prisma.user.findUnique({
      where: { username: validatedData.username },
    });
    if (existingUsername) {
      throw {
        code: 'USERNAME_EXISTS',
        message: '用户名已被使用',
      } as ApiError;
    }

    // 哈希密码
    const passwordHash = await bcrypt.hash(validatedData.password, config.security.bcryptRounds);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        passwordHash,
        avatar: validatedData.avatar,
        role: validatedData.role,
      },
    });

    // 移除密码哈希
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  /**
   * 用户登录
   */
  async login(data: LoginDto): Promise<AuthResponse> {
    const validatedData = validate(loginSchema, data);

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    if (!user) {
      throw {
        code: 'INVALID_CREDENTIALS',
        message: '邮箱或密码错误',
      } as ApiError;
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(validatedData.password, user.passwordHash);
    if (!isValidPassword) {
      throw {
        code: 'INVALID_CREDENTIALS',
        message: '邮箱或密码错误',
      } as ApiError;
    }

    // 生成 JWT token - 使用数字过期时间避免类型问题
    const expiresInSeconds = 7 * 24 * 60 * 60; // 7天，单位秒
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: expiresInSeconds }
    );

    // 移除密码哈希
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword as User,
      token,
      expiresIn: expiresInSeconds,
    };
  }

  /**
   * 获取用户列表 (分页)
   */
  async getUsers(pagination: PaginationQuery) {
    const validatedPagination = validate(paginationSchema, pagination);
    const { page, pageSize, sortBy, sortOrder } = validatedPagination;

    // 计算偏移量
    const skip = (page - 1) * pageSize;

    // 构建排序条件
    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.createdAt = 'desc';
    }

    // 查询用户
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: pageSize,
        orderBy,
        select: {
          id: true,
          username: true,
          email: true,
          avatar: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count(),
    ]);

    return {
      data: users as User[],
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        hasNext: page * pageSize < total,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * 根据ID获取用户
   */
  async getUserById(id: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw {
        code: 'USER_NOT_FOUND',
        message: '用户不存在',
      } as ApiError;
    }

    return user as User;
  }

  /**
   * 更新用户
   */
  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    const validatedData = validate(updateUserSchema, data);

    // 检查邮箱是否已被其他用户使用
    if (validatedData.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: validatedData.email,
          NOT: { id },
        },
      });
      if (existingUser) {
        throw {
          code: 'EMAIL_EXISTS',
          message: '邮箱已被其他用户使用',
        } as ApiError;
      }
    }

    // 检查用户名是否已被其他用户使用
    if (validatedData.username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: validatedData.username,
          NOT: { id },
        },
      });
      if (existingUser) {
        throw {
          code: 'USERNAME_EXISTS',
          message: '用户名已被其他用户使用',
        } as ApiError;
      }
    }

    // 处理密码更新
    const updateData = { ...validatedData } as any;
    if (updateData.password) {
      updateData.passwordHash = await bcrypt.hash(updateData.password, config.security.bcryptRounds);
      delete updateData.password;
    }

    // 更新用户
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser as User;
  }

  /**
   * 删除用户
   */
  async deleteUser(id: string): Promise<void> {
    // 检查用户是否存在
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw {
        code: 'USER_NOT_FOUND',
        message: '用户不存在',
      } as ApiError;
    }

    // 删除用户
    await prisma.user.delete({
      where: { id },
    });
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(userId: string): Promise<User> {
    return this.getUserById(userId);
  }

  /**
   * 更新当前用户信息
   */
  async updateCurrentUser(userId: string, data: UpdateUserDto): Promise<User> {
    return this.updateUser(userId, data);
  }

  /**
   * 获取作者列表（公开）
   * 返回所有用户的ID和用户名，用于文章列表筛选等场景
   */
  async getAuthors(): Promise<{ id: string; username: string }[]> {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
      },
      orderBy: {
        username: 'asc',
      },
    });
    return users;
  }
}

export const userService = new UserService();