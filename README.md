# 塔罗占卜应用

基于 React + Node.js + PostgreSQL 的塔罗牌占卜应用，支持语音输入和AI智能解读。

## 功能特性

- 语音/文字输入问题
- AI智能分析问题并推荐合适的牌阵
- 支持多种牌阵（单张牌、三张牌、凯尔特十字）
- 模拟真实的洗牌和抽牌体验
- AI生成个性化的塔罗牌解读
- 移动端优化的响应式设计

## 技术栈

### 后端
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- Claude AI API

### 前端
- React + TypeScript + Vite
- Tailwind CSS
- React Router
- Zustand (状态管理)
- Web Speech API (语音识别)

## 快速开始

### 1. 环境准备

确保已安装：
- Node.js 18+
- PostgreSQL 14+
- npm/yarn

### 2. 数据库设置

创建PostgreSQL数据库：
```sql
CREATE DATABASE tarot_db;
```

### 3. 后端设置

```bash
cd backend
npm install
cp .env.example .env
# 编辑 .env 文件，配置数据库连接和Claude API密钥

# 运行数据库迁移
npx prisma migrate dev

# 初始化种子数据
npm run prisma:seed

# 启动后端服务
npm run dev
```

### 4. 前端设置

```bash
cd frontend
npm install
npm run dev
```

### 5. 访问应用

打开浏览器访问：http://localhost:5173

## 项目结构

```
tarot/
├── backend/            # 后端服务
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── models/
│   │   └── middleware/
│   └── prisma/
├── frontend/           # 前端应用
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── types/
│   └── public/
└── database/           # 数据库脚本
```

## API文档

### 占卜相关

- `POST /api/divination/start` - 开始新的占卜
- `POST /api/divination/draw-cards` - 抽牌并获取解读
- `GET /api/divination/:id` - 获取占卜结果

### 塔罗牌相关

- `GET /api/tarot/cards` - 获取所有塔罗牌
- `GET /api/tarot/shuffle` - 获取洗牌后的牌组

### 牌阵相关

- `GET /api/spreads` - 获取所有牌阵
- `GET /api/spreads/:id` - 获取特定牌阵信息

## 部署指南

1. 构建前端：
```bash
cd frontend
npm run build
```

2. 构建后端：
```bash
cd backend
npm run build
```

3. 生产环境运行：
```bash
cd backend
NODE_ENV=production npm start
```

## 注意事项

- 确保配置正确的 Claude API 密钥
- 数据库需要初始化种子数据才能正常使用
- 语音输入功能需要 HTTPS 或 localhost 环境
- 建议使用 Chrome/Edge 浏览器以获得最佳体验