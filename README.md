# WeChat Official Account AI Bot Starter

这是一个微信公众号测试号 AI Bot 的本地开发 MVP。它可以通过 Cloudflare Tunnel 或 ngrok 暴露成本地公网 HTTPS 服务，在微信公众平台测试号后台完成服务器验证，并接收用户文本消息返回 AI 回复。

当前版本已经在微信测试号链路中测试通过，支持 `mock`、`deepseek`、`openai` 三种 AI provider 模式。不使用数据库，不永久保存用户消息，适合作为微信公众号 AI Bot 的开源 starter template。

## 当前能力

- `GET /wechat`：完成微信服务器 URL + Token 验证。
- `POST /wechat`：接收微信 XML 消息。
- 支持文本消息 AI 回复。
- 支持 `AI_PROVIDER=mock | deepseek | openai`。
- 未配置 AI API Key 时可以使用 mock 回复。
- 非文本消息返回固定提示。
- 支持用户消息长度限制。
- 支持简单内存频率限制。
- 使用 `.env` 管理本地配置。
- 提供 Cloudflare Tunnel、ngrok、微信测试号和 AI provider 配置文档。

## 项目结构

```text
src/
  index.ts              Express app entry
  routes/wechat.ts      WeChat GET/POST webhook route
  services/ai.ts        AI provider selector
  services/deepseek.ts  DeepSeek provider
  services/openai.ts    OpenAI-compatible provider
  services/reply.ts     Reply service
  utils/signature.ts    WeChat SHA1 signature verification
  utils/usageGuard.ts   Simple in-memory usage guard
  utils/xml.ts          WeChat XML parser and builder

docs/
  tunnel.md
  wechat-test-account.md
  deepseek.md
```

## 安装依赖

```bash
npm install
```

## 配置 `.env`

复制示例配置：

```bash
cp .env.example .env
```

Windows PowerShell 可以使用：

```powershell
Copy-Item .env.example .env
```

推荐 `.env` 配置示例：

```env
PORT=3000
WECHAT_TOKEN=你自定义的Token
WECHAT_APP_ID=
WECHAT_APP_SECRET=

AI_PROVIDER=mock
MAX_USER_MESSAGE_LENGTH=1000
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=5

DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_TIMEOUT_MS=8000
DEEPSEEK_MAX_TOKENS=800

OPENAI_API_KEY=
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4.1-mini
OPENAI_TIMEOUT_MS=8000
OPENAI_MAX_TOKENS=800
```

`WECHAT_TOKEN` 必须和微信测试号后台配置的 Token 完全一致。

不要提交 `.env`，不要提交 `WECHAT_APP_SECRET`，也不要提交 DeepSeek、OpenAI 或其他 AI provider API Key。

## AI Provider 配置

### Mock 模式

适合先跑通微信测试号链路，不调用外部 AI API：

```env
AI_PROVIDER=mock
```

### DeepSeek 模式

```env
AI_PROVIDER=deepseek
DEEPSEEK_API_KEY=你的DeepSeek API Key
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
```

### OpenAI 模式

```env
AI_PROVIDER=openai
OPENAI_API_KEY=你的OpenAI API Key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4.1-mini
```

如果没有显式设置 `AI_PROVIDER`，服务会根据可用的 API Key 自动选择 provider；如果没有任何 API Key，则自动使用 mock 回复。

## 启动本地服务

开发模式：

```bash
npm run dev
```

构建：

```bash
npm run build
```

运行构建后的服务：

```bash
npm start
```

服务默认监听：

```text
http://localhost:3000
```

微信接口路径是：

```text
http://localhost:3000/wechat
```

## 暴露本地服务

方式 A：Cloudflare Tunnel quick tunnel

```bash
cloudflared tunnel --url http://localhost:3000
```

拿到类似 `https://xxxx.trycloudflare.com` 的地址后，微信测试号后台 URL 填：

```text
https://xxxx.trycloudflare.com/wechat
```

方式 B：ngrok

```bash
ngrok http 3000
```

拿到类似 `https://xxxx.ngrok-free.app` 的地址后，微信测试号后台 URL 填：

