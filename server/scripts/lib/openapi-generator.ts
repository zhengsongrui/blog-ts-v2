/**
 * OpenAPI 生成器
 * 
 * 根据路由信息生成 OpenAPI 3.0 规范文档。
 */

import { RouteInfo, QueryParam, PathParam } from './route-parser';

/**
 * OpenAPI 规范生成选项
 */
export interface OpenAPIOptions {
  /** API 标题 */
  title: string;
  /** API 描述 */
  description: string;
  /** API 版本 */
  version: string;
  /** 服务器 URL 列表 */
  servers: Array<{ url: string; description: string }>;
  /** 安全方案配置 */
  securitySchemes: Record<string, any>;
  /** 全局响应格式 */
  defaultResponses: Record<string, any>;
  /** 是否包含示例数据 */
  includeExamples: boolean;
}

/**
 * 默认 OpenAPI 选项
 */
const DEFAULT_OPTIONS: OpenAPIOptions = {
  title: 'BlogV2 Backend API',
  description: '一个现代化的博客后端API，提供用户管理、文章发布、分类标签等功能。\n使用JWT令牌进行身份验证，支持基于角色的权限控制。',
  version: '1.0.0',
  servers: [
    { url: 'http://localhost:3000/api/v1', description: '本地开发服务器' },
    { url: 'https://api.example.com/api/v1', description: '生产服务器' }
  ],
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'JWT令牌认证'
    }
  },
  defaultResponses: {
    '200': {
      description: '成功响应',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/ApiResponse'
          }
        }
      }
    },
    '400': {
      description: '请求参数错误',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/ApiError'
          }
        }
      }
    },
    '401': {
      description: '未认证',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/ApiError'
          }
        }
      }
    },
    '403': {
      description: '权限不足',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/ApiError'
          }
        }
      }
    },
    '404': {
      description: '资源不存在',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/ApiError'
          }
        }
      }
    },
    '500': {
      description: '服务器内部错误',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/ApiError'
          }
        }
      }
    }
  },
  includeExamples: true
};

/**
 * 生成 OpenAPI 规范
 */
