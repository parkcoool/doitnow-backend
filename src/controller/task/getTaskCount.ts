import { z } from "zod";

import getDoneTaskCount from "model/task/getDoneTaskCount";
import getTotalTaskCount from "model/task/getTotalTaskCount";

import ServerError from "error/ServerError";

import type { RequestHandler } from "express";
import type { APIResponse } from "api";

export const GetTaskCountQuery = z.object({
  done: z.boolean(),
});

interface ResBody extends APIResponse {
  count: number;
}

const getTaskCount: RequestHandler<{}, ResBody> = async function (
  req,
  res,
  next
) {
  const userId = req.userId;
  if (userId === undefined) {
    return next(new ServerError("사용자의 id를 불러올 수 없어요."));
  }

  let count: number;

  if (req.query.done) {
    const queryResult = await getDoneTaskCount({ userId });
    count = queryResult[0][0].count;
  }
  else {
    const queryResult = await getTotalTaskCount({ userId });
    count = queryResult[0][0].count;
  }

  return res.status(200).json({ count, message: "알림 개수를 불러왔어요." });
};

export default getTaskCount;
