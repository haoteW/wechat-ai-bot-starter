# WeChat Official Account AI Bot starter

这是一个微信公众号测试号 AI Bot 的本地开发 MVP。它可以通过 Cloudflare Tunnel 或 ngrok 暴露成本地公网 HTTPS 服务，在微信公众平台测试号后台完成服务器验证，并接收用户文本消息返回 AI 回复。

当前版本支持 DeepSeek API。没有配置 `DEEPSEEK_API_KEY` 时会自动使用 mock 回复，不使用数据库，不保存用户消息。

## 当前能力

- `GET /wechat`：完成微信服务器 URL + Token 验证。
- `POST /wechat`：接收微信 XML 消息。
- 支持文本消息调用 DeepSeek 回复。
- 未配置 DeepSeek API Key 时使用 mock 回复。
- 非文本消息返回固定提示。
- 使用 `.env` 管理本地配置。
- 提供 Cloudflare Tunnel、ngrok、微信测试号和 DeepSeek 配置文档。

## 安装依赖

```bash
npm install
```

## 配置 .env

复制示例配置：

```bash
cp .env.example .env
```

Windows PowerShell 可以使用：

```powershell
Copy-Item .env.example .env
```

修改 `.env`：

```env
PORT=3000
WECHAT_TOKEN=你自定义的Token
WECHAT_APP_ID=
WECHAT_APP_SECRET=
DEEPSEEK_API_KEY=你的DeepSeek API Key
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-flash
DEEPSEEK_TIMEOUT_MS=8000
DEEPSEEK_MAX_TOKENS=800
```

`WECHAT_TOKEN` 必须和微信测试号后台配置的 Token 完全一致。

`DEEPSEEK_API_KEY` 不填时会使用 mock 回复；填入后会调用 DeepSeek API。

不要提交 `.env`，不要提交 appsecret，也不要提交 DeepSeek / OpenAI API Key 或其他密钥。

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

## DeepSeek API

官方 OpenAI 兼容 base URL：

```text
https://api.deepseek.com
```

当前默认模型：

```text
deepseek-v4-flash
```

需要更强模型时可以改：

```env
DEEPSEEK_MODEL=deepseek-v4-pro
```

更多说明见 [docs/deepseek.md](docs/deepseek.md)。

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
- 查看本地服务终端是否有 XML 解析错误或 DeepSeek API 错误。

### DeepSeek 返回失败

- 确认 `.env` 里已经填写 `DEEPSEEK_API_KEY`。
- 确认 API Key 有效且账户有余额。
- 修改 `.env` 后重启服务。
- 如果微信端经常超时，可以先使用 `deepseek-v4-flash`，并适当降低 `DEEPSEEK_MAX_TOKENS`。

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
- 不提交 appsecret。
- 不提交 DeepSeek / OpenAI API Key。
- 不把用户消息永久保存到文件。
- 日志中不打印敏感环境变量。

## 后续计划

- 增加多轮上下文。
- 增加限流。
- 增加隐私保护和敏感信息处理。
