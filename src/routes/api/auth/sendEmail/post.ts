import sendEmailRouter from "./";

import StatusCode from "constant/statusCode";

import type { APIResponse } from "api";

interface ReqeustBody {
  email: string;
}

interface ResponseBody {
  email: string;
  expiresAt: string;
}

sendEmailRouter.post<"/", {}, APIResponse<ResponseBody | null>, ReqeustBody>("/", async (req, res, next) => {
  if (/\S+@\S+\.\S+/.test(req.body.email) === false) {
    return res.status(200).send({
      code: StatusCode.INVALID_EMAIL,
      message: "이메일 주소가 올바르지 않습니다.",
      result: null,
    });
  }

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 5);
  // expiresAt.setSeconds(expiresAt.getSeconds() + 5);

  // 이메일 주소를 확인하여 인증 코드를 발송하는 로직
  // ...

  res.status(200).send({
    code: StatusCode.SUCCESS,
    message: "인증 코드를 성공적으로 발송하였습니다.",
    result: {
      email: req.body.email,
      expiresAt: expiresAt.toISOString(),
    },
  });
});
