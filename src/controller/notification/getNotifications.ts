import { z } from "zod";

import getNotifications_ from "model/notification/getNotifications";

import ServerError from "error/ServerError";

import notificationSchema from "schema/notification";

import type { RequestHandler } from "express";
import type { APIResponse } from "api";

export const GetNotificationsQuery = z.object({
  offsetDate: notificationSchema.offsetDate.optional(),
});

interface ResBody extends APIResponse {
  notifications: {
    id: number;
    text: string;
    link: string;
    type: string;
    read: boolean;
    createdAt: string;
  }[];
  hasMore: boolean;
}

const getNotifications: RequestHandler<{}, ResBody, {}, z.infer<typeof GetNotificationsQuery>> = async function (
  req,
  res,
  next
) {
  const userId = req.userId;
  if (userId === undefined) {
    return next(new ServerError("사용자의 id를 불러올 수 없어요."));
  }

  const { offsetDate } = req.query;

  const queryResult = await getNotifications_({
    userId,
    offsetDate: offsetDate === undefined ? undefined : new Date(offsetDate),
  });
  const notifications = queryResult[0].map((notification) => ({
    id: notification.id,
    text: notification.text,
    link: notification.link,
    type: notification.type,
    read: notification.read,
    createdAt: notification.createdAt,
    hasMore: notification.hasMore,
  }));

  return res
    .status(200)
    .json({ notifications, hasMore: notifications[0]?.hasMore ?? false, message: "알림을 불러왔어요." });
};

export default getNotifications;
