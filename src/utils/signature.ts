import crypto from "crypto";

type VerifyWechatSignatureInput = {
  token: string;
  signature: string;
  timestamp: string;
  nonce: string;
};

export function verifyWechatSignature(input: VerifyWechatSignatureInput): boolean {
  const expectedSignature = [input.token, input.timestamp, input.nonce]
    .sort()
    .join("");

  const sha1 = crypto.createHash("sha1").update(expectedSignature).digest("hex");

  return sha1 === input.signature;
}
