# 版本历史

## v1.0 - 2025-07-21
**版本说明**：基础流程跑通，gpt3.5，good prompt，无UI

### 功能特性
- ✅ 完整的塔罗占卜流程
  - 开始占卜
  - 输入问题（支持语音输入）
  - AI 分析问题并推荐牌阵
  - 洗牌与抽牌
  - AI 解读每张牌
- ✅ 使用 OpenAI GPT-3.5-turbo 模型
- ✅ 优化的提示词，提供温柔、富有洞察力的解读
- ✅ 线框图 UI（白底黑字，无样式）

### 技术栈
- **前端**：React 18 + TypeScript + Vite + Zustand
- **后端**：Node.js + Express + TypeScript + Prisma
- **数据库**：SQLite
- **AI**：OpenAI GPT-3.5-turbo API
- **其他**：Web Speech API（语音输入）

### 数据结构
- 78 张塔罗牌（完整牌组）
- 3 种牌阵：单牌阵、三牌阵、凯尔特十字阵
- 支持正逆位解读

### API 配置
```env
AI_SERVICE=openai
OPENAI_API_KEY=您的API密钥
```

### 已知特性
- 如果 API 调用失败，会自动使用高质量的模拟数据
- 支持多种问题类型的智能识别（爱情、事业、选择等）
- 响应式设计，适配移动端

### 下一步计划
- 添加 UI 设计
- 用户系统
- 历史记录
- 更多功能...