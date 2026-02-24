import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // 应用配置
  app: {
    name: process.env.APP_NAME || 'BlogV2 Backend',
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    apiPrefix: process.env.API_PREFIX || '/api/v1',
  },

  // 数据库配置
  database: {
    url: process.env.DATABASE_URL || 'mysql://root:@localhost:3307/bolgV2',
  },

  // JWT 配置
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key_change_this',
    expire: process.env.JWT_EXPIRE || '7d',
  },

  // CORS 配置
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },

  // 日志配置
  log: {
    level: process.env.LOG_LEVEL || 'info',
  },

  // 速率限制配置
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15分钟
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10000', 10),
  },

  // 安全配置
  security: {
    bcryptRounds: 10,
  },
} as const;