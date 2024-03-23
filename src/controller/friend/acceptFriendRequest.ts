import { z } from "zod";

import acceptFriendRequest_ from "model/friend/acceptFriendRequest";

import UserError from "error/UserError";
import ServerError from "error/ServerError";

import userSchema from "schema/user";

import type { RequestHandler } from "express";
import type { APIResponse } from "api";
import createNotification from "model/notification/createNotification";
import { NotificationType } from "constant/notificationType";
import getUserById from "model/user/getUserById";

export const AcceptFriendRequestBody = z.object({
  from: userSchema.id,
});

interface ResBody extends APIResponse {}

const acceptFriendRequest: RequestHandler<{}, ResBody, z.infer<typeof AcceptFriendRequestBody>> = async function (
  req,
  res,
  next
) {
  const userId = req.userId;
  if (userId === undefined) {
    return next(new ServerError("사용자의 id를 불러올 수 없어요."));
  }

  const { from } = req.body;

  const queryResult = await acceptFriendRequest_({
    from,
    to: userId,
  });

  if (queryResult[0].affectedRows === 0) {
    return next(new UserError("친구 요청이 없어요."));
  }

  // 알림 전송
  {
    const users = (await getUserById({ id: userId }))[0];
    if (users[0].length === 0) {
      return next(new UserError("사용자를 찾을 수 없어요."));
    }

    const user = users[0];

    await createNotification({
      userId: from,
      text: `${user.username}님이 친구 요청을 수락했어요.`,
      type: NotificationType.FRIEND_ACCEPTED,
      link: `/profile/${userId}`,
    });
  }

  return res.status(200).json({
    message: "친구 요청을 수락했어요.",
  });
};

export default acceptFriendRequest;
