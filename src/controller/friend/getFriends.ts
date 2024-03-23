import { z } from "zod";

import getFriends_ from "model/friend/getFriends";

import ServerError from "error/ServerError";

import type { RequestHandler } from "express";
import type { APIResponse } from "api";

export const GetFriendsQuery = z.object({
  offset: z
    .string()
    .refine((offset) => parseInt(offset) >= 0, { path: ["offset"], message: "오프셋은 음이 아닌 정수여야 해요." })
    .optional(),
});

interface ResBody extends APIResponse {
  friends: {
    id: number;
    username: string;
    name: string;
    profileImage: string | null;
    bio: string | null;
  }[];
  hasMore: boolean;
}

const getFriends: RequestHandler<{}, ResBody, {}, z.infer<typeof GetFriendsQuery>> = async function (req, res, next) {
  const userId = req.userId;
  if (userId === undefined) {
    return next(new ServerError("사용자의 id를 불러올 수 없어요."));
  }

  const { offset } = req.query;

  const queryResult = await getFriends_({
    userId,
    offset: offset === undefined ? undefined : parseInt(offset),
  });
  const hasMore = queryResult[0][0].hasMore;
  const friends = queryResult[0].map((friend) => ({
    id: friend.id,
    username: friend.username,
    name: friend.name,
    profileImage: friend.profileImage,
    bio: friend.bio,
  }));

  return res.status(200).json({ friends, hasMore, message: "알림을 불러왔어요." });
};

export default getFriends;
