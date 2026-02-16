import prisma from '../utils/db';
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  PaginationQuery,
  ApiError
} from '../types';
import {
  createCategorySchema,
  updateCategorySchema,
  paginationSchema,
  validate
} from '../utils/validation';

export class CategoryService {
  /**
   * 创建分类
   */
  async createCategory(data: CreateCategoryDto): Promise<Category> {
    const validatedData = validate(createCategorySchema, data);

    // 检查名称和别名是否已存在
    await this.checkUniqueConstraints(validatedData.name, validatedData.slug);

    // 创建分类
    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
      },
    });

    return category as Category;
  }

  /**
   * 获取分类列表 (分页)
   */
  async getCategories(pagination: PaginationQuery = {}) {
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

    // 查询分类
    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        skip,
        take: pageSize,
        orderBy,
      }),
      prisma.category.count(),
    ]);

    return {
      data: categories as Category[],
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
   * 获取所有分类（不分页，用于下拉选择等场景）
   */
  async getAllCategories(): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return categories as Category[];
  }

  /**
   * 根据ID获取分类
   */
  async getCategoryById(id: string): Promise<Category> {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw {
        code: 'CATEGORY_NOT_FOUND',
        message: '分类不存在',
      } as ApiError;
    }

    return category as Category;
  }

  /**
   * 根据slug获取分类
   */
  async getCategoryBySlug(slug: string): Promise<Category> {
    const category = await prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      throw {
        code: 'CATEGORY_NOT_FOUND',
        message: '分类不存在',
      } as ApiError;
    }

    return category as Category;
  }

  /**
   * 更新分类
   */
  async updateCategory(id: string, data: UpdateCategoryDto): Promise<Category> {
    const validatedData = validate(updateCategorySchema, data);

    // 检查分类是否存在
    const category = await prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw {
        code: 'CATEGORY_NOT_FOUND',
        message: '分类不存在',
      } as ApiError;
    }

    // 如果需要更新名称或别名，检查唯一性
    if (validatedData.name || validatedData.slug) {
      await this.checkUniqueConstraints(
        validatedData.name || category.name,
        validatedData.slug || category.slug,
        id // 排除当前分类
      );
    }

    // 更新分类
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: validatedData,
    });

    return updatedCategory as Category;
  }

  /**
   * 删除分类
   */
  async deleteCategory(id: string): Promise<void> {
    // 检查分类是否存在
    const category = await prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw {
        code: 'CATEGORY_NOT_FOUND',
        message: '分类不存在',
      } as ApiError;
    }

    // 检查是否有文章关联该分类
    const postCount = await prisma.postCategory.count({
      where: { categoryId: id },
    });

    if (postCount > 0) {
      throw {
        code: 'CATEGORY_IN_USE',
        message: '无法删除，该分类下有文章关联',
        details: { postCount },
      } as ApiError;
    }

    // 删除分类
    await prisma.category.delete({
      where: { id },
    });
  }

  /**
   * 检查分类名称和别名的唯一性
   */
  private async checkUniqueConstraints(
    name: string,
    slug: string,
    excludeId?: string
  ): Promise<void> {
    const whereClause: any = {
      OR: [
        { name },
        { slug },
      ],
    };

    if (excludeId) {
      whereClause.NOT = { id: excludeId };
    }

    const existingCategory = await prisma.category.findFirst({
      where: whereClause,
    });

    if (existingCategory) {
      if (existingCategory.name === name) {
        throw {
          code: 'CATEGORY_NAME_EXISTS',
          message: '分类名称已存在',
        } as ApiError;
      }
      if (existingCategory.slug === slug) {
        throw {
          code: 'CATEGORY_SLUG_EXISTS',
          message: '分类别名已存在',
        } as ApiError;
      }
    }
  }

  /**
   * 批量创建分类
   */
  async createManyCategories(data: CreateCategoryDto[]): Promise<Category[]> {
    // 验证所有数据
    const validatedData = data.map(item => validate(createCategorySchema, item));

    // 检查所有名称和别名的唯一性
    for (const item of validatedData) {
      await this.checkUniqueConstraints(item.name, item.slug);
    }

    // 批量创建分类（使用事务）
    const categories: Category[] = [];
    for (const item of validatedData) {
      const category = await prisma.category.create({
        data: item,
      });
      categories.push(category as Category);
    }

    return categories;
  }

  /**
   * 获取分类统计信息（文章数量等）
   */
  async getCategoryStats(categoryId: string) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!category) {
      throw {
        code: 'CATEGORY_NOT_FOUND',
        message: '分类不存在',
      } as ApiError;
    }

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      postCount: category._count.posts,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}

export const categoryService = new CategoryService();