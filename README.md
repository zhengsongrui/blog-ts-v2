# blog-ts-v2
REACT+TS个人博客v2版本

## 项目结构

- `frontend/` – React + TypeScript 前端应用
- `server/` – Node.js + Express 后端服务


## 数据库设置

本项目使用 MySQL 数据库，通过 Prisma ORM 管理数据模型。数据库配置文件位于 `server/prisma/schema.prisma`。

### 环境要求
- MySQL 服务运行在端口 3307（默认用户名 `root`，密码为空）
- Node.js 已安装
- 项目依赖已安装（运行 `npm install`）

### 方案一：使用批处理脚本（推荐）
1. 打开命令提示符或 PowerShell
2. 进入 `server` 目录：
   ```cmd
   cd c:\CODE\MyProject\blog-ts-v2\server
   ```
3. 运行脚本：
   ```cmd
   scripts\setup-database.bat
   ```
   - 脚本会自动检测环境并执行 `prisma db push --skip-generate --force-reset`
   - 询问是否生成 Prisma Client（按 y 生成，按 Enter 跳过）
   - 完成后按任意键退出

**注意**：`--force-reset` 会清空现有数据库中的所有数据，仅用于开发环境。

### 方案二：手动命令
如果不想使用脚本，可直接运行：
```cmd
cd server
npx prisma db push --skip-generate --force-reset
npx prisma generate  # 可选
```

### 生产环境注意事项
- 生产环境请使用 `prisma migrate dev` 进行迁移，避免数据丢失
- 数据库配置已在 `.env` 中正确设置（端口 3307，用户名 root，密码为空）

