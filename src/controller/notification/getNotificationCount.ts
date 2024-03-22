import getNotificationCount_ from "model/notification/getNotificationCount";

import ServerError from "error/ServerError";

import type { RequestHandler } from "express";
import type { APIResponse } from "api";

interface ResBody extends APIResponse {
  count: number;
}

const getNotificationCount: RequestHandler<{}, ResBody> = async function (req, res, next) {
  const userId = req.userId;
  if (userId === undefined) {
    return next(new ServerError("사용자의 id를 불러올 수 없어요."));
  }

  const queryResult = await getNotificationCount_({ userId });
  const count = queryResult[0][0].count;

  return res.status(200).json({ count, message: "알림 개수를 불러왔어요." });
};

export default getNotificationCount;
