# 塔罗占卜应用 - 开发文档

## 项目结构

```
tarot/
├── backend/               # 后端服务 (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── controllers/   # 控制器（暂未使用，直接在路由中处理）
│   │   ├── services/      # 业务逻辑层
│   │   ├── routes/        # API路由定义
│   │   ├── middleware/    # 中间件（错误处理、验证等）
│   │   ├── types/         # TypeScript类型定义
│   │   └── index.ts       # 应用入口
│   ├── prisma/
│   │   ├── schema.prisma  # 数据库模型定义
│   │   └── seed.ts        # 种子数据
│   └── tests/             # 测试文件
├── frontend/              # 前端应用 (React + TypeScript + Vite)
│   ├── src/
│   │   ├── pages/         # 页面组件
│   │   ├── services/      # API服务和状态管理
│   │   ├── hooks/         # 自定义React hooks
│   │   ├── types/         # TypeScript类型定义
│   │   └── App.tsx        # 应用根组件
│   └── public/            # 静态资源
└── database/              # 数据库脚本
    └── scripts/           # 初始化脚本

```

## 技术栈详情

### 后端技术
- **Express.js**: Web框架
- **TypeScript**: 类型安全
- **Prisma**: ORM和数据库迁移
- **PostgreSQL**: 关系型数据库
- **Claude API**: AI占卜解读
- **Joi**: 请求验证
- **express-async-errors**: 异步错误处理

### 前端技术
- **React 19**: UI框架
- **TypeScript**: 类型安全
- **Vite**: 构建工具
- **Tailwind CSS**: 样式框架
- **React Router v6**: 路由管理
- **Zustand**: 状态管理
- **Axios**: HTTP客户端
- **Web Speech API**: 语音识别

## 核心功能实现

### 1. 语音输入
使用Web Speech API实现语音转文字：
- 自定义hook: `useSpeechRecognition`
- 支持中文语音识别
- 实时转录显示

### 2. AI集成
通过Claude API实现：
- 问题分析和牌阵推荐
- 个性化塔罗牌解读
- 温柔且富有洞察力的语言风格

### 3. 状态管理
使用Zustand管理全局状态：
- 当前占卜会话
- 卡牌数据
- 加载和错误状态
- 用户选择的牌

### 4. 数据模型
主要数据表：
- `TarotCard`: 78张塔罗牌信息
- `Spread`: 牌阵类型（单张、三张、凯尔特十字）
- `Divination`: 占卜记录
- `DivinationCard`: 抽取的牌和解读

## 开发指南

### 环境设置

1. **安装依赖**
```bash
# 后端
cd backend && npm install

# 前端
cd frontend && npm install
```

2. **环境变量配置**
```bash
# backend/.env
DATABASE_URL="postgresql://user:password@localhost:5432/tarot_db"
PORT=3001
ANTHROPIC_API_KEY="your-claude-api-key"
FRONTEND_URL="http://localhost:5173"
```

3. **数据库初始化**
```bash
cd backend
npx prisma migrate dev
npm run prisma:seed
```

### 开发命令

**启动开发服务器**
```bash
# 使用启动脚本（推荐）
./start.sh

# 或分别启动
# 后端
cd backend && npm run dev

# 前端
cd frontend && npm run dev
```

**运行测试**
```bash
# 全部测试
./test-all.sh

# 后端测试
cd backend && npm test

# 前端测试
cd frontend && npm test
```

**构建生产版本**
```bash
# 后端
cd backend && npm run build

# 前端
cd frontend && npm run build
```

### API端点

#### 占卜流程
1. `POST /api/divination/start` - 输入问题，获取牌阵推荐
2. `POST /api/divination/draw-cards` - 提交抽取的牌，获取解读
3. `GET /api/divination/:id` - 查看完整占卜结果

#### 辅助接口
- `GET /api/tarot/cards` - 获取所有塔罗牌
- `GET /api/tarot/shuffle` - 获取洗牌后的牌组
- `GET /api/spreads` - 获取所有牌阵

### 代码规范

1. **TypeScript严格模式**
   - 启用所有严格检查
   - 避免使用any类型

2. **组件结构**
   - 使用函数组件和Hooks
   - 保持组件单一职责
   - 抽取可复用逻辑到自定义hooks

3. **错误处理**
   - 后端使用统一的AppError类
   - 前端在store中集中处理错误
   - 用户友好的错误提示

4. **异步操作**
   - 使用async/await
   - 适当的加载状态
   - 错误边界处理

### 部署注意事项

1. **数据库**
   - 使用连接池
   - 设置适当的超时
   - 定期备份

2. **环境变量**
   - 不要提交.env文件
   - 使用环境变量管理敏感信息
   - 生产环境使用强密码

3. **性能优化**
   - 启用gzip压缩
   - 设置适当的缓存策略
   - 优化图片资源

4. **安全考虑**
   - 启用HTTPS
   - 设置CORS白名单
   - 输入验证和清理
   - Rate limiting

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查PostgreSQL是否运行
   - 验证连接字符串
   - 确认数据库存在

2. **语音识别不工作**
   - 检查浏览器兼容性
   - 需要HTTPS或localhost
   - 确认麦克风权限

3. **Claude API错误**
   - 验证API密钥
   - 检查请求限制
   - 查看错误日志

### 调试技巧

1. **后端调试**
   - 使用VSCode调试器
   - 查看Prisma查询日志
   - 使用Postman测试API

2. **前端调试**
   - React Developer Tools
   - 网络请求监控
   - Console日志

## 贡献指南

1. 创建功能分支
2. 编写测试用例
3. 确保所有测试通过
4. 提交清晰的commit信息
5. 创建Pull Request

## 许可证

本项目仅供学习和个人使用。