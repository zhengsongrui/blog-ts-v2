/**
 * Express 应用配置
 *
 * 这是 Express 应用的主要配置文件，负责：
 * - 中间件配置（安全、CORS、速率限制等）
 * - 路由注册
 * - 错误处理
 * - 健康检查端点
 *
 * 文件结构：
 * 1. 导入依赖模块
 * 2. 创建 Express 应用实例
 * 3. 全局中间件配置
 * 4. 路由定义
 * 5. 错误处理中间件
 */

import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { errorHandler, notFoundHandler } from './middleware/error-middleware';

// 导入路由模块
import userRoutes from './routes/user-routes';
import postRoutes from './routes/post-routes';
import categoryRoutes from './routes/category-routes';
import tagRoutes from './routes/tag-routes';
// import commentRoutes from './routes/comment-routes';

/**
 * 创建 Express 应用实例
 *
 * 使用 TypeScript 的 Application 类型提供类型安全
 */
const app: Application = express();

// ======================
// 全局中间件配置
// ======================

/**
 * 安全中间件 - Helmet
 *
 * 功能：设置各种 HTTP 头以提高应用安全性
 * 包括：
 * - Content-Security-Policy
 * - X-DNS-Prefetch-Control
 * - X-Frame-Options
 * - X-Content-Type-Options
 * - Referrer-Policy
 */
app.use(helmet());

/**
 * CORS（跨域资源共享）配置
 *
 * 功能：允许指定来源的跨域请求
 * 配置项：
 * - origin: 允许的来源（从环境变量读取）
 * - credentials: 允许发送 cookies 和认证头
 */
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));

/**
 * 请求体解析中间件
 *
 * 功能：解析传入的请求体
 * - express.json(): 解析 JSON 格式的请求体
 * - express.urlencoded(): 解析 URL 编码的请求体（支持嵌套对象）
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * 速率限制中间件
 *
 * 功能：防止暴力攻击和滥用 API
 * 配置项：
 * - windowMs: 时间窗口（毫秒），默认15分钟
 * - max: 每个IP在时间窗口内允许的最大请求数
 * - message: 超过限制时返回的错误消息
 */
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: '请求过于频繁，请稍后再试',
    },
    message: '请求过于频繁，请稍后再试',
    timestamp: new Date().toISOString(),
  },
});
app.use(limiter);

// ======================
// 路由定义
// ======================

/**
 * 健康检查端点
 *
 * 路径：GET /health
 * 功能：监控应用运行状态，用于负载均衡器和监控系统
 * 返回：应用状态、环境信息和时间戳
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: config.app.env,
    },
    error: null,
    message: '服务运行正常',
    timestamp: new Date().toISOString(),
  });
});

/**
 * API 路由注册
 *
 * 将各个模块的路由挂载到对应的路径前缀下
 * 路径格式：${config.app.apiPrefix}/模块名
 */
app.use(`${config.app.apiPrefix}/users`, userRoutes);    // 用户相关路由
app.use(`${config.app.apiPrefix}/posts`, postRoutes);    // 文章相关路由
app.use(`${config.app.apiPrefix}/categories`, categoryRoutes);  // 分类路由
app.use(`${config.app.apiPrefix}/tags`, tagRoutes);      // 标签路由
// app.use(`${config.app.apiPrefix}/comments`, commentRoutes);     // 评论路由（待实现）

/**
 * 根路由
 *
 * 路径：GET /
 * 功能：提供 API 基本信息和使用说明
 * 返回：应用名称、版本、API 前缀和文档链接
 */
app.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      name: config.app.name,
      version: '1.0.0',
      apiPrefix: config.app.apiPrefix,
      documentation: `${req.protocol}://${req.get('host')}${config.app.apiPrefix}/docs`,
    },
    error: null,
    message: '欢迎使用博客后端 API',
    timestamp: new Date().toISOString(),
  });
});

// ======================
// 错误处理中间件
// ======================

/**
 * 404 处理中间件
 *
 * 功能：处理所有未匹配到路由的请求
 * 位置：必须在所有路由之后，错误处理之前
 */
app.use(notFoundHandler);

/**
 * 全局错误处理中间件
 *
 * 功能：捕获和处理所有未捕获的错误
 * 位置：必须在所有中间件和路由之后
 */
app.use(errorHandler);

/**
 * 导出 Express 应用实例
 *
 * 用于服务器启动（index.ts）和测试
 */
export default app;