#!/bin/bash

echo "重启后端服务..."

# 停止现有后端进程
pkill -f tsx

# 等待进程完全停止
sleep 2

# 启动后端
cd ~/Desktop/tarot/backend
nohup npm run dev > backend.log 2>&1 &

# 等待服务启动
sleep 3

# 检查服务状态
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ 后端服务已成功重启！"
    echo "API 健康检查: $(curl -s http://localhost:3001/api/health)"
else
    echo "❌ 后端服务启动失败，请查看日志："
    echo "cd ~/Desktop/tarot/backend && tail -f backend.log"
fi