# Render后端部署指南

## 部署步骤

### 1. 准备工作

确保你的代码已经推送到GitHub仓库。

### 2. 在Render创建新服务

1. 登录 [Render Dashboard](https://dashboard.render.com/)
2. 点击 "New +" → "Web Service"
3. 连接你的GitHub账户并选择tarot仓库
4. 填写以下配置：
   - **Name**: tarot-backend
   - **Region**: 选择离你最近的区域
   - **Branch**: main
   - **Root Directory**: backend
   - **Runtime**: Node
   - **Build Command**: `./build.sh`
   - **Start Command**: `npm start`

### 3. 环境变量配置

在Render的Environment选项卡中添加以下环境变量：

```
DATABASE_URL=file:./prisma/prod.db
AI_SERVICE=openai
OPENAI_API_KEY=你的OpenAI API密钥
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://你的vercel应用地址.vercel.app
```

**重要提示**：
- `OPENAI_API_KEY` 必须是有效的OpenAI API密钥
- `FRONTEND_URL` 需要在前端部署完成后更新为实际的Vercel URL

### 4. 部署

1. 点击 "Create Web Service"
2. Render会自动开始构建和部署
3. 等待部署完成（通常需要3-5分钟）

### 5. 验证部署

部署完成后，你会获得一个URL，格式如：
`https://tarot-backend-xxxx.onrender.com`

访问以下端点验证部署是否成功：
- `https://你的render地址/api/health` - 应该返回 `{"status":"ok"}`

### 6. 故障排查

如果部署失败，检查以下内容：

1. **构建日志**：在Render的Logs选项卡查看详细错误信息
2. **环境变量**：确保所有必需的环境变量都已设置
3. **数据库**：SQLite数据库文件会在构建时自动创建和初始化

### 7. 更新部署

当你推送新代码到GitHub时，Render会自动触发重新部署。

### 注意事项

1. Render的免费套餐会在15分钟无活动后休眠服务，首次访问可能需要等待30秒左右
2. SQLite数据库文件存储在服务器上，重新部署时会保留数据
3. 建议定期备份数据库文件

## 下一步

后端部署完成后，继续部署前端到Vercel，并更新FRONTEND_URL环境变量。