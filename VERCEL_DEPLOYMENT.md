# Vercel前端部署指南

## 前置要求

1. 确保后端已经成功部署到Render
2. 记录后端的URL（例如：`https://tarot-backend-xxxx.onrender.com`）

## 部署步骤

### 1. 准备工作

确保你的代码已经推送到GitHub仓库。

### 2. 在Vercel创建新项目

1. 访问 [Vercel](https://vercel.com)
2. 点击 "Add New..." → "Project"
3. 选择 "Import Git Repository"
4. 选择你的tarot仓库

### 3. 配置项目

在Import页面，进行以下配置：

- **Project Name**: tarot-frontend（或你喜欢的名字）
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build and Output Settings**:
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm install`

### 4. 环境变量配置

在Environment Variables部分添加：

```
VITE_API_URL=https://你的render后端地址.onrender.com/api
```

**重要**：
- 确保URL以`/api`结尾
- 不要在URL末尾添加斜杠
- 例如：`https://tarot-backend-xxxx.onrender.com/api`

### 5. 部署

1. 点击 "Deploy"
2. 等待部署完成（通常需要1-2分钟）
3. 部署成功后，你会获得一个URL，如：`https://tarot-frontend.vercel.app`

### 6. 更新后端CORS设置

**重要步骤**：部署完成后，需要更新Render后端的环境变量

1. 回到Render Dashboard
2. 进入你的tarot-backend服务
3. 在Environment选项卡中，更新或添加：
   ```
   FRONTEND_URL=https://你的vercel应用地址.vercel.app
   ```
4. 保存后Render会自动重新部署

### 7. 验证部署

1. 访问你的Vercel URL
2. 测试完整流程：
   - 输入问题
   - 查看AI推荐的牌阵
   - 抽牌
   - 查看解读结果

### 8. 自定义域名（可选）

在Vercel项目设置中：
1. 转到 Settings → Domains
2. 添加你的自定义域名
3. 按照提示配置DNS

### 故障排查

#### CORS错误
如果遇到CORS错误：
1. 确保Render后端的`FRONTEND_URL`环境变量正确设置
2. 检查前端的`VITE_API_URL`是否正确

#### API连接失败
1. 确保后端服务正在运行
2. 检查API URL格式是否正确
3. 使用浏览器开发者工具查看网络请求

#### 构建失败
1. 查看Vercel的构建日志
2. 确保所有依赖都已正确安装
3. 检查TypeScript编译错误

### 性能优化建议

1. Vercel会自动启用边缘网络加速
2. 静态资源会自动压缩和缓存
3. 考虑启用Vercel Analytics监控性能

## 下一步

1. 测试所有功能确保正常工作
2. 考虑添加自定义域名
3. 设置监控和错误追踪
4. 定期检查API使用量