#!/bin/bash

echo "🚀 更新部署以修复CORS问题..."

# 检查git状态
echo "📋 检查Git状态..."
git status

echo "
✅ CORS配置已更新！

现在需要将更改推送到GitHub，Railway会自动重新部署。

执行以下步骤：

1. 提交更改：
   git add backend/src/index.ts
   git commit -m "Fix CORS issue for Vercel deployment"
   git push

2. 等待Railway自动重新部署（通常需要2-3分钟）

3. 在Railway项目设置中，确保设置了以下环境变量：
   - CORS_ORIGIN=https://tarot-app-ebon.vercel.app
   - NODE_ENV=production
   - DATABASE_URL=file:./prisma/prod.db
   - AI_SERVICE=openai
   - OPENAI_API_KEY=你的API密钥

4. 重新部署完成后，访问你的Vercel应用测试

如果仍有问题，可以在Railway中查看日志：
- 进入Railway项目
- 点击 Deployments
- 查看最新部署的日志

提示：CORS配置现在会：
- 自动允许所有 vercel.app 域名在生产环境访问
- 明确添加了你的具体域名 https://tarot-app-ebon.vercel.app
- 添加了必要的HTTP方法和请求头支持
"