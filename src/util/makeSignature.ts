import crypto from "crypto";

export default function makeSignature(
  method: string,
  url: string,
  timestamp: string,
  accessKey: string,
  secretKey: string
) {
  const message: string = `${method} ${url}\n${timestamp}\n${accessKey}`;

  const signingKey: crypto.KeyObject = crypto.createSecretKey(Buffer.from(secretKey, "utf-8"));
  const hmac: crypto.Hmac = crypto.createHmac("sha256", signingKey);
  hmac.update(message);

  const encodeBase64String: string = hmac.digest("base64");

  return encodeBase64String;
}
