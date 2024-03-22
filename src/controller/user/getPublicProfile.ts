import { z } from "zod";

import getUserByEmail from "model/user/getUserByEmail";
import getUserById from "model/user/getUserById";
import getUserByUsername from "model/user/getUserByName";

import ServerError from "error/ServerError";
import NotFoundError from "error/user/NotFoundError";

import onlyOneDefined from "util/onlyOneDefined";

import userSchema from "schema/user";

import type { UserRow } from "db";
import type { RowDataPacket, FieldPacket } from "mysql2";
import type { RequestHandler } from "express";
import type { APIResponse } from "api";

export const GetPublicProfileQuery = z
  .object({
    name: userSchema.name,
    email: userSchema.email,
    id: z.string().refine((id) => parseInt(id) > 0, { path: ["id"], message: "id는 양의 정수여야 해요." }),
  })
  .partial()
  .refine(onlyOneDefined, {
    path: ["name", "email", "id"],
    message: "이름, 이메일, 아이디 중 하나만 입력해주세요.",
  });

interface ResBody extends APIResponse {
  id: number;
  username: string;
  name: string;
  bio: string | null;
  createdAt: string;
  profileImage: string | null;
}

const getPublicProfile: RequestHandler<{}, ResBody, {}, z.infer<typeof GetPublicProfileQuery>> = async function (
  req,
  res,
  next
) {
  const { name, email, id } = req.query;

  let queryResult: [(UserRow & RowDataPacket)[], FieldPacket[]];
  if (name !== undefined) {
    queryResult = await getUserByUsername({ name });
  } else if (email !== undefined) {
    queryResult = await getUserByEmail({ email });
  } else if (id !== undefined) {
    queryResult = await getUserById({ id: parseInt(id) });
  } else {
    return next(new ServerError("예상하지 못한 에러가 발생했어요."));
  }

  const users = queryResult[0];
  if (users.length === 0) {
    return next(new NotFoundError("사용자를 찾을 수 없어요."));
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
