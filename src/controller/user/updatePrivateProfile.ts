import jwt from "jsonwebtoken";
import { QueryError } from "mysql2";
import { ER_DUP_ENTRY } from "mysql-error-keys";
import { z } from "zod";

import patchUserByEmail from "model/user/patchUserByEmail";
import getUserByEmail from "model/user/getUserByEmail";

import ServerError from "error/ServerError";
import DuplicationError from "error/user/DuplicationError";
import NotFoundError from "error/user/NotFoundError";

import getSaltedHash from "util/getSaltedHash";

import tokenSchema from "schema/token";
import userSchema from "schema/user";

import type { JwtPayload } from "jsonwebtoken";
import type { RequestHandler } from "express";
import type { APIResponse } from "api";

export const UpdatePrivateProfileBody = z
  .object({
    emailToken: tokenSchema.token,
    password: userSchema.password,
  })
  .partial();

interface ResBody extends APIResponse {}

const updatePrivateProfile: RequestHandler<{}, ResBody, z.infer<typeof UpdatePrivateProfileBody>> = async function (
  req,
  res,
  next
) {
  const email = req.email;
  if (email === undefined) return next(new ServerError("사용자의 이메일 주소를 불러올 수 없어요."));

  const { emailToken, password } = req.body;
  const newEmail = emailToken && ((jwt.decode(emailToken) as JwtPayload).email as string);

  // 비밀번호가 변경되는 경우 새로운 비밀번호를 해싱한다.
  let hashedPassword: string | undefined;
  if (password !== undefined) {
    const users = (await getUserByEmail({ email }))[0];

    if (users.length === 0) {
      return next(new NotFoundError("사용자를 찾을 수 없어요."));
    }

    const salt = users[0].salt;
    hashedPassword = getSaltedHash(password, salt);
  }

  try {
    const queryResult = await patchUserByEmail({ email, patch: { email: newEmail, password: hashedPassword } });
    if (queryResult[0].affectedRows === 0) {
      return next(new NotFoundError("사용자를 찾을 수 없어요."));
    }
  } catch (error) {
    if (error instanceof Error) {
      if ((error as QueryError).code === ER_DUP_ENTRY) {
        return next(new DuplicationError(["이메일"]));
      }
    }
  }

  return res.status(200).json({
    message: "사용자 정보가 변경됐어요.",
  });
};

export default updatePrivateProfile;
