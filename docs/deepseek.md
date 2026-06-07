# DeepSeek API 接入

当前项目已经支持 DeepSeek Chat Completions API。没有配置 `DEEPSEEK_API_KEY` 时，服务会继续使用 mock 回复；配置后，文本消息会转发给 DeepSeek 并把模型回复返回给微信用户。

## 1. 获取 API Key

打开 DeepSeek Platform：

```text
https://platform.deepseek.com/
```

登录后创建 API Key。请只把 API Key 放到本地 `.env`，不要提交到 Git。

## 2. 配置 .env

编辑 `.env`：

```env
DEEPSEEK_API_KEY=你的DeepSeek API Key
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-flash
DEEPSEEK_TIMEOUT_MS=8000
DEEPSEEK_MAX_TOKENS=800
```

推荐先使用 `deepseek-v4-flash`，响应更适合微信公众号测试号场景。需要更强回答质量时，可以改为：

```env
DEEPSEEK_MODEL=deepseek-v4-pro
```

## 3. 重启服务

修改 `.env` 后需要重启：

```bash
npm run dev
```

## 4. 微信里测试

保持 tunnel 或 ngrok 正在运行，然后给测试号发送文本消息。服务会调用 DeepSeek，并返回 AI 回复。

如果 DeepSeek API 超时、Key 错误或余额不足，微信会收到：

```text
AI 服务暂时不可用，请稍后再试。
```

## 5. 安全注意事项

- 不要把 `DEEPSEEK_API_KEY` 写进代码。
- 不要提交真实 `.env`。
- 不要在日志里打印 API Key。
- 当前项目不保存用户消息到文件或数据库。
