type DeepSeekMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type DeepSeekChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

const DEFAULT_BASE_URL = "https://api.deepseek.com";
const DEFAULT_MODEL = "deepseek-v4-flash";
const DEFAULT_TIMEOUT_MS = 8000;
const DEFAULT_MAX_TOKENS = 800;

export async function createDeepSeekReply(userMessage: string): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not configured");
  }

  const baseUrl = process.env.DEEPSEEK_BASE_URL || DEFAULT_BASE_URL;
  const model = process.env.DEEPSEEK_MODEL || DEFAULT_MODEL;
  const timeoutMs = Number(process.env.DEEPSEEK_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS;
  const maxTokens = Number(process.env.DEEPSEEK_MAX_TOKENS) || DEFAULT_MAX_TOKENS;
  const endpoint = `${baseUrl.replace(/\/$/, "")}/chat/completions`;

  const messages: DeepSeekMessage[] = [
    {
      role: "system",
      content:
        "你是一个微信公众号测试号里的中文 AI 助手。请简洁、友好地回答用户问题。不要编造你不知道的事实。"
    },
    {
      role: "user",
      content: userMessage
    }
  ];

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages,
      thinking: {
        type: "disabled"
      },
      stream: false,
      max_tokens: maxTokens
    }),
    signal: AbortSignal.timeout(timeoutMs)
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API request failed with status ${response.status}`);
  }

  const data = (await response.json()) as DeepSeekChatCompletionResponse;
  const content = data.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("DeepSeek API returned an empty reply");
  }

  return content;
}
