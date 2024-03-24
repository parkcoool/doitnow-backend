import { z } from "zod";

import getFriendRequests_ from "model/friend/getFriendRequests";

import ServerError from "error/ServerError";

import type { RequestHandler } from "express";
import type { APIResponse } from "api";

export const GetFriendRequestsQuery = z.object({
  offset: z
    .string()
    .refine((offset) => parseInt(offset) >= 0, { path: ["offset"], message: "오프셋은 음이 아닌 정수여야 해요." })
    .optional(),
});

interface ResBody extends APIResponse {
  friendRequests: {
    from: number;
    createdAt: string;
  }[];
  hasMore: boolean;
}

const getFriendRequests: RequestHandler<{}, ResBody, {}, z.infer<typeof GetFriendRequestsQuery>> = async function (
  req,
  res,
  next
) {
  const userId = req.userId;
  if (userId === undefined) {
    return next(new ServerError("사용자의 id를 불러올 수 없어요."));
  }

  const { offset } = req.query;

  const queryResult = await getFriendRequests_({
    userId,
    offset: offset === undefined ? undefined : parseInt(offset),
  });
  const hasMore = queryResult[0][0]?.hasMore ?? false;
  const friendRequests = queryResult[0].map((friend) => ({
    from: friend.from,
    createdAt: friend.createdAt,
  }));

  return res.status(200).json({ friendRequests, hasMore, message: "친구 요청을 불러왔어요." });
};

export default getFriendRequests;