export function generateOpenAPISpec(
  routes: RouteInfo[],
  options: Partial<OpenAPIOptions> = {}
): any {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  // 分组路由按标签
  const routesByTag = groupRoutesByTag(routes);
  
  // 生成 OpenAPI 规范
  const spec: any = {
    openapi: '3.0.3',
    info: {
      title: mergedOptions.title,
      description: mergedOptions.description,
      version: mergedOptions.version,
      contact: {
        name: 'API 支持',
        email: 'support@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: mergedOptions.servers,
    tags: generateTags(routesByTag),
    paths: generatePaths(routes, mergedOptions),
    components: {
      securitySchemes: mergedOptions.securitySchemes,
      schemas: generateSchemas(),
      parameters: generateParameters()
    },
    security: [
      { bearerAuth: [] }
    ]
  };
  
  return spec;
}

/**
 * 按标签分组路由
 */
function groupRoutesByTag(routes: RouteInfo[]): Record<string, RouteInfo[]> {
  const grouped: Record<string, RouteInfo[]> = {};
  
  for (const route of routes) {
    for (const tag of route.tags) {
      if (!grouped[tag]) {
        grouped[tag] = [];
      }
      grouped[tag].push(route);
    }
  }
  
  return grouped;
}

/**
 * 生成标签定义
 */
function generateTags(routesByTag: Record<string, RouteInfo[]>): any[] {
  const tags: any[] = [];
  
  // 预定义的标签描述
  const tagDescriptions: Record<string, string> = {
    '用户': '用户注册、登录和个人信息管理',
    '文章': '文章的创建、读取、更新、删除和查询操作',
    '系统': '系统健康检查和基本信息',
    '分类': '分类的创建、读取、更新、删除和查询操作',
    '标签': '标签的创建、读取、更新、删除和查询操作'
  };
  
  for (const tagName of Object.keys(routesByTag)) {
    tags.push({
      name: tagName,
      description: tagDescriptions[tagName] || `${tagName}相关操作`
    });
  }
  
  return tags;
}

/**
 * 生成路径定义
 */
function generatePaths(routes: RouteInfo[], options: OpenAPIOptions): Record<string, any> {
  const paths: Record<string, any> = {};
  
  for (const route of routes) {
    const fullPath = route.prefix + route.path;
    
    if (!paths[fullPath]) {
      paths[fullPath] = {};
    }
    
    const pathItem = paths[fullPath];
    const operation = generateOperation(route, options);
    
    // 将操作添加到路径
    pathItem[route.method.toLowerCase()] = operation;
  }
  
  return paths;
}

/**
 * 生成操作定义
 */
function generateOperation(route: RouteInfo, options: OpenAPIOptions): any {
  const operation: any = {
    tags: route.tags,
    summary: route.summary,
    description: route.description,
    operationId: generateOperationId(route),
    parameters: generateParametersFromRoute(route),
    responses: generateResponsesFromRoute(route, options),
    security: []
  };
  
  // 添加请求体
  if (route.requestBodyType) {
    operation.requestBody = generateRequestBody(route);
  }
  
  // 添加安全要求
  if (route.requiresAuth) {
    operation.security.push({ bearerAuth: [] });
    
    // 如果有角色要求，添加安全扩展
    if (route.requiredRoles.length > 0) {
      operation.description += `\n\n**所需角色:** ${route.requiredRoles.join(', ')}`;
    }
  }
  
  return operation;
}

/**
 * 生成操作 ID
 */
function generateOperationId(route: RouteInfo): string {
  // 从路径和方法生成操作 ID
  const pathParts = route.path.split('/').filter(Boolean);
  const method = route.method.toLowerCase();
  
  // 将路径部分转换为驼峰命名
  const camelCasePath = pathParts.map((part, index) => {
    if (part.startsWith('{') && part.endsWith('}')) {
      return 'By' + part.slice(1, -1).charAt(0).toUpperCase() + part.slice(2, -1).toLowerCase();
    }
    return index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1);
  }).join('');
  
  // 组合方法 + 路径
  return method + camelCasePath.charAt(0).toUpperCase() + camelCasePath.slice(1);
}

/**
 * 从路由生成参数
 */
function generateParametersFromRoute(route: RouteInfo): any[] {
  const parameters: any[] = [];
  
  // 路径参数
  for (const param of route.pathParams) {
    parameters.push({
      name: param.name,
      in: 'path',
      required: true,
      description: param.description || `路径参数: ${param.name}`,
      schema: {
        type: mapTypeToOpenAPI(param.type)
      }
    });
  }
  
  // 查询参数
  for (const param of route.queryParams) {
    const schema: any = {
      type: mapTypeToOpenAPI(param.type)
    };
    
    if (param.enum) {
      schema.enum = param.enum;
    }
    
    if (param.defaultValue) {
      schema.default = param.defaultValue;
    }
    
    parameters.push({
      name: param.name,
      in: 'query',
      required: param.required,
      description: param.description || `查询参数: ${param.name}`,
      schema
    });
  }
  
  return parameters;
}

/**
 * 生成请求体
 */
function generateRequestBody(route: RouteInfo): any {
  const schemaName = route.requestBodyType || 'CreateUserDto';
  
  return {
    required: true,
    content: {
      'application/json': {
        schema: {
          $ref: `#/components/schemas/${schemaName}`
        },
        examples: generateExamples(schemaName)
      }
    }
  };
}

/**
 * 从路由生成响应
 */
function generateResponsesFromRoute(route: RouteInfo, options: OpenAPIOptions): Record<string, any> {
  const responses: Record<string, any> = {};
  
  // 根据 HTTP 方法添加默认响应
  const method = route.method;
  
  if (method === 'GET') {
    responses['200'] = {
      description: '成功获取数据',
      content: {
        'application/json': {
          schema: generateResponseSchema(route)
        }
      }
    };
    responses['404'] = options.defaultResponses['404'];
  } else if (method === 'POST') {
    responses['201'] = {
      description: '资源创建成功',
      content: {
        'application/json': {
          schema: generateResponseSchema(route)
        }
      }
    };
    responses['400'] = options.defaultResponses['400'];
  } else if (method === 'PUT' || method === 'PATCH') {
    responses['200'] = {
      description: '资源更新成功',
      content: {
        'application/json': {
          schema: generateResponseSchema(route)
        }
      }
    };
    responses['400'] = options.defaultResponses['400'];
    responses['404'] = options.defaultResponses['404'];
  } else if (method === 'DELETE') {
    responses['200'] = {
      description: '资源删除成功',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/ApiResponseMessage'
          }
        }
      }
    };
    responses['404'] = options.defaultResponses['404'];
  }
  
  // 添加认证相关响应
  if (route.requiresAuth) {
    responses['401'] = options.defaultResponses['401'];
    responses['403'] = options.defaultResponses['403'];
  }
  
  // 添加服务器错误响应
  responses['500'] = options.defaultResponses['500'];
  
  return responses;
}

