#!/bin/bash

echo "检查服务状态..."

# 检查服务
BACKEND_OK=$(curl -s http://localhost:3001/api/health 2>/dev/null | grep -q "ok" && echo "yes" || echo "no")
FRONTEND_OK=$(curl -s http://127.0.0.1:5173 2>/dev/null | grep -q "<!doctype" && echo "yes" || echo "no")

if [ "$BACKEND_OK" = "no" ] || [ "$FRONTEND_OK" = "no" ]; then
    echo "服务未完全启动，正在启动..."
    ~/Desktop/tarot/start.sh &
    echo "请等待几秒后重试"
else
    echo "✅ 服务正常运行"
    echo "正在打开塔罗占卜应用..."
    open http://127.0.0.1:5173
    echo ""
    echo "如果浏览器没有打开，请手动访问："
    echo "👉 http://127.0.0.1:5173"
fi