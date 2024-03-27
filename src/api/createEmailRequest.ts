import request from "request";

import makeSignature from "util/makeSignature";

interface CreateEmailRequestProps {
  email: string;
  code: string;
}

const templateSid = 10288;

export default function createEmailRequest({ email, code }: CreateEmailRequestProps) {
  const res = request.post("https://mail.apigw.ntruss.com/api/v1/mails", {
    headers: {
      "Content-Type": "application/json",
      "x-ncp-apigw-timestamp": Date.now().toString(),
      "x-ncp-iam-access-key": process.env.NAVER_CLOUD_ACCESS_KEY_ID!,
      "x-ncp-apigw-signature-v2": makeSignature(
        "POST",
        "/api/v1/mails",
        Date.now().toString(),
        process.env.NAVER_CLOUD_ACCESS_KEY_ID!,
        process.env.NAVER_CLOUD_SECRET_KEY!
      ),
    },
    body: {
      templateSid,
      recipients: [{ address: email, type: "R" }],
      parameters: { code },
    },
  });

  return res;
}
