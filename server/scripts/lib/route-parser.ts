/**
 * 路由解析器
 * 
 * 解析 Express 路由文件，提取路由信息。
 * 支持解析 JSDoc 注释、HTTP 方法、路径、认证要求等。
 */

import fs from 'fs';
import path from 'path';

/**
 * 路由信息接口
 */
export interface RouteInfo {
  /** 路由路径（如 /users/register） */
  path: string;
  /** HTTP 方法（GET, POST, PUT, PATCH, DELETE） */
  method: string;
  /** 路由描述（从 JSDoc 提取） */
  description: string;
  /** 路由功能摘要 */
  summary: string;
  /** 是否需要认证 */
  requiresAuth: boolean;
  /** 所需角色（数组） */
  requiredRoles: string[];
  /** 请求体 DTO 类型（如果有） */
  requestBodyType?: string;
  /** 响应类型 */
  responseType?: string;
  /** 查询参数列表 */
  queryParams: QueryParam[];
  /** 路径参数列表 */
  pathParams: PathParam[];
  /** 原始 JSDoc 注释 */
  rawComment: string;
  /** 路由处理器名称 */
  handler?: string;
  /** 路由前缀（如 /api/v1） */
  prefix: string;
  /** 标签（用于 OpenAPI 分组） */
  tags: string[];
}

/**
 * 查询参数接口
 */
export interface QueryParam {
  name: string;
  type: string;
  description: string;
  required: boolean;
  defaultValue?: string;
  enum?: string[];
}

/**
 * 路径参数接口
 */
export interface PathParam {
  name: string;
  type: string;
  description: string;
}

/**
 * 解析路由文件
 */
export async function parseRouteFile(filePath: string): Promise<RouteInfo[]> {
  const content = fs.readFileSync(filePath, 'utf8');
  const routes: RouteInfo[] = [];
  
  // 提取文件中的路由前缀信息
  const prefix = extractRoutePrefix(content);
  
  // 根据文件类型确定标签
  const tags = extractTagsFromFileName(path.basename(filePath));
  
  // 分割为行
  const lines = content.split('\n');
  
  // 解析路由
  let currentComment = '';
  let lineNumber = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // 收集多行注释
    if (line.startsWith('/**')) {
      currentComment = line;
      let j = i + 1;
      while (j < lines.length && !lines[j].trim().includes('*/')) {
        currentComment += '\n' + lines[j];
        j++;
      }
      if (j < lines.length) {
        currentComment += '\n' + lines[j];
      }
      i = j;
      continue;
    }
    
    // 检查是否包含路由定义
    if (line.includes('router.') && (line.includes('get(') || line.includes('post(') || 
        line.includes('put(') || line.includes('patch(') || line.includes('delete('))) {
      
      // 提取路由信息
      const route = parseRouteLine(line, currentComment, prefix, tags);
      if (route) {
        routes.push(route);
      }
      
      // 重置注释
      currentComment = '';
    }
    
    lineNumber++;
  }
  
  return routes;
}

/**
 * 从路由定义行解析路由信息
 */
function parseRouteLine(
  line: string, 
  comment: string, 
  prefix: string,
  tags: string[]
): RouteInfo | null {
  // 提取 HTTP 方法
  const methodMatch = line.match(/router\.(get|post|put|patch|delete)\(/);
  if (!methodMatch) return null;
  
  const method = methodMatch[1].toUpperCase();
  
  // 提取路径
  const pathMatch = line.match(/\('([^']+)'/);
  if (!pathMatch) return null;
  
  let path = pathMatch[1];
  
  // 如果路径不以 / 开头，添加 /
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  
  // 解析注释
  const { description, summary, queryParams, pathParams, requestBodyType, responseType } = parseComment(comment);
  
  // 检查是否需要认证
  const requiresAuth = line.includes('authenticate');
  
  // 提取所需角色
  const requiredRoles = extractRequiredRoles(line);
  
  // 提取处理器名称
  const handler = extractHandlerName(line);
  
  return {
    path,
    method,
    description: description || '无描述',
    summary: summary || description?.split('\n')[0] || '无摘要',
    requiresAuth,
    requiredRoles,
    requestBodyType,
    responseType,
    queryParams,
    pathParams,
    rawComment: comment,
    handler,
    prefix,
    tags
  };
}

/**
 * 解析 JSDoc 注释
 */
function parseComment(comment: string): {
  description: string;
  summary: string;
  queryParams: QueryParam[];
  pathParams: PathParam[];
  requestBodyType?: string;
  responseType?: string;
} {
  const descriptionLines: string[] = [];
  const summaryLines: string[] = [];
  const queryParams: QueryParam[] = [];
  const pathParams: PathParam[] = [];
  let requestBodyType: string | undefined;
  let responseType: string | undefined;
  
  if (!comment) {
    return {
      description: '',
      summary: '',
      queryParams: [],
      pathParams: []
    };
  }
  
  const lines = comment.split('\n');
  let inDescription = false;
  let inParamSection = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // 跳过注释标记
    if (trimmed === '/**' || trimmed === '*/' || trimmed.startsWith('* @')) {
      continue;
    }
    
    // 处理描述部分
    if (trimmed.startsWith('* ') && !trimmed.includes('@')) {
      const desc = trimmed.substring(2);
      if (!inDescription) {
        summaryLines.push(desc);
        inDescription = true;
      }
      descriptionLines.push(desc);
    }
    
    // 处理参数
    if (trimmed.includes('@param')) {
      inParamSection = true;
      const paramMatch = trimmed.match(/@param\s+\{([^}]+)\}\s+(\w+)\s+(.+)/);
      if (paramMatch) {
        const [, type, name, desc] = paramMatch;
        
        // 检查是否是查询参数（通过查询字符串传递）
        if (name.includes('query') || desc.includes('查询') || desc.includes('参数')) {
          const queryParam: QueryParam = {
            name: name.replace('query.', '').replace('params.', ''),
            type,
            description: desc,
            required: desc.includes('必须') || desc.includes('必需') || !desc.includes('可选'),
            defaultValue: extractDefaultValue(desc),
            enum: extractEnumValues(desc)
          };
          queryParams.push(queryParam);
        }
        // 检查是否是路径参数
        else if (name.includes('path') || desc.includes('路径')) {
          const pathParam: PathParam = {
            name: name.replace('path.', '').replace('params.', ''),
            type,
            description: desc
          };
          pathParams.push(pathParam);
        }
      }
    }
    
    // 处理请求体
    if (trimmed.includes('@requestBody')) {
      const match = trimmed.match(/@requestBody\s+\{([^}]+)\}/);
      if (match) {
        requestBodyType = match[1];
      }
    }
    
    // 处理响应
    if (trimmed.includes('@returns') || trimmed.includes('@response')) {
      const match = trimmed.match(/\{([^}]+)\}/);
      if (match) {
        responseType = match[1];
      }
    }
  }
  
  return {
    description: descriptionLines.join('\n'),
    summary: summaryLines[0] || '',
    queryParams,
    pathParams,
    requestBodyType,
    responseType
  };
}

