import prisma from '../utils/db';
import { 
  Post, 
  CreatePostDto, 
  UpdatePostDto,
  PaginationQuery,
  ApiError 
} from '../types';
import { 
  createPostSchema, 
  updatePostSchema,
  paginationSchema,
  validate 
} from '../utils/validation';

export class PostService {
  /**
   * 创建文章
   */
  async createPost(data: CreatePostDto, authorId: string): Promise<Post> {
    const validatedData = validate(createPostSchema, data);
    
    // 生成slug
    const slug = this.generateSlug(validatedData.title);
    
    // 创建文章
    const post = await prisma.post.create({
      data: {
        title: validatedData.title,
        slug,
        content: validatedData.content,
        excerpt: validatedData.excerpt,
        coverImage: validatedData.coverImage,
        status: validatedData.status,
        authorId,
        publishedAt: validatedData.status === 'PUBLISHED' ? new Date() : null,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
      },
    });

    // 添加分类和标签
    if (validatedData.categoryIds && validatedData.categoryIds.length > 0) {
      await prisma.postCategory.createMany({
        data: validatedData.categoryIds.map(categoryId => ({
          postId: post.id,
          categoryId,
        })),
      });
    }

    if (validatedData.tagIds && validatedData.tagIds.length > 0) {
      await prisma.postTag.createMany({
        data: validatedData.tagIds.map(tagId => ({
          postId: post.id,
          tagId,
        })),
      });
    }

    // 重新获取完整文章数据
    const fullPost = await this.getPostById(post.id);
    return fullPost;
  }

  /**
   * 获取文章列表 (分页)
   */
  async getPosts(pagination: PaginationQuery, filters: { status?: string; authorId?: string; categoryId?: string; tagId?: string; title?: string } = {}) {
    const validatedPagination = validate(paginationSchema, pagination);
    const { page, pageSize, sortBy, sortOrder } = validatedPagination;

    // 计算偏移量
    const skip = (page - 1) * pageSize;

    // 构建查询条件
    const where: any = {};
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.authorId) {
      where.authorId = filters.authorId;
    }
    if (filters.title) {
      where.title = {
        contains: filters.title,
      };
    }
    if (filters.categoryId) {
      where.categories = {
        some: {
          categoryId: filters.categoryId,
        },
      };
    }
    if (filters.tagId) {
      where.tags = {
        some: {
          tagId: filters.tagId,
        },
      };
    }

    // 构建排序条件
    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.createdAt = 'desc';
    }

    // 查询文章
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              email: true,
              avatar: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          categories: {
            include: {
              category: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    // 转换数据格式
    const formattedPosts = posts.map(post => ({
      ...post,
      categories: post.categories.map(pc => pc.category),
      tags: post.tags.map(pt => pt.tag),
    }));

    return {
      data: formattedPosts as Post[],
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
   * 根据ID获取文章
   */
  async getPostById(id: string): Promise<Post> {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                email: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!post) {
      throw {
        code: 'POST_NOT_FOUND',
        message: '文章不存在',
      } as ApiError;
    }

    // 转换数据格式
    const formattedPost = {
      ...post,
      categories: post.categories.map(pc => pc.category),
      tags: post.tags.map(pt => pt.tag),
    };

    return formattedPost as Post;
  }

  /**
   * 根据slug获取文章
   */
  async getPostBySlug(slug: string): Promise<Post> {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                email: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!post) {
      throw {
        code: 'POST_NOT_FOUND',
        message: '文章不存在',
      } as ApiError;
    }

    // 转换数据格式
    const formattedPost = {
      ...post,
      categories: post.categories.map(pc => pc.category),
      tags: post.tags.map(pt => pt.tag),
    };

    return formattedPost as Post;
  }

  /**
   * 更新文章
   */
  async updatePost(id: string, data: UpdatePostDto): Promise<Post> {
    const validatedData = validate(updatePostSchema, data);

    // 检查文章是否存在
    const post = await prisma.post.findUnique({
      where: { id },
    });
    if (!post) {
      throw {
        code: 'POST_NOT_FOUND',
        message: '文章不存在',
      } as ApiError;
    }

    // 更新文章数据
    const updateData: any = { ...validatedData };
    if (validatedData.title && validatedData.title !== post.title) {
      updateData.slug = this.generateSlug(validatedData.title);
    }

    // 更新文章
    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
      },
    });

    // 更新分类关联
    if (validatedData.categoryIds !== undefined) {
      await prisma.postCategory.deleteMany({
        where: { postId: id },
      });
      if (validatedData.categoryIds.length > 0) {
        await prisma.postCategory.createMany({
          data: validatedData.categoryIds.map(categoryId => ({
            postId: id,
            categoryId,
          })),
        });
      }
    }

    // 更新标签关联
    if (validatedData.tagIds !== undefined) {
      await prisma.postTag.deleteMany({
        where: { postId: id },
      });
      if (validatedData.tagIds.length > 0) {
        await prisma.postTag.createMany({
          data: validatedData.tagIds.map(tagId => ({
            postId: id,
            tagId,
          })),
        });
      }
    }

    // 重新获取完整文章数据
    const fullPost = await this.getPostById(id);
    return fullPost;
  }

  /**
   * 删除文章
   */
  async deletePost(id: string): Promise<void> {
    // 检查文章是否存在
    const post = await prisma.post.findUnique({
      where: { id },
    });
    if (!post) {
      throw {
        code: 'POST_NOT_FOUND',
        message: '文章不存在',
      } as ApiError;
    }

    // 删除文章（级联删除关联记录）
    await prisma.post.delete({
      where: { id },
    });
  }

  /**
   * 生成slug
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }
}

export const postService = new PostService();