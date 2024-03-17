import { randomBytes } from "crypto";

import createUser from "model/user/createUser";

import ServerError from "error/ServerError";
import InvalidValueError from "error/user/InvalidValueError";

import getSaltedHash from "util/common/getSaltedHash";
import verifyPassword from "util/verify/verifyPassword";
import verifyUsername from "util/verify/verifyUsername";
import verifyName from "util/verify/verifyName";

import type { RequestHandler } from "express";
import type { APIResponse } from "api";

interface ReqBody {
  password: string;
  username: string;
  name: string;
}

interface ResBody extends APIResponse {}

const signup: RequestHandler<{}, ResBody, ReqBody> = async function (req, res, next) {
  const email = req.email;
  if (email === undefined) {
    return next(new ServerError("사용자의 이메일 주소를 불러올 수 없어요."));
  }

  const { password, username, name } = req.body;

  // 값 검증
  if (!verifyPassword(password)) return next(new InvalidValueError("password"));
  if (!verifyUsername(username)) return next(new InvalidValueError("username"));
  if (!verifyName(name)) return next(new InvalidValueError("name"));

  // 비밀번호를 해싱한다.
  const salt = randomBytes(32).toString("base64");
  const hashedPassword = getSaltedHash(password, salt);

  const queryResult = await createUser({
    email,
    username,
    name,
    password: hashedPassword,
    salt,
    bio: null,
    profileImage: null,
  });
  if (queryResult[0].affectedRows === 0) {
    return next(new ServerError("사용자를 생성할 수 없어요."));
  }

  return res.status(200).json({
    message: "사용자가 생성됐어요.",
  });
};

export default signup;