/**
 * 提取路由前缀
 */
function extractRoutePrefix(content: string): string {
  // 从文件注释中查找路由前缀
  const prefixMatch = content.match(/路由前缀[：:]\s*([^\s\n]+)/);
  if (prefixMatch) {
    return prefixMatch[1];
  }
  
  // 默认前缀
  return '/api/v1';
}

/**
 * 根据文件名提取标签
 */
function extractTagsFromFileName(fileName: string): string[] {
  if (fileName.includes('user')) return ['用户'];
  if (fileName.includes('post')) return ['文章'];
  if (fileName.includes('category')) return ['分类'];
  if (fileName.includes('tag')) return ['标签'];
  return ['其他'];
}

/**
 * 提取所需角色
 */
function extractRequiredRoles(line: string): string[] {
  const roles: string[] = [];
  
  // 查找 authorize 调用
  const authorizeMatch = line.match(/authorize\(['"]([^'"]+)['"]\)/);
  if (authorizeMatch) {
    const rolesStr = authorizeMatch[1];
    roles.push(...rolesStr.split(/\s*,\s*/).map(role => role.trim()));
  }
  
  // 查找多个参数的情况
  const multiAuthorizeMatch = line.match(/authorize\(['"]([^'"]+)['"](?:,\s*['"]([^'"]+)['"])*\)/);
  if (multiAuthorizeMatch) {
    for (let i = 1; i < multiAuthorizeMatch.length; i++) {
      if (multiAuthorizeMatch[i]) {
        roles.push(...multiAuthorizeMatch[i].split(/\s*,\s*/).map(role => role.trim()));
      }
    }
  }
  
  return [...new Set(roles)]; // 去重
}

/**
 * 提取处理器名称
 */
function extractHandlerName(line: string): string | undefined {
  const handlerMatch = line.match(/\.bind\((\w+)\)/);
  if (handlerMatch) {
    return handlerMatch[1];
  }
  
  // 查找直接调用
  const directMatch = line.match(/\(req,\s*res/);
  if (directMatch) {
    return '匿名函数';
  }
  
  return undefined;
}

/**
 * 提取默认值
 */
function extractDefaultValue(description: string): string | undefined {
  const match = description.match(/默认[：:]\s*([^\s,，]+)/);
  return match ? match[1] : undefined;
}

/**
 * 提取枚举值
 */
function extractEnumValues(description: string): string[] | undefined {
  const match = description.match(/枚举[：:]\s*\[([^\]]+)\]/);
  if (!match) return undefined;
  
  return match[1].split(/\s*,\s*/).map(v => v.trim());
}

/**
 * 批量解析路由文件
 */
export async function parseAllRoutes(routesDir: string): Promise<RouteInfo[]> {
  const routes: RouteInfo[] = [];
  
  // 查找所有路由文件
  const files = [
    'user-routes.ts',
    'post-routes.ts',
    'category-routes.ts',
    'tag-routes.ts'
  ];
  
  for (const file of files) {
    const filePath = path.join(routesDir, file);
    if (fs.existsSync(filePath)) {
      try {
        const fileRoutes = await parseRouteFile(filePath);
        routes.push(...fileRoutes);
      } catch (error) {
        console.error(`解析路由文件 ${file} 时出错:`, error);
      }
    }
  }
  
  return routes;
}