/**
 * 生成响应模式
 */
function generateResponseSchema(route: RouteInfo): any {
  const responseType = route.responseType;
  
  if (responseType === 'User') {
    return { $ref: '#/components/schemas/ApiResponseUser' };
  } else if (responseType === 'Post') {
    return { $ref: '#/components/schemas/ApiResponsePost' };
  } else if (responseType === 'Category') {
    return { $ref: '#/components/schemas/ApiResponseCategory' };
  } else if (responseType === 'Tag') {
    return { $ref: '#/components/schemas/ApiResponseTag' };
  } else if (responseType && responseType.includes('[]')) {
    // 数组响应
    const itemType = responseType.replace('[]', '');
    return {
      allOf: [
        { $ref: '#/components/schemas/ApiResponse' },
        {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: { $ref: `#/components/schemas/${itemType}` }
            },
            pagination: {
              $ref: '#/components/schemas/PaginationInfo'
            }
          }
        }
      ]
    };
  } else if (responseType === 'AuthResponse') {
    return { $ref: '#/components/schemas/AuthResponse' };
  }
  
  // 默认响应
  return { $ref: '#/components/schemas/ApiResponse' };
}

/**
 * 生成示例数据
 */
function generateExamples(schemaName: string): Record<string, any> | undefined {
  const examples: Record<string, any> = {
    example: {}
  };
  
  // 基本示例数据
  if (schemaName === 'CreateUserDto') {
    examples.example = {
      username: 'john_doe',
      email: 'john@example.com',
      password: 'password123',
      avatar: 'https://example.com/avatar.jpg',
      bio: '一个热爱技术的开发者'
    };
  } else if (schemaName === 'LoginDto') {
    examples.example = {
      email: 'john@example.com',
      password: 'password123'
    };
  } else if (schemaName === 'CreatePostDto') {
    examples.example = {
      title: '我的第一篇博客文章',
      content: '这是文章内容，支持 **Markdown** 格式。',
      excerpt: '文章摘要',
      featuredImage: 'https://example.com/image.jpg',
      status: 'PUBLISHED',
      categoryIds: ['cat_123', 'cat_456'],
      tagIds: ['tag_123', 'tag_456']
    };
  } else if (schemaName === 'UpdatePostDto') {
    examples.example = {
      title: '更新后的文章标题',
      content: '更新后的文章内容...',
      status: 'PUBLISHED'
    };
  }
  
  return Object.keys(examples.example).length > 0 ? examples : undefined;
}

/**
 * 映射 TypeScript 类型到 OpenAPI 类型
 */
function mapTypeToOpenAPI(typescriptType: string): string {
  const typeMap: Record<string, string> = {
    'string': 'string',
    'number': 'number',
    'integer': 'integer',
    'boolean': 'boolean',
    'Date': 'string',
    'string[]': 'array',
    'number[]': 'array',
    'boolean[]': 'array'
  };
  
  return typeMap[typescriptType] || 'string';
}

/**
 * 生成组件模式
 */
function generateSchemas(): Record<string, any> {
  // 这里返回预定义的模式
  // 在实际实现中，可以从 TypeScript 接口或 Prisma 模型生成
  // 为了简单起见，我们返回一个空对象，实际内容可以从现有 openapi.yaml 复制
  return {};
}

/**
 * 生成组件参数
 */
function generateParameters(): Record<string, any> {
  return {
    pageQuery: {
      name: 'page',
      in: 'query',
      description: '页码（默认1）',
      required: false,
      schema: {
        type: 'integer',
        minimum: 1,
        default: 1
      }
    },
    pageSizeQuery: {
      name: 'pageSize',
      in: 'query',
      description: '每页数量（默认10）',
      required: false,
      schema: {
        type: 'integer',
        minimum: 1,
        maximum: 100,
        default: 10
      }
    },
    sortByQuery: {
      name: 'sortBy',
      in: 'query',
      description: '排序字段',
      required: false,
      schema: {
        type: 'string'
      }
    },
    sortOrderQuery: {
      name: 'sortOrder',
      in: 'query',
      description: '排序顺序',
      required: false,
      schema: {
        type: 'string',
        enum: ['asc', 'desc'],
        default: 'desc'
      }
    }
  };
}