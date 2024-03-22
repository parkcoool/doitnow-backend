import jwt from "jsonwebtoken";
import { z } from "zod";

import deleteEmailVerifyCode from "model/emailVerifyCode/deleteEmailVerifyCode";

import InvalidValueError from "error/user/InvalidValueError";

import getSaltedHash from "util/getSaltedHash";

import emailVerifyCodeSchema from "schema/emailVerifyCode";

import type { RequestHandler } from "express";
import type { APIResponse } from "api";

export const VerifyEmailBody = z.object({
  email: emailVerifyCodeSchema.email,
  code: emailVerifyCodeSchema.code,
});

interface ResBody extends APIResponse {
  token: {
    token: string;
    expiresIn: number;
  };
}

const verifyEmail: RequestHandler<{}, ResBody, z.infer<typeof VerifyEmailBody>> = async function (req, res, next) {
  const email = req.body.email.trim();
  const { code } = req.body;

  const hashedCode = getSaltedHash(code, process.env.EMAIL_VERIFY_CODE_SALT!);

  const queryResult = await deleteEmailVerifyCode({
    email,
    code: hashedCode,
  });
  if (queryResult[0].affectedRows === 0) {
    return next(new InvalidValueError(["인증 코드"], "값이 올바르지 않아요."));
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY!, { expiresIn: "1h" });

  res.status(200).send({
    token: {
      token,
      expiresIn: 1 / 24,
    },
    message: "이메일이 인증됐어요.",
  });
};

export default verifyEmail;
