import { z } from "zod";

import readNotificationById from "model/notification/readNotificationById";
import readAllNotifications from "model/notification/readAllNotifications";

import ServerError from "error/ServerError";
import InvalidValueError from "error/user/InvalidValueError";

import userSchema from "schema/user";

import type { RequestHandler } from "express";
import type { APIResponse } from "api";
import type { ResultSetHeader, FieldPacket } from "mysql2";

export const ReadNotificationBody = z.object({
  id: userSchema.id.array().optional(),
});

interface ResBody extends APIResponse {}

const getNotifications: RequestHandler<{}, ResBody, z.infer<typeof ReadNotificationBody>> = async function (
  req,
  res,
  next
) {
  const userId = req.userId;
  if (userId === undefined) {
    return next(new ServerError("사용자의 id를 불러올 수 없어요."));
  }

  const { id } = req.body;

  let queryResult: [ResultSetHeader, FieldPacket[]];

  if (id !== undefined) queryResult = await readNotificationById({ id, userId });
  else queryResult = await readAllNotifications({ userId });

  const affectedRows = queryResult[0].affectedRows;
  if (id !== undefined && affectedRows === 0) {
    return next(new InvalidValueError(["id"]));
  }

  return res.status(200).json({ message: `${affectedRows.toLocaleString()}개의 알림을 읽었어요.` });
};

export default getNotifications;
