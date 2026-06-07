import { Router } from "express";
import { createTextReply } from "../services/reply";
import { verifyWechatSignature } from "../utils/signature";
import { buildTextReplyXml, parseWechatMessageXml } from "../utils/xml";
import { canUserSendMessage } from "../utils/usageGuard";

export const wechatRouter = Router();

wechatRouter.get("/", (req, res) => {
  const token = process.env.WECHAT_TOKEN;
  const { signature, timestamp, nonce, echostr } = req.query;

  if (
    !token ||
    typeof signature !== "string" ||
    typeof timestamp !== "string" ||
    typeof nonce !== "string" ||
    typeof echostr !== "string"
  ) {
    res.sendStatus(403);
    return;
  }

  const isValid = verifyWechatSignature({
    token,
    signature,
    timestamp,
    nonce
  });

  if (!isValid) {
    res.sendStatus(403);
    return;
  }

  res.type("text/plain").send(echostr);
});

wechatRouter.post("/", async (req, res) => {
  try {
    const rawXml = typeof req.body === "string" ? req.body : "";
    const message = await parseWechatMessageXml(rawXml);

    let content = "当前仅支持文本消息。";

    if (message.MsgType === "text") {
      content = canUserSendMessage(message.FromUserName)
        ? await createTextReply(message.Content ?? "")
        : "消息太频繁了，请稍后再试。";
    }

    const replyXml = buildTextReplyXml({
      toUserName: message.FromUserName,
      fromUserName: message.ToUserName,
      content
    });

    res.type("application/xml; charset=utf-8").send(replyXml);
  } catch (error) {
    console.error("Failed to handle WeChat message:", error instanceof Error ? error.message : error);
    res.sendStatus(400);
  }
});
