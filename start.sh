#!/bin/bash

# 启动塔罗占卜应用的脚本

echo "Starting Tarot App..."

# 检查 PostgreSQL 是否运行
if ! pg_isready -q; then
    echo "Error: PostgreSQL is not running. Please start PostgreSQL first."
    exit 1
fi

# 启动后端
echo "Starting backend server..."
cd backend
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "Please edit backend/.env file to configure database and API keys"
fi

# 安装依赖（如果需要）
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

# 运行数据库迁移
echo "Running database migrations..."
npx prisma migrate dev

# 检查是否需要种子数据
echo "Checking database seed status..."
npm run prisma:seed

# 启动后端服务
npm run dev &
BACKEND_PID=$!

# 等待后端启动
sleep 5

# 启动前端
echo "Starting frontend..."
cd ../frontend

# 安装依赖（如果需要）
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# 启动前端开发服务器
npm run dev &
FRONTEND_PID=$!

echo "Tarot App is starting..."
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Access the app at: http://localhost:5173"
echo "Backend API at: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop all services"

# 等待中断信号
trap "echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT

# 保持脚本运行
wait