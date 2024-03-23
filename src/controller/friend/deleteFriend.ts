import { z } from "zod";

import deleteFriend_ from "model/friend/deleteFriend";

import UserError from "error/UserError";
import ServerError from "error/ServerError";

import type { RequestHandler } from "express";
import type { APIResponse } from "api";

export const DeleteFriendQuery = z.object({
  to: z.string().refine((id) => parseInt(id) > 0, { path: ["id"], message: "to는 양의 정수여야 해요." }),
});

interface ResBody extends APIResponse {}

const deleteFriend: RequestHandler<{}, ResBody, {}, z.infer<typeof DeleteFriendQuery>> = async function (
  req,
  res,
  next
) {
  const userId = req.userId;
  if (userId === undefined) {
    return next(new ServerError("사용자의 id를 불러올 수 없어요."));
  }

  const to = parseInt(req.query.to);

  const queryResult = await deleteFriend_({
    userId1: userId,
    userId2: to,
  });

  if (queryResult[0].affectedRows === 0) {
    return next(new UserError("친구가 아니거나 이미 삭제했어요."));
  }

  return res.status(200).json({
    message: "친구를 삭제했어요.",
  });
};

export default deleteFriend;
