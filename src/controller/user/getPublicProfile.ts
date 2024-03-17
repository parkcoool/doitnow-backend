import getUserByEmail from "model/user/getUserByEmail";
import getUserById from "model/user/getUserById";
import getUserByUsername from "model/user/getUserByUsername";

import ServerError from "error/ServerError";
import InvalidValueError from "error/user/InvalidValueError";

import type { UserRow } from "db";
import type { RowDataPacket, FieldPacket } from "mysql2";
import type { RequestHandler } from "express";
import type { APIResponse } from "api";

interface ReqQuery {
  username?: string;
  email?: string;
  id?: number;
}

interface ResBody extends APIResponse {
  id: number;
  username: string;
  name: string;
  bio: string | null;
  createdAt: string;
  profileImage: string | null;
}

const getPublicProfile: RequestHandler<{}, ResBody, {}, ReqQuery> = async function (req, res, next) {
  const { username, email, id } = req.query;

  if ([username, email, id].filter((v) => v !== undefined).length !== 1) {
    return next(new InvalidValueError("username, email, id"));
  }

  let queryResult: [(UserRow & RowDataPacket)[], FieldPacket[]];
  if (username !== undefined) {
    queryResult = await getUserByUsername({ username });
  } else if (email !== undefined) {
    queryResult = await getUserByEmail({ email });
  } else if (id !== undefined) {
    queryResult = await getUserById({ id });
  } else {
    return next(new ServerError("예상하지 못한 에러가 발생했어요."));
  }

  const users = queryResult[0];
  if (users.length === 0) {
    return next(new ServerError("사용자를 찾을 수 없어요."));
  }

  const user = users[0];
  return res.status(200).json({
    id: user.id,
    username: user.username,
    name: user.name,
    bio: user.bio,
    createdAt: user.createdAt,
    profileImage: user.profileImage,
    message: "사용자 정보를 불러왔어요.",
  });
};

export default getPublicProfile;
