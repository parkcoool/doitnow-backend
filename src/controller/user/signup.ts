import { randomBytes } from "crypto";
import { QueryError } from "mysql2";
import { ER_DUP_ENTRY } from "mysql-error-keys";
import { z } from "zod";

import createUser from "model/user/createUser";

import ServerError from "error/ServerError";
import DuplicationError from "error/user/DuplicationError";

import getSaltedHash from "util/getSaltedHash";

import userSchema from "schema/user";

import type { RequestHandler } from "express";
import type { APIResponse } from "api";

export const SignupBody = z.object({
  password: userSchema.password,
  username: userSchema.username,
  name: userSchema.name,
});

interface ResBody extends APIResponse {}

const signup: RequestHandler<{}, ResBody, z.infer<typeof SignupBody>> = async function (req, res, next) {
  const email = req.email;
  if (email === undefined) {
    return next(new ServerError("사용자의 이메일 주소를 불러올 수 없어요."));
  }

  const { password, username, name } = req.body;

  // 비밀번호를 해싱한다.
  const salt = randomBytes(32).toString("base64");
  const hashedPassword = getSaltedHash(password, salt);

  try {
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
  } catch (error) {
    if (error instanceof Error) {
      if ((error as QueryError).code === ER_DUP_ENTRY) {
        return next(new DuplicationError("이름 또는 이메일"));
      }
    }
  }
  return res.status(200).json({
    message: "사용자가 생성됐어요.",
  });
};

export default signup;
