import jwt from "jsonwebtoken";

import getUserByEmail from "model/user/getUserByEmail";
import getUserByUsername from "model/user/getUserByUsername";

import ServerError from "error/ServerError";
import InvalidValueError from "error/user/InvalidValueError";
import NotFoundError from "error/user/NotFoundError";

import getSaltedHash from "util/common/getSaltedHash";

import type { UserRow } from "db";
import type { RequestHandler } from "express";
import type { RowDataPacket, FieldPacket } from "mysql2";
import type { APIResponse } from "api";

interface ReqBody {
  email?: string;
  username?: string;
  password: string;
}

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

const login: RequestHandler<{}, ResBody, ReqBody> = async function (req, res, next) {
  const { email, username, password } = req.body;

  if ([email, username].filter((value) => value !== undefined).length !== 1) {
    return next(new InvalidValueError("email, username"));
  }

  // 사용자 salt 가져오기
  let salt: string;
  {
    let queryResult: [(UserRow & RowDataPacket)[], FieldPacket[]];
    if (username !== undefined) {
      queryResult = await getUserByUsername({ username });
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

  if (username !== undefined) {
    queryResult = await getUserByUsername({ username, password: hashedPassword });
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

  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
  const refreshToken = jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: "14d" });

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
