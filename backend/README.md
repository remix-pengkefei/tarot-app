# Tarot Backend

## 快速开始

1. 安装依赖
```bash
npm install
```

2. 配置环境变量
```bash
cp .env.example .env
```

编辑 `.env` 文件，设置：
- `AI_SERVICE=openai` 或 `AI_SERVICE=claude`
- 相应的 API key

3. 初始化数据库
```bash
npm run db:init
npm run db:seed
```

4. 启动开发服务器
```bash
npm run dev
```

## API 配置

### 使用 OpenAI (推荐)
```env
AI_SERVICE=openai
OPENAI_API_KEY=sk-...
```

### 使用 Claude
```env
AI_SERVICE=claude
ANTHROPIC_API_KEY=sk-ant-...
```

详细配置说明请参考 [API_CONFIGURATION.md](../API_CONFIGURATION.md)

## 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm start` - 运行生产版本
- `npm run db:init` - 初始化数据库
- `npm run db:seed` - 填充初始数据
- `npm run db:reset` - 重置数据库

## API 端点

- `GET /api/spreads` - 获取所有牌阵
- `GET /api/tarot-cards` - 获取所有塔罗牌
- `POST /api/divination/start` - 开始占卜
- `POST /api/divination/draw-cards` - 抽牌并获取解读
- `GET /api/divination/:id` - 获取占卜结果