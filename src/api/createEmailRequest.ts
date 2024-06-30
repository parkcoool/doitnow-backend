import axios from "axios";

import makeSignature from "util/makeSignature";

interface ReqBody {
  email: string;
  code: string;
}

interface ResBody {
  requestId: string;
  count: number;
}

const templateSid = 10288;

export default async function createEmailRequest({ email, code }: ReqBody) {
  const response = await axios.post<ResBody>(
    "https://mail.apigw.ntruss.com/api/v1/mails",
    {
      templateSid,
      recipients: [{ address: email, type: "R" }],
      parameters: { code },
    },
    {
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
    }
  );
  return response;
}
