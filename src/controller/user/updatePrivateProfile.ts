import patchUserByEmail from "model/user/patchUserByEmail";
import getUserByEmail from "model/user/getUserByEmail";

import ServerError from "error/ServerError";
import InvalidValueError from "error/user/InvalidValueError";

import getSaltedHash from "util/common/getSaltedHash";
import verifyEmail from "util/verify/verifyEmail";
import verifyPassword from "util/verify/verifyPassword";

import type { RequestHandler } from "express";

interface ReqBody {
  email?: string;
  password?: string;
}

interface ResBody {}

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
      return next(new ServerError("사용자를 찾을 수 없어요."));
    }

    const salt = users[0].salt;
    hashedPassword = getSaltedHash(password, salt);
  }

  const queryResult = await patchUserByEmail({ email, patch: { email: newEmail, password: hashedPassword } });
  if (queryResult[0].affectedRows === 0) {
    return next(new ServerError("사용자를 찾을 수 없어요."));
  }

  return res.status(200).json({});
};

export default updatePrivateProfile;
