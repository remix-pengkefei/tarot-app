#!/bin/bash

echo "Starting Tarot App (Simple Mode)..."

# 打开两个新的终端窗口分别运行前后端

# 启动后端
osascript -e 'tell app "Terminal" to do script "cd ~/Desktop/tarot/backend && npm run dev"'

# 等待后端启动
sleep 3

# 启动前端  
osascript -e 'tell app "Terminal" to do script "cd ~/Desktop/tarot/frontend && npm run dev"'

echo ""
echo "Services are starting in separate Terminal windows..."
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:5173"
echo ""
echo "Please wait a few seconds for the services to fully start."