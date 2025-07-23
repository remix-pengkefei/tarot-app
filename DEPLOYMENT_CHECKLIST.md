# 塔罗占卜应用部署检查清单

## 部署前准备

- [ ] 确保所有代码已提交到GitHub
- [ ] 确保有有效的OpenAI API密钥
- [ ] 注册Render账号
- [ ] 注册Vercel账号

## 后端部署（Render）

### 1. 创建服务
- [ ] 在Render创建新的Web Service
- [ ] 选择GitHub仓库
- [ ] 设置Root Directory为`backend`
- [ ] 设置Build Command为`./build.sh`
- [ ] 设置Start Command为`npm start`

### 2. 环境变量
- [ ] DATABASE_URL = `file:./prisma/prod.db`
- [ ] AI_SERVICE = `openai`
- [ ] OPENAI_API_KEY = `你的OpenAI API密钥`
- [ ] NODE_ENV = `production`
- [ ] PORT = `10000`
- [ ] FRONTEND_URL = `待前端部署后更新`

### 3. 部署验证
- [ ] 等待部署完成
- [ ] 记录后端URL：`https://你的服务名.onrender.com`
- [ ] 测试健康检查：访问 `/api/health`
- [ ] 测试CORS：访问 `/api/cors-test`

## 前端部署（Vercel）

### 1. 创建项目
- [ ] 在Vercel导入GitHub仓库
- [ ] 设置Root Directory为`frontend`
- [ ] 选择Framework Preset为`Vite`
- [ ] Build Command为`npm run build`
- [ ] Output Directory为`dist`

### 2. 环境变量
- [ ] VITE_API_URL = `https://你的render后端地址.onrender.com/api`

### 3. 部署验证
- [ ] 等待部署完成
- [ ] 记录前端URL：`https://你的项目名.vercel.app`
- [ ] 测试页面是否正常加载

## 连接配置

### 1. 更新后端CORS
- [ ] 回到Render Dashboard
- [ ] 更新FRONTEND_URL环境变量为Vercel URL
- [ ] 等待自动重新部署

### 2. 功能测试
- [ ] 访问前端应用
- [ ] 测试语音输入（需要HTTPS）
- [ ] 输入问题测试
- [ ] 查看AI推荐牌阵
- [ ] 测试抽牌功能
- [ ] 查看解读结果

## 常见问题排查

### CORS错误
1. 检查后端FRONTEND_URL是否正确设置
2. 确保URL没有尾部斜杠
3. 检查浏览器控制台的具体错误信息

### API连接失败
1. 确保后端服务已启动（Render免费版可能需要等待30秒）
2. 检查VITE_API_URL格式是否正确
3. 使用浏览器直接访问后端健康检查端点

### 数据库错误
1. 检查Render日志中的数据库初始化信息
2. 确保build.sh脚本执行权限正确
3. 验证种子数据是否成功导入

## 后续维护

- [ ] 设置GitHub自动部署
- [ ] 配置监控告警
- [ ] 定期检查API使用量
- [ ] 备份数据库（如需要）

## 完成确认

- [ ] 前端可以正常访问
- [ ] 后端API响应正常
- [ ] 所有功能测试通过
- [ ] 记录所有URL和配置信息