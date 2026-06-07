import { createAiReply } from "./ai";

export async function createTextReply(userMessage: string): Promise<string> {
  const reply = await createAiReply(userMessage);
  return reply;
}
