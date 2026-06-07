# Contributing

Thanks for contributing to WeChat AI Bot Starter.

## Ways to contribute

- Report bugs
- Improve documentation
- Submit feature requests
- Open pull requests

## Local development

1. Fork the repository.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env`.
4. Configure `WECHAT_TOKEN` and optional AI provider settings.
5. Start the service with `npm run dev`.
6. Use Cloudflare Tunnel or ngrok to test with a WeChat Official Account test account.

## Pull requests

Please include:

- What changed
- How you tested it
- Any WeChat test account or tunnel configuration notes
- Screenshots or logs when useful, without exposing secrets

## Security rules

- Never commit `.env`.
- Never commit `WECHAT_APP_SECRET`.
- Never commit OpenAI, DeepSeek, or other AI provider API keys.
- Do not log sensitive environment variables.
- Avoid storing raw user messages unless the feature explicitly requires it and the privacy impact is documented.
