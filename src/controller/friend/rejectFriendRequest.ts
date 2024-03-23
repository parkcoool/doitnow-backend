import { z } from "zod";

import deleteFriendRequest from "model/friend/deleteFriendRequest";

import UserError from "error/UserError";
import ServerError from "error/ServerError";

import userSchema from "schema/user";

import type { RequestHandler } from "express";
import type { APIResponse } from "api";

export const RejectFriendRequestBody = z.object({
  from: userSchema.id,
});

interface ResBody extends APIResponse {}

const rejectFriendRequest: RequestHandler<{}, ResBody, z.infer<typeof RejectFriendRequestBody>> = async function (
  req,
  res,
  next
) {
  const userId = req.userId;
  if (userId === undefined) {
    return next(new ServerError("사용자의 id를 불러올 수 없어요."));
  }

  const { from } = req.body;

  const queryResult = await deleteFriendRequest({
    from,
    to: userId,
  });

  if (queryResult[0].affectedRows === 0) {
    return next(new UserError("친구 요청이 없어요."));
  }

  return res.status(200).json({
    message: "친구 요청을 거절했어요.",
  });
};

export default rejectFriendRequest;
