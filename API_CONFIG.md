# Claude API 配置指南

## 1. 获取 API 密钥

1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 登录或创建账户
3. 在 API Keys 页面创建新的 API 密钥
4. 复制密钥（格式类似：`sk-ant-api03-xxxxx`）

## 2. 配置 API 密钥

编辑后端配置文件：
```bash
cd ~/Desktop/tarot/backend
```

打开 `.env` 文件，找到这一行：
```
ANTHROPIC_API_KEY=your_claude_api_key_here
```

替换为你的实际密钥：
```
ANTHROPIC_API_KEY=sk-ant-api03-你的实际密钥
```

## 3. 重启服务

保存文件后，需要重启后端服务：

```bash
# 停止当前服务
pkill -f tsx

# 重新启动后端
cd ~/Desktop/tarot/backend
npm run dev
```

## 4. 测试 API

配置成功后，可以通过以下方式测试：

1. 在应用中输入问题
2. 点击"下一步"
3. 如果能看到 AI 分析结果和牌阵推荐，说明配置成功

## 注意事项

- **保密性**：不要将 API 密钥提交到版本控制系统
- **费用**：Claude API 是按使用量收费的，请注意用量
- **限制**：免费账户可能有请求频率限制

## 故障排查

如果配置后仍无法使用：

1. 检查密钥是否正确（没有多余的空格）
2. 确认账户有足够的余额
3. 查看后端日志：`cd ~/Desktop/tarot/backend && tail -f backend.log`

## 备用方案

如果暂时没有 Claude API 密钥，应用会使用简单的备用逻辑：
- 基于关键词推荐牌阵
- 使用预设的解读模板

虽然效果不如 AI，但仍可以体验完整流程。