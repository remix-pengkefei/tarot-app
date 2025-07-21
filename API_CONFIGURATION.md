# API 配置说明

## AI 服务配置

本应用支持两种 AI 服务：OpenAI (GPT) 和 Anthropic (Claude)。

### 使用 OpenAI (GPT)

1. 获取 OpenAI API Key：
   - 访问 https://platform.openai.com/api-keys
   - 创建新的 API key

2. 在后端配置：
   - 复制 `backend/.env.example` 为 `backend/.env`
   - 设置以下环境变量：
   ```
   AI_SERVICE=openai
   OPENAI_API_KEY=你的OpenAI API密钥
   ```

3. 模型说明：
   - 默认使用 `gpt-3.5-turbo` 模型（成本效益高）
   - 如需更强大的模型，可以在 `backend/src/services/openai.service.ts` 中修改为 `gpt-4` 或 `gpt-4-turbo-preview`

### 使用 Claude

1. 获取 Anthropic API Key：
   - 访问 https://console.anthropic.com/
   - 创建新的 API key

2. 在后端配置：
   - 设置以下环境变量：
   ```
   AI_SERVICE=claude
   ANTHROPIC_API_KEY=你的Claude API密钥
   ```

3. 模型说明：
   - 默认使用 `claude-3-haiku-20240307` 模型（快速且经济）
   - 如需更强大的模型，可以在 `backend/src/services/claude.service.ts` 中修改为 `claude-3-opus-20240229` 或 `claude-3-sonnet-20240229`

### 使用模拟数据（无需 API Key）

如果暂时不想配置 API key，应用会自动使用内置的智能回退机制，提供高质量的模拟数据。

### 切换 AI 服务

只需修改 `backend/.env` 文件中的 `AI_SERVICE` 值：
- `AI_SERVICE=openai` - 使用 OpenAI
- `AI_SERVICE=claude` - 使用 Claude

修改后重启后端服务即可生效。

### API 费用说明

- **OpenAI GPT-3.5-turbo**: 约 $0.001 / 1K tokens（非常经济）
- **OpenAI GPT-4**: 约 $0.03 / 1K tokens（更强大但更贵）
- **Claude Haiku**: 约 $0.00025 / 1K tokens（最经济）
- **Claude Sonnet**: 约 $0.003 / 1K tokens（平衡选择）
- **Claude Opus**: 约 $0.015 / 1K tokens（最强大）

每次占卜大约使用 1-2K tokens。

### 故障排除

1. 如果遇到 API 错误，请检查：
   - API key 是否正确设置
   - API key 是否有足够的额度
   - 网络连接是否正常

2. 应用会自动回退到模拟数据，确保服务不中断。

3. 查看后端日志了解具体错误信息：
   ```bash
   cd backend
   npm run dev
   ```