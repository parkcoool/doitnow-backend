import jwt from "jsonwebtoken";
import { z } from "zod";

import getUserByEmail from "model/user/getUserByEmail";
import getUserByName from "model/user/getUserByName";

import ServerError from "error/ServerError";
import NotFoundError from "error/user/NotFoundError";

import getSaltedHash from "util/getSaltedHash";
import onlyOneDefined from "util/onlyOneDefined";

import userSchema from "schema/user";

import type { UserRow } from "db";
import type { RequestHandler } from "express";
import type { RowDataPacket, FieldPacket } from "mysql2";
import type { APIResponse } from "api";

export const LoginBody = z
  .object({
    email: userSchema.email.optional(),
    name: userSchema.name.optional(),
    password: userSchema.password,
  })
  .refine(({ email, name }) => onlyOneDefined({ email, name }), {
    path: ["email", "name"],
    message: "이메일 또는 이름 중 하나만 입력해주세요.",
  });

interface ResBody extends APIResponse {
  accessToken: {
    token: string;
    expiresIn: number;
  };
  refreshToken: {
    token: string;
    expiresIn: number;
  };
}

const login: RequestHandler<{}, ResBody, z.infer<typeof LoginBody>> = async function (req, res, next) {
  const { email, name, password } = req.body;

  // 사용자 salt 가져오기
  let salt: string;
  {
    let queryResult: [(UserRow & RowDataPacket)[], FieldPacket[]];
    if (name !== undefined) {
      queryResult = await getUserByName({ name });
    } else if (email !== undefined) {
      queryResult = await getUserByEmail({ email });
    } else {
      return next(new ServerError("예상하지 못한 에러가 발생했어요."));
    }

    const users = queryResult[0];

    if (users.length === 0) {
      return next(new NotFoundError("사용자를 찾을 수 없어요."));
    }

    salt = users[0].salt;
  }

  // 비밀번호 검증
  const hashedPassword = getSaltedHash(password, salt);
  let queryResult: [(UserRow & RowDataPacket)[], FieldPacket[]];

  if (name !== undefined) {
    queryResult = await getUserByName({ name, password: hashedPassword });
  } else if (email !== undefined) {
    queryResult = await getUserByEmail({ email, password: hashedPassword });
  } else {
    return next(new ServerError("예상하지 못한 에러가 발생했어요."));
  }

  const users = queryResult[0];
  if (users.length === 0) {
    return next(new NotFoundError("비밀번호가 틀렸어요."));
  }

  const id = users[0].id;

  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET_KEY!, { expiresIn: "1h" });
  const refreshToken = jwt.sign({ id }, process.env.JWT_SECRET_KEY!, { expiresIn: "14d" });

  res.status(200).send({
    accessToken: {
      token: accessToken,
      expiresIn: 1 / 24,
    },
    refreshToken: {
      token: refreshToken,
      expiresIn: 14,
    },
    message: "로그인에 성공했어요.",
  });
};

export default login;
