import { createDeepSeekReply } from "./deepseek";
import { createOpenAIReply } from "./openai";

type AiProvider = "mock" | "deepseek" | "openai";

const DEFAULT_MAX_MESSAGE_LENGTH = 1000;

export async function createAiReply(userMessage: string): Promise<string> {
  const normalizedMessage = normalizeUserMessage(userMessage);
  const provider = getAiProvider();

  if (!normalizedMessage) {
    return "请发送一段文本消息。";
  }

  if (provider === "mock") {
    return createMockReply(normalizedMessage);
  }

  try {
    if (provider === "openai") {
      return await createOpenAIReply(normalizedMessage);
    }

    return await createDeepSeekReply(normalizedMessage);
  } catch (error) {
    console.error(`${provider} reply failed:`, error instanceof Error ? error.message : error);
    return "AI 服务暂时不可用，请稍后再试。";
  }
}

export function createMockReply(userMessage: string): string {
  return `我收到了：${userMessage}。AI 接入已准备好，你可以通过 AI_PROVIDER 切换 provider。`;
}

function getAiProvider(): AiProvider {
  const rawProvider = (process.env.AI_PROVIDER || "").toLowerCase();

  if (rawProvider === "openai") {
    return "openai";
  }

  if (rawProvider === "deepseek") {
    return "deepseek";
  }

  if (process.env.OPENAI_API_KEY) {
    return "openai";
  }

  if (process.env.DEEPSEEK_API_KEY) {
    return "deepseek";
  }

  return "mock";
}

function normalizeUserMessage(userMessage: string): string {
  const maxLength = Number(process.env.MAX_USER_MESSAGE_LENGTH) || DEFAULT_MAX_MESSAGE_LENGTH;
  const trimmed = userMessage.trim();

  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return trimmed.slice(0, maxLength);
}
