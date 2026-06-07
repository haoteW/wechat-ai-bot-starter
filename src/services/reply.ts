import { createDeepSeekReply } from "./deepseek";

export async function createTextReply(userMessage: string): Promise<string> {
  if (!process.env.DEEPSEEK_API_KEY) {
    return createMockReply(userMessage);
  }

  try {
    return await createDeepSeekReply(userMessage);
  } catch (error) {
    console.error("DeepSeek reply failed:", error instanceof Error ? error.message : error);
    return "AI 服务暂时不可用，请稍后再试。";
  }
}

export function createMockReply(userMessage: string): string {
  return `我收到了：${userMessage}。AI 接入将在下一步完成。`;
}
