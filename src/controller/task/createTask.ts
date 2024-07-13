import { z } from "zod";

import createTask_ from "model/task/createTask";

import ServerError from "error/ServerError";

import taskSchema from "schema/task";

import type { RequestHandler } from "express";
import type { APIResponse } from "api";

export const CreateTaskBody = z.object({
  title: taskSchema.title,
  startAt: taskSchema.date.optional(),
  due: taskSchema.date.optional(),
});

interface ResBody extends APIResponse {}

const createTask: RequestHandler<
  {},
  ResBody,
  {},
  z.infer<typeof CreateTaskBody>
> = async function (req, res, next) {
  const userId = req.userId;
  if (userId === undefined) {
    return next(new ServerError("사용자의 id를 불러올 수 없어요."));
  }

  const { title, startAt, due } = req.query;

  const queryResult = await createTask_({
    userId,
    title,
    startAt,
    due,
  });

  if (queryResult[0].affectedRows === 0) {
    return next(new ServerError("할 일을 추가할 수 없어요."));
  }

  return res.status(200).json({
    message: "할 일을 추가했어요.",
  });
};

export default createTask;
