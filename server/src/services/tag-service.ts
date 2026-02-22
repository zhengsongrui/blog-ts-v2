import prisma from '../utils/db';
import {
  Tag,
  CreateTagDto,
  UpdateTagDto,
  PaginationQuery,
  ApiError
} from '../types';
import {
  createTagSchema,
  updateTagSchema,
  paginationSchema,
  validate
} from '../utils/validation';

export class TagService {
  /**
   * 创建标签
   */
  async createTag(data: CreateTagDto): Promise<Tag> {
    const validatedData = validate(createTagSchema, data);

    // 检查名称和别名是否已存在
    await this.checkUniqueConstraints(validatedData.name, validatedData.slug);

    // 创建标签
    const tag = await prisma.tag.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
      },
    });

    return tag as Tag;
  }

  /**
   * 获取标签列表 (分页)
   */
  async getTags(pagination: PaginationQuery = {}) {
    const validatedPagination = validate(paginationSchema, pagination);
    const { page, pageSize, sortBy, sortOrder, name, slug } = validatedPagination;

    // 计算偏移量
    const skip = (page - 1) * pageSize;

    // 构建where条件
    const where: any = {};
    if (name) {
      where.name = {
        contains: name
      };
    }
    if (slug) {
      where.slug = {
        contains: slug
      };
    }

    // 构建排序条件
    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.createdAt = 'desc';
    }

    // 查询标签
    const [tags, total] = await Promise.all([
      prisma.tag.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
      }),
      prisma.tag.count({
        where,
      }),
    ]);

    return {
      data: tags as Tag[],
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
   * 获取所有标签（不分页，用于下拉选择等场景）
   */
  async getAllTags(): Promise<Tag[]> {
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return tags as Tag[];
  }

  /**
   * 根据ID获取标签
   */
  async getTagById(id: string): Promise<Tag> {
    const tag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!tag) {
      throw {
        code: 'TAG_NOT_FOUND',
        message: '标签不存在',
      } as ApiError;
    }

    return tag as Tag;
  }

  /**
   * 根据slug获取标签
   */
  async getTagBySlug(slug: string): Promise<Tag> {
    const tag = await prisma.tag.findUnique({
      where: { slug },
    });

    if (!tag) {
      throw {
        code: 'TAG_NOT_FOUND',
        message: '标签不存在',
      } as ApiError;
    }

    return tag as Tag;
  }

  /**
   * 更新标签
   */
  async updateTag(id: string, data: UpdateTagDto): Promise<Tag> {
    const validatedData = validate(updateTagSchema, data);

    // 检查标签是否存在
    const tag = await prisma.tag.findUnique({
      where: { id },
    });
    if (!tag) {
      throw {
        code: 'TAG_NOT_FOUND',
        message: '标签不存在',
      } as ApiError;
    }

    // 如果需要更新名称或别名，检查唯一性
    if (validatedData.name || validatedData.slug) {
      await this.checkUniqueConstraints(
        validatedData.name || tag.name,
        validatedData.slug || tag.slug,
        id // 排除当前标签
      );
    }

    // 更新标签
    const updatedTag = await prisma.tag.update({
      where: { id },
      data: validatedData,
    });

    return updatedTag as Tag;
  }

  /**
   * 删除标签
   */
  async deleteTag(id: string): Promise<void> {
    // 检查标签是否存在
    const tag = await prisma.tag.findUnique({
      where: { id },
    });
    if (!tag) {
      throw {
        code: 'TAG_NOT_FOUND',
        message: '标签不存在',
      } as ApiError;
    }

    // 检查是否有文章关联该标签
    const postCount = await prisma.postTag.count({
      where: { tagId: id },
    });

    if (postCount > 0) {
      throw {
        code: 'TAG_IN_USE',
        message: '无法删除，该标签下有文章关联',
        details: { postCount },
      } as ApiError;
    }

    // 删除标签
    await prisma.tag.delete({
      where: { id },
    });
  }

  /**
   * 检查标签名称和别名的唯一性
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

    const existingTag = await prisma.tag.findFirst({
      where: whereClause,
    });

    if (existingTag) {
      if (existingTag.name === name) {
        throw {
          code: 'TAG_NAME_EXISTS',
          message: '标签名称已存在',
        } as ApiError;
      }
      if (existingTag.slug === slug) {
        throw {
          code: 'TAG_SLUG_EXISTS',
          message: '标签别名已存在',
        } as ApiError;
      }
    }
  }

  /**
   * 批量创建标签
   */
  async createManyTags(data: CreateTagDto[]): Promise<Tag[]> {
    // 验证所有数据
    const validatedData = data.map(item => validate(createTagSchema, item));

    // 检查所有名称和别名的唯一性
    for (const item of validatedData) {
      await this.checkUniqueConstraints(item.name, item.slug);
    }

    // 批量创建标签（使用事务）
    const tags: Tag[] = [];
    for (const item of validatedData) {
      const tag = await prisma.tag.create({
        data: item,
      });
      tags.push(tag as Tag);
    }

    return tags;
  }

  /**
   * 获取标签统计信息（文章数量等）
   */
  async getTagStats(tagId: string) {
    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
    });

    if (!tag) {
      throw {
        code: 'TAG_NOT_FOUND',
        message: '标签不存在',
      } as ApiError;
    }

    // 获取文章计数
    const postCount = await prisma.postTag.count({
      where: { tagId: tagId },
    });

    return {
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      postCount: postCount,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    };
  }

  /**
   * 根据文章ID获取标签
   */
  async getTagsByPostId(postId: string): Promise<Tag[]> {
    const postTags = await prisma.postTag.findMany({
      where: { postId },
      include: {
        tag: true,
      },
    });

    return postTags.map(pt => pt.tag as Tag);
  }

  /**
   * 批量关联标签到文章
   */
  async associateTagsToPost(postId: string, tagIds: string[]): Promise<void> {
    // 检查所有标签是否存在
    const existingTags = await prisma.tag.findMany({
      where: {
        id: { in: tagIds },
      },
    });

    if (existingTags.length !== tagIds.length) {
      const foundIds = existingTags.map(t => t.id);
      const missingIds = tagIds.filter(id => !foundIds.includes(id));
      throw {
        code: 'TAG_NOT_FOUND',
        message: '部分标签不存在',
        details: { missingIds },
      } as ApiError;
    }

    // 删除旧的关联
    await prisma.postTag.deleteMany({
      where: { postId },
    });

    // 创建新的关联
    if (tagIds.length > 0) {
      await prisma.postTag.createMany({
        data: tagIds.map(tagId => ({
          postId,
          tagId,
        })),
      });
    }
  }
}

export const tagService = new TagService();