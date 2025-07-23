#!/bin/bash

echo "🔧 修复部署配置..."

# 创建生产环境配置示例
cat > backend/.env.production.example << EOF
# Database
DATABASE_URL="file:./prisma/prod.db"

# Server
PORT=\$PORT
NODE_ENV=production

# CORS - 更新为你的 Vercel URL
CORS_ORIGIN=https://your-app.vercel.app

# AI Service Configuration
AI_SERVICE=openai

# OpenAI API - 使用你的 API Key
OPENAI_API_KEY=your_openai_api_key_here
EOF

cat > frontend/.env.production.example << EOF
# 更新为你的 Railway URL
VITE_API_URL=https://your-app.railway.app/api
EOF

echo "
✅ 配置文件已创建！

🚨 重要提醒：

1. Network Error 通常是由以下原因导致：
   - 前端的 VITE_API_URL 没有正确指向后端 Railway URL
   - 后端的 CORS_ORIGIN 没有包含前端 Vercel URL
   - API Key 配置错误

2. 请在部署平台上检查并更新以下环境变量：

   Railway (后端)：
   - DATABASE_URL=file:./prisma/prod.db
   - AI_SERVICE=openai
   - OPENAI_API_KEY=你的实际API Key
   - NODE_ENV=production
   - CORS_ORIGIN=https://你的应用名.vercel.app

   Vercel (前端)：
   - VITE_API_URL=https://你的应用名.railway.app

3. 确保两个平台都已成功部署并运行

4. 可以通过以下方式测试：
   - 访问 https://你的应用名.railway.app/api/health 检查后端
   - 查看浏览器控制台的具体错误信息

需要查看更多帮助，请运行：
cat DEPLOYMENT.md
"