```text
https://xxxx.ngrok-free.app/wechat
```

更多说明见 [docs/tunnel.md](docs/tunnel.md)。

## 微信测试号后台配置

打开微信公众平台测试号页面：

```text
https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login
```

配置：

```text
URL: https://你的公网域名/wechat
Token: 与 .env 里的 WECHAT_TOKEN 一致
消息加解密方式: 明文模式
```

保存配置后，微信会请求 `GET /wechat`。验证通过后，扫码关注测试号并发送文本消息。

更多说明见 [docs/wechat-test-account.md](docs/wechat-test-account.md)。

## 已测试通过的本地开发流程

```bash
npm install
cp .env.example .env
npm run dev
cloudflared tunnel --url http://localhost:3000
```

然后在微信测试号后台配置：

```text
URL: https://你的-tunnel-地址/wechat
Token: 与 WECHAT_TOKEN 一致
消息加解密方式: 明文模式
```

扫码关注测试号后发送文本消息，应该能收到 mock / DeepSeek / OpenAI 回复。

## 使用限制与安全保护

### 消息长度限制

默认最多处理 1000 个字符：

```env
MAX_USER_MESSAGE_LENGTH=1000
```

超出部分会被裁剪，避免过长输入导致请求过慢或成本过高。

### 简单频率限制

默认每个微信用户每 60 秒最多 5 条文本消息：

```env
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=5
```

当前实现是内存级 usage guard，适合本地开发和 MVP。生产环境建议改成 Redis、数据库或网关级限流。

## 常见错误排查

### 微信后台提示 Token 验证失败

- 确认 `.env` 里的 `WECHAT_TOKEN` 和微信后台 Token 完全一致。
- 修改 `.env` 后需要重启 `npm run dev`。
- 确认微信后台 URL 使用 HTTPS，并且路径是 `/wechat`。
- 确认 tunnel 或 ngrok 仍在运行。

### 微信后台无法访问 URL

- 确认本地服务正在运行，并监听 `http://localhost:3000`。
- 确认 tunnel 命令指向 `http://localhost:3000`。
- 免费 tunnel 地址变化后，需要更新微信后台 URL。

### 发送消息没有回复

- 确认已经扫码关注测试号。
- 确认微信后台配置保存成功。
- 确认发送的是文本消息。
- 查看本地服务终端是否有 XML 解析错误或 AI provider 错误。

### DeepSeek 返回失败

- 确认 `.env` 里已经填写 `DEEPSEEK_API_KEY`。
- 确认 `AI_PROVIDER=deepseek`，或未设置 `AI_PROVIDER` 但已配置 DeepSeek API Key。
- 确认 API Key 有效且账户有余额。
- 修改 `.env` 后重启服务。
- 如果微信端经常超时，可以降低 `DEEPSEEK_MAX_TOKENS`。

### OpenAI 返回失败

- 确认 `.env` 里已经填写 `OPENAI_API_KEY`。
- 确认 `AI_PROVIDER=openai`，或未设置 `AI_PROVIDER` 但已配置 OpenAI API Key。
- 确认模型名和账户额度可用。
- 修改 `.env` 后重启服务。
- 如果微信端经常超时，可以降低 `OPENAI_MAX_TOKENS`。

### 端口被占用

可以修改 `.env`：

```env
PORT=3001
```

然后 tunnel 也要改成对应端口：

```bash
cloudflared tunnel --url http://localhost:3001
```

或：

```bash
ngrok http 3001
```

## 安全要求

- 不提交 `.env`。
- 不提交 `WECHAT_APP_SECRET`。
- 不提交 DeepSeek / OpenAI API Key。
- 不把用户消息永久保存到文件。
- 日志中不打印敏感环境变量。
- 生产环境建议使用正式 HTTPS 域名、持久化限流和更完善的日志脱敏策略。

## 后续计划

- 增加多轮上下文。
- 增加 Redis / 数据库存储的生产级限流。
- 增加 Prompt 模板系统。
- 增加 Docker 部署。
- 增加企业微信机器人模式。
- 增加隐私保护和敏感信息处理。

## License

MIT
