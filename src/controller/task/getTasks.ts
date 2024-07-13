import { z } from "zod";

import getTasks_ from "model/task/getTasks";

import ServerError from "error/ServerError";

import taskSchema from "schema/task";

import type { RequestHandler } from "express";
import type { APIResponse } from "api";

export const GetTasksQuery = z.object({
  offset: taskSchema.offset.optional(),
  orderBy: taskSchema.orderBy.optional(),
  onlyUndone: z.boolean().optional(),
});

interface ResBody extends APIResponse {
  tasks: {
    id: number;
    creator: number;
    title: string;
    done: boolean;
    due?: string;
    startAt?: string;
    createdAt: string;
    updatedAt: string;
  }[];
  hasMore: boolean;
}

const getNotifications: RequestHandler<
  {},
  ResBody,
  {},
  z.infer<typeof GetTasksQuery>
> = async function (req, res, next) {
  const userId = req.userId;
  if (userId === undefined) {
    return next(new ServerError("사용자의 id를 불러올 수 없어요."));
  }

  const { offset, orderBy, onlyUndone } = req.query;

  const queryResult = await getTasks_({
    userId,
    offset,
    orderBy,
    onlyUndone,
  });
  const hasMore = queryResult[0][0]?.hasMore ?? false;
  const tasks = queryResult[0].map((task) => ({
    id: task.id,
    creator: task.creator,
    title: task.title,
    done: task.done,
    due: task.due ?? undefined,
    startAt: task.startAt ?? undefined,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));

  return res
    .status(200)
    .json({ tasks, hasMore, message: "할 일을 불러왔어요." });
};

export default getNotifications;
