# 微信公众号测试号配置

## 1. 打开测试号页面

打开微信公众平台测试号页面：

```text
https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login
```

扫码登录后进入测试号管理页面。

## 2. 获取 appID 和 appsecret

页面上会显示测试号的 `appID` 和 `appsecret`。

开发阶段可以把它们填到 `.env`：

```env
WECHAT_APP_ID=你的测试号 appID
WECHAT_APP_SECRET=你的测试号 appsecret
```

当前 MVP 不会读取或使用这两个值。不要把真实 `.env` 提交到 Git。

## 3. 设置 Token 和 URL

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

修改 `.env` 里的 Token：

```env
WECHAT_TOKEN=你自定义的Token
```

测试号后台的 Token 必须和 `.env` 中的 `WECHAT_TOKEN` 完全一致。

启动本地服务：

```bash
npm run dev
```

用 Cloudflare Tunnel 或 ngrok 获取公网 HTTPS 地址后，在测试号后台填写：

```text
URL: https://你的公网域名/wechat
Token: 与 WECHAT_TOKEN 一致
```

消息加解密方式暂时选择明文模式。

## 4. 保存配置

点击保存时，微信服务器会请求：

```text
GET /wechat
```

服务会根据 `WECHAT_TOKEN` 校验微信传来的 `signature`。校验成功后返回 `echostr`，配置即可保存。

## 5. 关注测试号并发送消息

在测试号页面找到测试号二维码，用微信扫码关注。

给测试号发送文本消息。如果配置正常，服务会收到：

```text
POST /wechat
```

然后返回类似：

```text
我收到了：你好。AI 接入将在下一步完成。
```

如果发送图片、语音、事件等非文本消息，会返回：

```text
当前仅支持文本消息。
```
