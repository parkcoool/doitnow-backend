import { QueryError } from "mysql2";
import { ER_DUP_ENTRY } from "mysql-error-keys";

import patchUserByEmail from "model/user/patchUserByEmail";
import getUserByEmail from "model/user/getUserByEmail";

import ServerError from "error/ServerError";
import InvalidValueError from "error/user/InvalidValueError";
import DuplicationError from "error/user/DuplicationError";
import NotFoundError from "error/user/NotFoundError";

import getSaltedHash from "util/common/getSaltedHash";
import verifyEmail from "util/verify/verifyEmail";
import verifyPassword from "util/verify/verifyPassword";

import type { RequestHandler } from "express";
import type { APIResponse } from "api";

interface ReqBody {
  email?: string;
  password?: string;
}

interface ResBody extends APIResponse {}

const updatePrivateProfile: RequestHandler<{}, ResBody, ReqBody> = async function (req, res, next) {
  const email = req.email;
  if (email === undefined) {
    return next(new ServerError("사용자의 이메일 주소를 불러올 수 없어요."));
  }

  const { email: newEmail, password } = req.body;

  // 값 검증
  if (newEmail !== undefined && !verifyEmail(newEmail)) return next(new InvalidValueError("email"));
  if (password !== undefined && !verifyPassword(password)) return next(new InvalidValueError("password"));

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
        return next(new DuplicationError("이메일"));
      }
    }
  }

  return res.status(200).json({
    message: "사용자 정보가 변경됐어요.",
  });
};

export default updatePrivateProfile;
