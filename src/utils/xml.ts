import { parseStringPromise } from "xml2js";

export type WechatMessage = {
  ToUserName: string;
  FromUserName: string;
  CreateTime?: string;
  MsgType: string;
  Content?: string;
};

type BuildTextReplyXmlInput = {
  toUserName: string;
  fromUserName: string;
  content: string;
};

type ParsedWechatXml = {
  xml?: Record<string, string[] | undefined>;
};

export async function parseWechatMessageXml(rawXml: string): Promise<WechatMessage> {
  if (!rawXml.trim()) {
    throw new Error("Empty XML body");
  }

  const parsed = (await parseStringPromise(rawXml, {
    trim: true,
    explicitArray: true
  })) as ParsedWechatXml;

  const xml = parsed.xml;
  const message = {
    ToUserName: getXmlValue(xml, "ToUserName"),
    FromUserName: getXmlValue(xml, "FromUserName"),
    CreateTime: getOptionalXmlValue(xml, "CreateTime"),
    MsgType: getXmlValue(xml, "MsgType"),
    Content: getOptionalXmlValue(xml, "Content")
  };

  return message;
}

export function buildTextReplyXml(input: BuildTextReplyXmlInput): string {
  const createTime = Math.floor(Date.now() / 1000);

  return [
    "<xml>",
    `  <ToUserName><![CDATA[${escapeCdata(input.toUserName)}]]></ToUserName>`,
    `  <FromUserName><![CDATA[${escapeCdata(input.fromUserName)}]]></FromUserName>`,
    `  <CreateTime>${createTime}</CreateTime>`,
    "  <MsgType><![CDATA[text]]></MsgType>",
    `  <Content><![CDATA[${escapeCdata(input.content)}]]></Content>`,
    "</xml>"
  ].join("\n");
}

function getXmlValue(xml: ParsedWechatXml["xml"], key: keyof WechatMessage): string {
  const value = getOptionalXmlValue(xml, key);

  if (!value) {
    throw new Error(`Missing required XML field: ${key}`);
  }

  return value;
}

function getOptionalXmlValue(xml: ParsedWechatXml["xml"], key: keyof WechatMessage): string | undefined {
  const value = xml?.[key];

  return Array.isArray(value) ? value[0] : undefined;
}

function escapeCdata(value: string): string {
  return value.replaceAll("]]>", "]]]]><![CDATA[>");
}
