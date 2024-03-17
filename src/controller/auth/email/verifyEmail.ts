import jwt from "jsonwebtoken";

import deleteEmailVerifyCode from "model/emailVerifyCode/deleteEmailVerifyCode";
import ServerError from "error/ServerError";
import getSaltedHash from "util/common/getSaltedHash";

import type { RequestHandler } from "express";
import type { APIResponse } from "api";

interface ReqBody {
  email: string;
  code: string;
}

interface ResBody extends APIResponse {
  token: {
    token: string;
    expiresIn: number;
  };
}

const verifyEmail: RequestHandler<{}, ResBody, ReqBody> = async function (req, res, next) {
  const email = req.body.email.trim();
  const { code } = req.body;

  const hashedCode = getSaltedHash(code, process.env.EMAIL_VERIFY_CODE_SALT!);

  const queryResult = await deleteEmailVerifyCode({
    email,
    code: hashedCode,
  });
  if (queryResult[0].affectedRows === 0) {
    return next(new ServerError("인증 코드가 일치하지 않아요."));
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: "1h" });

  res.status(200).send({
    token: {
      token,
      expiresIn: 1 / 24,
    },
    message: "이메일이 인증됐어요.",
  });
};

export default verifyEmail;
