import { QueryError } from "mysql2";
import { ER_DUP_ENTRY } from "mysql-error-keys";
import { z } from "zod";

import createFriendRequest from "model/friend/createFriendRequest";
import getUserById from "model/user/getUserById";

import InvalidValueError from "error/user/InvalidValueError";
import UserError from "error/UserError";
import ServerError from "error/ServerError";

import userSchema from "schema/user";

import type { RequestHandler } from "express";
import type { APIResponse } from "api";

export const RequestFriendBody = z.object({
  to: userSchema.id,
});

interface ResBody extends APIResponse {}

const requestFriend: RequestHandler<{}, ResBody, z.infer<typeof RequestFriendBody>> = async function (req, res, next) {
  const userId = req.userId;
  if (userId === undefined) {
    return next(new ServerError("사용자의 id를 불러올 수 없어요."));
  }

  const { to } = req.body;
  if (userId === to) return next(new InvalidValueError(["userId", "to"]));

  const users = await getUserById({ id: to });
  if (users[0].length === 0) {
    return next(new UserError("사용자를 찾을 수 없어요."));
  }

  try {
    const queryResult = await createFriendRequest({
      from: userId,
      to,
    });
    if (queryResult[0].affectedRows === 0) {
      return next(new ServerError("친구 요청을 보낼 수 없어요."));
    }
  } catch (error) {
    if (error instanceof Error) {
      if ((error as QueryError).code === ER_DUP_ENTRY) {
        return next(new UserError("이미 친구 요청을 보냈어요."));
      }
    }
    throw error;
  }
  return res.status(200).json({
    message: "친구 요청을 보냈어요.",
  });
};

export default requestFriend;
