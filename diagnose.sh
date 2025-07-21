#!/bin/bash

echo "=== 塔罗应用诊断 ==="
echo ""

# 检查后端
echo "1. 检查后端服务 (端口 3001):"
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "   ✓ 后端正在运行"
    curl -s http://localhost:3001/api/health | python3 -m json.tool
else
    echo "   ✗ 后端未运行"
fi
echo ""

# 检查前端
echo "2. 检查前端服务 (端口 5173):"
if curl -s http://localhost:5173 > /dev/null; then
    echo "   ✓ 前端正在运行"
else
    echo "   ✗ 前端未运行"
fi
echo ""

# 检查端口
echo "3. 端口占用情况:"
echo "   端口 3001: $(lsof -ti:3001 || echo '未占用')"
echo "   端口 5173: $(lsof -ti:5173 || echo '未占用')"
echo ""

# 检查进程
echo "4. 相关进程:"
ps aux | grep -E "(tsx|vite)" | grep -v grep || echo "   没有找到相关进程"
echo ""

# 网络接口
echo "5. 网络接口:"
ifconfig lo0 | grep "inet " || echo "   localhost 接口异常"
echo ""

echo "=== 诊断完成 ==="
echo ""
echo "如果服务都在运行但仍无法访问，请尝试："
echo "1. 使用 127.0.0.1:5173 代替 localhost:5173"
echo "2. 检查防火墙/安全软件设置"
echo "3. 清理浏览器缓存并重试"