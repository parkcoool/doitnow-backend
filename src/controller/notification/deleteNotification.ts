import { z } from "zod";

import deleteNotificationById from "model/notification/deleteNotificationById";
import deleteAllNotifications from "model/notification/deleteAllNotifications";

import ServerError from "error/ServerError";
import InvalidValueError from "error/user/InvalidValueError";

import type { RequestHandler } from "express";
import type { APIResponse } from "api";
import type { ResultSetHeader, FieldPacket } from "mysql2";

export const DeleteNotificationQuery = z.object({
  id: z
    .string()
    .refine((id) => parseInt(id) > 0, { path: ["id"], message: "id는 양의 정수여야 해요." })
    .optional(),
});

interface ResBody extends APIResponse {}

const deleteNotification: RequestHandler<{}, ResBody, {}, z.infer<typeof DeleteNotificationQuery>> = async function (
  req,
  res,
  next
) {
  const userId = req.userId;
  if (userId === undefined) {
    return next(new ServerError("사용자의 id를 불러올 수 없어요."));
  }

  const id = req.query.id === undefined ? undefined : parseInt(req.query.id);

  let queryResult: [ResultSetHeader, FieldPacket[]];

  if (id !== undefined) queryResult = await deleteNotificationById({ id, userId });
  else queryResult = await deleteAllNotifications({ userId });

  const affectedRows = queryResult[0].affectedRows;
  if (id !== undefined && affectedRows === 0) {
    return next(new InvalidValueError(["id"]));
  }

  return res.status(200).json({ message: `${affectedRows.toLocaleString()}개의 알림을 삭제했어요.` });
};

export default deleteNotification;
