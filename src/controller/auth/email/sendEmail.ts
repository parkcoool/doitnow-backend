import createEmailVerifyCode from "model/emailVerifyCode/createEmailVerifyCode";

import ServerError from "error/ServerError";

import getSaltedHash from "util/common/getSaltedHash";

import type { RequestHandler } from "express";

interface ReqBody {
  email: string;
}

interface ResBody {}

const sendEmail: RequestHandler<{}, ResBody, ReqBody> = async function (req, res, next) {
  const email = req.body.email.trim();

  const ipAddress = req.ip;
  const code = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
  const hashedCode = getSaltedHash(code, process.env.EMAIL_VERIFY_CODE_SALT!);
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 5);

  const queryResult = await createEmailVerifyCode({ email, code: hashedCode, ipAddress, expiresAt });
  if (queryResult[0].affectedRows === 0) {
    return next(new ServerError("인증 코드를 등록하는 중에 문제가 발생했어요."));
  }

  try {
    // TODO: 이메일 발송

    // 테스트용 콘솔 출력
    console.log(code);
  } catch (e) {
    return next(new ServerError("이메일을 발송하는 중에 문제가 발생했어요."));
  }
};

export default sendEmail;
