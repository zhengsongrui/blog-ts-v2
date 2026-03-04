# Roo Code 规则 - 项目分流器

## 目的

本文件是 Roo Code 规则系统的顶层入口，不包含具体的编码规则。它的作用是根据当前处理的文件路径，自动引导 Roo Code 加载对应的前端或后端专用规则文件。

## 规则文件结构

本项目采用分层规则文件结构，确保前后端有各自的规范：

1. **前端规则** (`frontend/.roo/rules.md`): 适用于 `frontend/` 目录下的所有文件，包含 React/Vite 前端特定规则。
2. **后端规则** (`server/.roo/rules.md`): 适用于 `server/` 目录下的所有文件，包含 Node.js/Express 后端特定规则。

## 分流机制

Roo Code 在处理文件时，应依据以下逻辑自动选择规则文件：

- 若文件路径以 `frontend/` 开头 → 加载 `frontend/.roo/rules.md`
- 若文件路径以 `server/` 开头 → 加载 `server/.roo/rules.md`
- 若文件位于项目根目录（即不属于前后端目录），可回退到本文件，但建议将通用配置放在具体规则文件中。

## 通用原则（仅参考）

以下原则已分别在前端和后端规则中详细阐述，此处仅作提示：

- **TypeScript**: 严格模式启用，避免 `any` 类型
- **代码风格**: 遵循一致的命名约定和导入顺序
- **版本控制**: 使用 Git，提交信息遵循 Conventional Commits
- **环境变量**: 通过 `.env` 文件管理，敏感信息不提交

## 快速命令参考

### 前端开发
```bash
cd frontend
npm run dev      # 启动开发服务器 (http://localhost:5173)
npm run build    # 构建生产版本
npm run lint     # 代码检查
npm run preview  # 预览构建
```

### 后端开发
```bash
cd server
npm run dev      # 启动开发服务器 (nodemon, 端口 3000)
npm run build    # 编译 TypeScript
npm start        # 启动生产服务器
```

## 注意事项

- 所有具体编码规范、目录结构、API 设计、测试策略等细节，请参阅对应的前端或后端规则文件。
- 如需修改规则，请直接编辑相应的 `frontend/.roo/rules.md` 或 `server/.roo/rules.md` 文件。
- 本文件应保持简洁，避免添加具体的技术细节，以确保分流逻辑清晰。

---

**规则文件最后更新**: 2026-02-15