/**
 * 服务器入口文件
 *
 * 这是应用程序的主入口点，负责：
 * - 加载环境变量配置
 * - 初始化数据库连接
 * - 启动HTTP服务器
 * - 处理优雅关闭
 *
 * 文件结构：
 * 1. 导入依赖模块
 * 2. 数据库连接测试函数
 * 3. 服务器启动函数
 * 4. 优雅关闭处理
 * 5. 应用启动逻辑
 */

import dotenv from 'dotenv';
import { config } from './config';
import app from './app';
import prisma from './utils/db';

/**
 * 加载环境变量
 * 从 .env 文件加载环境变量到 process.env
 * 必须在其他配置之前调用
 */
dotenv.config();

/**
 * 测试数据库连接
 *
 * 功能：验证应用能否成功连接到配置的数据库
 * 失败处理：如果连接失败，记录错误并退出进程（退出码1）
 *
 * @async
 * @returns {Promise<void>}
 * @throws {Error} 数据库连接错误
 */
const testDatabaseConnection = async () => {
  try {
    await prisma.$connect();
    console.log('✅ 数据库连接成功');
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
    process.exit(1);
  }
};

/**
 * 启动HTTP服务器
 *
 * 功能：
 * 1. 测试数据库连接
 * 2. 启动Express应用监听指定端口
 * 3. 注册优雅关闭处理器
 *
 * @async
 * @returns {Promise<void>}
 */
const startServer = async () => {
  // 测试数据库连接
  await testDatabaseConnection();

  // 启动HTTP服务器
  const server = app.listen(config.app.port, () => {
    console.log(`🚀 服务器启动成功`);
    console.log(`📡 环境: ${config.app.env}`);
    console.log(`🌐 地址: http://localhost:${config.app.port}`);
    console.log(`🔗 API前缀: ${config.app.apiPrefix}`);
    console.log(`📊 数据库: ${config.database.url.split('@')[1]}`);
  });

  /**
   * 优雅关闭处理函数
   *
   * 功能：
   * 1. 关闭HTTP服务器，停止接受新请求
   * 2. 断开数据库连接
   * 3. 正常退出进程
   *
   * 超时处理：如果10秒内未能完成关闭，强制退出
   */
  const gracefulShutdown = () => {
    console.log('🛑 收到关闭信号，正在优雅关闭...');
    server.close(async () => {
      console.log('🔒 HTTP 服务器已关闭');
      await prisma.$disconnect();
      console.log('🔒 数据库连接已关闭');
      process.exit(0);
    });

    // 如果10秒后还没关闭，强制退出
    setTimeout(() => {
      console.error('⏰ 强制关闭...');
      process.exit(1);
    }, 10000);
  };

  // 注册信号处理器
  process.on('SIGTERM', gracefulShutdown);  // Kubernetes等容器编排系统的终止信号
  process.on('SIGINT', gracefulShutdown);   // Ctrl+C 中断信号
  process.on('SIGUSR2', gracefulShutdown);  // nodemon 重启信号（开发环境）
};

/**
 * 启动应用
 *
 * 调用 startServer 函数并处理可能的启动错误
 * 启动失败时记录错误并退出进程（退出码1）
 */
startServer().catch((error) => {
  console.error('🔥 启动失败:', error);
  process.exit(1);
});

/**
 * 导出Express应用实例
 *
 * 主要用于测试目的，允许外部模块导入应用实例进行测试
 */
export default app;