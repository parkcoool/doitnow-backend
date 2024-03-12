import verifyEmailRouter from "./";

import jwt from "jsonwebtoken";

import StatusCode from "constant/statusCode";
import deleteEmailVerifyCode from "model/emailVerify/deleteEmailVerifyCode";

import type { APIResponse } from "api";
import type { Token } from "auth";

interface ReqeustBody {
  email: string;
  code: string;
}

interface ResponseBody {
  token: Token | null;
}

verifyEmailRouter.post<"/", {}, APIResponse<ResponseBody>, ReqeustBody>("/", async (req, res, next) => {
  const email = req.body.email.trim();

  try {
    const queryResult = await deleteEmailVerifyCode(req.body.code, email);

    if (queryResult.affectedRows === 0) {
      res.status(200).send({
        code: StatusCode.VERIFY_CODE_NOT_MATCHED,
        message: "인증 코드가 일치하지 않습니다.",
        result: { token: null },
      });
      return;
    }
  } catch (e) {
    res.status(200).send({
      code: StatusCode.SERVER_ERROR,
      message: "서버에서 오류가 발생했습니다.",
      result: { token: null },
    });
    return;
  }

  // 인증 코드가 일치하면 토큰을 발급
  res.status(200).send({
    code: StatusCode.SUCCESS,
    message: "이메일 인증에 성공했습니다.",
    result: {
      token: { token: jwt.sign({ email: email }, process.env.JWT_SECRET!, { expiresIn: "1h" }), expiresIn: 1 / 24 },
    },
  });
});
