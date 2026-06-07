type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type ChatResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

const DEFAULT_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_MODEL = "gpt-4.1-mini";
const DEFAULT_TIMEOUT_MS = 8000;
const DEFAULT_MAX_TOKENS = 800;

export async function createOpenAIReply(userMessage: string): Promise<string> {
  const token = process.env.OPENAI_API_KEY;

  if (!token) {
    throw new Error("OpenAI provider is not configured");
  }

  const baseUrl = process.env.OPENAI_BASE_URL || DEFAULT_BASE_URL;
  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;
  const timeoutMs = Number(process.env.OPENAI_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS;
  const maxTokens = Number(process.env.OPENAI_MAX_TOKENS) || DEFAULT_MAX_TOKENS;
  const endpoint = `${baseUrl.replace(/\/$/, "")}/chat/completions`;

  const messages: ChatMessage[] = [
    {
      role: "system",
      content: "你是一个微信公众号测试号里的中文 AI 助手。请简洁、友好地回答用户问题。不要编造你不知道的事实。"
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
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      max_tokens: maxTokens
    }),
    signal: AbortSignal.timeout(timeoutMs)
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}`);
  }

  const data = (await response.json()) as ChatResponse;
  const content = data.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("OpenAI returned an empty reply");
  }

  return content;
}
