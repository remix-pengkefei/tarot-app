#!/bin/bash

echo "🚀 开始部署塔罗牌应用..."

# 检查是否已经初始化 git
if [ ! -d ".git" ]; then
    echo "📦 初始化 Git 仓库..."
    git init
    git add .
    git commit -m "Initial commit - Tarot divination app"
fi

echo "
⚠️  部署前请确保：

1. 你已经有 GitHub 账号
2. 你已经有 Railway 账号（https://railway.app）
3. 你已经有 Vercel 账号（https://vercel.com）

部署步骤：

📌 第一步：创建 GitHub 仓库
1. 访问 https://github.com/new
2. 创建新仓库，命名为 'tarot-app'
3. 不要初始化 README、.gitignore 或 license

📌 第二步：推送代码到 GitHub
运行以下命令（替换 YOUR_USERNAME 为你的 GitHub 用户名）：
git remote add origin https://github.com/YOUR_USERNAME/tarot-app.git
git branch -M main
git push -u origin main

📌 第三步：部署后端到 Railway
1. 访问 https://railway.app
2. 点击 'New Project' -> 'Deploy from GitHub repo'
3. 选择你的 tarot-app 仓库
4. 在项目设置中：
   - 设置根目录为: /backend
   - 添加以下环境变量：
     DATABASE_URL=file:./prisma/prod.db
     AI_SERVICE=openai
     OPENAI_API_KEY=你的OpenAI API密钥
     NODE_ENV=production
     CORS_ORIGIN=https://你的应用名.vercel.app

5. 记录下 Railway 提供的 URL（类似 https://你的应用名.railway.app）

📌 第四步：部署前端到 Vercel
1. 访问 https://vercel.com
2. 点击 'New Project' -> 导入你的 GitHub 仓库
3. 配置项目：
   - Framework Preset: Vite
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: dist
4. 添加环境变量：
   VITE_API_URL=https://你的应用名.railway.app

📌 第五步：更新 Railway CORS 设置
1. 回到 Railway 项目
2. 更新 CORS_ORIGIN 环境变量为你的 Vercel URL
3. Railway 会自动重新部署

📌 第六步：验证部署
访问你的 Vercel URL，测试完整的占卜流程

需要帮助？查看 DEPLOYMENT.md 文件获取详细指南。
"

echo "
提示：你的 .env 文件中包含了 OpenAI API Key，请确保：
1. 不要将 .env 文件提交到 GitHub
2. 在 Railway 中设置相同的环境变量
"