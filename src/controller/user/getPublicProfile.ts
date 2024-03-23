import { z } from "zod";

import getProfileByEmail from "model/profile/getProfileByEmail";
import getProfileById from "model/profile/getProfileById";
import getProfileByName from "model/profile/getProfileByName";

import ServerError from "error/ServerError";
import NotFoundError from "error/user/NotFoundError";

import onlyOneDefined from "util/onlyOneDefined";
import { FriendStatus } from "constant/friendStatus";
import userSchema from "schema/user";

import type { ProfileRow } from "db";
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
  friendStatus: FriendStatus | null;
}

const getPublicProfile: RequestHandler<{}, ResBody, {}, z.infer<typeof GetPublicProfileQuery>> = async function (
  req,
  res,
  next
) {
  const userId = req.userId;
  if (userId === undefined) {
    return next(new ServerError("사용자의 id를 불러올 수 없어요."));
  }

  const { name, email, id } = req.query;

  let queryResult: [(ProfileRow & RowDataPacket)[], FieldPacket[]];
  if (name !== undefined) {
    queryResult = await getProfileByName({ targetName: name, viewerId: userId });
  } else if (email !== undefined) {
    queryResult = await getProfileByEmail({ targetEmail: email, viewerId: userId });
  } else if (id !== undefined) {
    queryResult = await getProfileById({ targetId: parseInt(id), viewerId: userId });
  } else {
    return next(new ServerError("예상하지 못한 에러가 발생했어요."));
  }

  const profiles = queryResult[0];
  if (profiles.length === 0) {
    return next(new NotFoundError("사용자를 찾을 수 없어요."));
  }

  const profile = profiles[0];
  return res.status(200).json({
    id: profile.id,
    username: profile.username,
    name: profile.name,
    bio: profile.bio,
    createdAt: profile.createdAt,
    profileImage: profile.profileImage,
    friendStatus: profile.friendStatus,
    message: "사용자 정보를 불러왔어요.",
  });
};

export default getPublicProfile;
