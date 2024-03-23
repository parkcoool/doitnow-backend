import { z } from "zod";

import deleteFriendRequest from "model/friend/deleteFriendRequest";

import UserError from "error/UserError";
import ServerError from "error/ServerError";

import userSchema from "schema/user";

import type { RequestHandler } from "express";
import type { APIResponse } from "api";

export const CancelFriendRequestBody = z.object({
  to: userSchema.id,
});

interface ResBody extends APIResponse {}

const cancelFriendRequest: RequestHandler<{}, ResBody, z.infer<typeof CancelFriendRequestBody>> = async function (
  req,
  res,
  next
) {
  const userId = req.userId;
  if (userId === undefined) {
    return next(new ServerError("사용자의 id를 불러올 수 없어요."));
  }

  const { to } = req.body;

  const queryResult = await deleteFriendRequest({
    from: userId,
    to,
  });

  if (queryResult[0].affectedRows === 0) {
    return next(new UserError("친구 요청이 없거나 이미 취소했어요."));
  }

  return res.status(200).json({
    message: "친구 요청을 취소했어요.",
  });
};

export default cancelFriendRequest;
