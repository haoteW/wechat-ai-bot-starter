# 本地服务公网 HTTPS 暴露

微信公众号测试号后台要求 URL 是公网可访问的 HTTPS 地址。开发阶段可以用 Cloudflare Tunnel 或 ngrok 把本地 `http://localhost:3000` 暴露出去。

## 方式 A：Cloudflare Tunnel quick tunnel

先启动本地服务：

```bash
npm run dev
```

再打开另一个终端运行：

```bash
cloudflared tunnel --url http://localhost:3000
```

命令会输出一个类似下面的 HTTPS 地址：

```text
https://xxxx.trycloudflare.com
```

微信公众号测试号后台的 URL 填：

```text
https://xxxx.trycloudflare.com/wechat
```

Token 填 `.env` 里的 `WECHAT_TOKEN`。

## 方式 B：ngrok

先启动本地服务：

```bash
npm run dev
```

再打开另一个终端运行：

```bash
ngrok http 3000
```

命令会输出一个类似下面的 HTTPS 地址：

```text
https://xxxx.ngrok-free.app
```

微信公众号测试号后台的 URL 填：

```text
https://xxxx.ngrok-free.app/wechat
```

Token 填 `.env` 里的 `WECHAT_TOKEN`。

## 注意事项

- 每次重新启动 quick tunnel 或免费 ngrok，公网地址可能变化，需要回到微信测试号后台更新 URL。
- URL 必须使用 HTTPS。
- URL 必须带 `/wechat` 路径。
- 本地服务必须保持运行，否则微信服务器验证和消息转发都会失败。
