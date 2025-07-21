# 塔罗占卜应用部署指南

本指南将帮助您将应用部署到 Vercel（前端）和 Railway（后端）。

## 前置准备

1. 注册账号：
   - [Vercel](https://vercel.com) - 使用 GitHub 账号登录
   - [Railway](https://railway.app) - 使用 GitHub 账号登录
   
2. 安装 Git（如果还没有安装）

## 第一步：初始化 Git 仓库

```bash
# 在项目根目录执行
cd /Users/remix.fly/Desktop/tarot
git init
git add .
git commit -m "Initial commit - Tarot divination app v1.1"
```

## 第二步：创建 GitHub 仓库

1. 访问 [GitHub](https://github.com/new)
2. 创建新仓库，命名为 `tarot-app`（或其他您喜欢的名字）
3. 不要初始化 README、.gitignore 或 license
4. 创建后，将本地代码推送到 GitHub：

```bash
git remote add origin https://github.com/YOUR_USERNAME/tarot-app.git
git branch -M main
git push -u origin main
```

## 第三步：部署后端到 Railway

1. 访问 [Railway](https://railway.app)
2. 点击 "New Project"
3. 选择 "Deploy from GitHub repo"
4. 选择您刚创建的 `tarot-app` 仓库
5. Railway 会自动检测到 Node.js 项目

### 配置 Railway：

1. 在项目设置中，设置根目录为 `/backend`
2. 添加环境变量（在 Variables 标签下）：
   ```
   DATABASE_URL=file:./prisma/prod.db
   AI_SERVICE=openai
   OPENAI_API_KEY=您的OpenAI API密钥
   NODE_ENV=production
   CORS_ORIGIN=https://your-app.vercel.app
   ```
   
3. Railway 会自动构建和部署您的应用
4. 部署完成后，您会获得一个 URL，类似：`https://your-app.railway.app`

## 第四步：部署前端到 Vercel

1. 访问 [Vercel](https://vercel.com)
2. 点击 "New Project"
3. 导入您的 GitHub 仓库
4. 配置项目：
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### 配置环境变量：

在 Vercel 项目设置的 Environment Variables 中添加：
```
VITE_API_URL=https://your-app.railway.app
```
（使用您在 Railway 获得的后端 URL）

## 第五步：更新 CORS 设置

1. 回到 Railway
2. 更新 `CORS_ORIGIN` 环境变量为您的 Vercel URL
3. Railway 会自动重新部署

## 第六步：初始化数据库

部署完成后，需要初始化数据库数据：

1. 在 Railway 项目中，点击 "New" → "Database" → "Add PostgreSQL"（可选，用于生产环境）
2. 或者使用 SQLite（已配置）
3. 运行种子数据（Railway 会在首次部署时自动执行）

## 验证部署

1. 访问您的 Vercel URL
2. 测试完整的占卜流程
3. 检查 AI 解读是否正常工作

## 常见问题

### 1. CORS 错误
确保 Railway 的 `CORS_ORIGIN` 环境变量设置为您的 Vercel URL

### 2. API 连接失败
检查 Vercel 的 `VITE_API_URL` 是否正确设置为 Railway URL

### 3. 数据库错误
确保 Railway 的 `DATABASE_URL` 正确设置

### 4. AI API 错误
验证 `OPENAI_API_KEY` 是否正确设置且有效

## 后续维护

### 更新代码
```bash
git add .
git commit -m "Update: 描述您的更改"
git push
```
Vercel 和 Railway 会自动检测到更改并重新部署。

### 查看日志
- Vercel: 项目页面 → Functions → Logs
- Railway: 项目页面 → Deployments → View Logs

### 域名配置（可选）
- Vercel: Settings → Domains → Add Domain
- Railway: Settings → Domains → Add Custom Domain

## 费用说明

- **Vercel**: 免费套餐足够个人项目使用
- **Railway**: 提供 $5/月免费额度，足够运行小型应用
- **OpenAI API**: 按使用量付费，GPT-3.5-turbo 成本较低

## 安全建议

1. 不要在代码中硬编码 API 密钥
2. 使用环境变量管理敏感信息
3. 定期更新依赖包
4. 监控 API 使用量避免超额

---

恭喜！您的塔罗占卜应用现在已经部署到云端了。