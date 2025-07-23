# Tarot App 项目文档

## 项目概述
- **项目名称**: 塔罗占卜移动端应用
- **开发时间**: 2025-07-23
- **目标**: 实现每月1万美金收入的占卜应用
- **当前状态**: MVP已部署上线

## 技术栈
### 前端
- React 18 + TypeScript
- Vite 构建工具
- Tailwind CSS
- Zustand 状态管理
- Axios 网络请求
- React Router 路由

### 后端
- Node.js + Express + TypeScript
- Prisma ORM
- SQLite 数据库（生产环境需升级）
- OpenAI API (GPT-3.5-turbo)
- CORS 中间件

## 部署信息
### 生产环境 URL
- **前端**: https://tarot-app-rose.vercel.app
- **后端**: https://tarot-backend-522n.onrender.com
- **GitHub**: https://github.com/remix-pengkefei/tarot-app.git

### 本地开发
```bash
# 启动本地开发环境
cd ~/Desktop/tarot && bash simple-start.sh

# 前端: http://localhost:5173
# 后端: http://localhost:3001
```

## 环境变量配置

### 后端 (Render)
```
DATABASE_URL=file:./prisma/prod.db
AI_SERVICE=openai
OPENAI_API_KEY=[你的API Key]
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://tarot-app-rose.vercel.app
```

### 前端 (Vercel)
```
VITE_API_URL=https://tarot-backend-522n.onrender.com/api
```

## 部署过程中遇到的问题及解决方案

### 1. TypeScript 类型定义错误
**错误**: `Could not find a declaration file for module 'express'`
**原因**: Render 生产环境只安装 dependencies，不安装 devDependencies
**解决**: 将类型包移到 dependencies
```json
"dependencies": {
  "@types/cors": "^2.8.17",
  "@types/express": "^4.17.21",
  "@types/node": "^20.10.5",
  "typescript": "^5.3.3"
}
```

### 2. 数据库初始化问题
**问题**: 生产环境没有种子数据，API 返回空数组
**解决**: 在 `src/index.ts` 添加自动初始化
```typescript
async function initializeDatabase() {
  // 检查并创建牌阵数据
  // 检查并创建塔罗牌数据
}
```

### 3. CORS 配置问题
**问题**: 跨域请求被阻止
**解决**: 
- 开发环境允许 localhost
- 生产环境使用具体域名
- 通过环境变量 CORS_ORIGIN 配置

### 4. OpenAI API 错误处理
**问题**: 复杂问题导致 API 返回格式错误
**解决**: 
- 添加响应格式验证
- 三层错误处理机制
- 明确的 prompt 指示

### 5. 前端洗牌页面空白
**问题**: shuffledCards 数组为空
**解决**: 在组件挂载时调用 shuffleCards()

### 6. 未使用文件导致构建失败
**问题**: cors-fix.ts 文件未使用但参与编译
**解决**: 删除未使用的文件

## 标准开发流程
1. 本地开发和测试
2. 提交代码
   ```bash
   git add -A
   git commit -m "描述更改"
   git push origin main
   ```
3. 自动部署（Render + Vercel）
4. 等待 3-5 分钟
5. 测试生产环境

## 当前功能
- [x] 问题输入
- [x] AI 推荐牌阵（单牌、三牌、五牌）
- [x] 洗牌抽牌
- [x] AI 解读结果
- [x] 22张大阿卡纳牌

## 待开发功能
### 基础设施
- [ ] 用户账号系统
- [ ] PostgreSQL 数据库升级
- [ ] 数据持久化

### 核心功能
- [ ] 完整78张塔罗牌
- [ ] 更多专业牌阵
- [ ] 语音输入/输出
- [ ] 历史记录查看

### 变现功能
- [ ] 订阅制系统
- [ ] 支付集成
- [ ] 免费/付费限制
- [ ] 深度解读付费

### 营销功能
- [ ] 分享卡片生成
- [ ] 邀请系统
- [ ] 每日运势推送
- [ ] SEO 优化

## 收入目标分析
目标：$10,000/月

建议方案：
- 1000个订阅用户 × $10/月
- 或 500个订阅 × $20/月
- 或混合模式：订阅 + 单次付费

## 重要提醒
1. **数据库必须升级**：当前 SQLite 在 Render 免费版会丢失数据
2. **API Key 安全**：生产环境不要在代码中暴露
3. **成本控制**：监控 OpenAI API 使用量

## 快速恢复指令
如果 Claude Code 会话丢失，使用以下信息快速恢复：
```
我在开发一个塔罗占卜应用，使用 React + Express + Prisma + SQLite。
后端部署在 Render: https://tarot-backend-522n.onrender.com
前端部署在 Vercel: https://tarot-app-rose.vercel.app
代码在: ~/Desktop/tarot
主要问题是数据库初始化和 CORS 配置
```

## 版本迭代规划

### 收入模型分析

#### 方案A：纯订阅制
- **定价**: $9.99/月
- **需要**: 1,000 个付费用户
- **转化率**: 假设 2-3% 转化率
- **总用户**: 需要 30,000-50,000 月活用户

#### 方案B：混合变现
- **订阅**: $4.99/月 × 500人 = $2,500
- **单次付费**: 平均 $5/次 × 1,500次 = $7,500
- **优势**: 降低付费门槛，增加收入来源

### 核心功能支撑

#### 1. 提高付费意愿的功能
- **深度个性化**: 基于生日、历史记录的定制解读
- **专属占卜师**: AI 记住用户，形成长期陪伴
- **精准预测验证**: 让用户感受到"真的很准"

#### 2. 提高使用频率的功能
- **每日运势**: 培养日常打开习惯
- **周期性占卜**: 月度、季度运势报告
- **情境触发**: 重要决策前的占卜需求

#### 3. 提高客单价的功能
- **高级牌阵**: 10牌以上的复杂牌阵
- **语音实时解读**: 模拟真人占卜体验
- **PDF报告导出**: 专业占卜报告

### 获客与留存策略

#### 获客成本控制
- **病毒传播**: 占卜结果生成精美图片分享
- **SEO内容**: "2025年运势"等高搜索词
- **KOL合作**: 星座博主推广
- **目标**: CAC < $10（客户获取成本）

#### 留存率提升
- **首月留存**: 目标 40%+
- **半年留存**: 目标 20%+
- **关键**: 建立情感连接，不只是工具

### 竞争优势

#### 差异化定位
1. **AI + 传统**: 结合 AI 智能和传统塔罗智慧
2. **专业性**: 完整78张牌，专业牌阵
3. **便利性**: 随时随地，无需预约

#### 定价心理
- 对比线下占卜师：$50-100/次
- 我们的定价：$10/月无限次
- 价值感知：超高性价比

### 实施优先级

#### Phase 1（1-2个月）
- 用户系统 + 支付
- 完整78张牌
- 基础订阅功能

#### Phase 2（3-4个月）
- 个性化引擎
- 社交分享
- 内容营销

#### Phase 3（5-6个月）
- 高级功能
- 多语言版本
- 优化转化率

### 关键指标
- LTV（用户生命周期价值）> $60
- 月流失率 < 15%
- 付费转化率 > 3%

## 更新日志
- 2025-07-23: 初始部署成功
- 2025-07-23: 修复 TypeScript 类型错误
- 2025-07-23: 修复数据库初始化
- 2025-07-23: 修复 CORS 配置
- 2025-07-23: 修复洗牌页面
- 2025-07-23: 增强错误处理
- 2025-07-23: 添加版本迭代规划