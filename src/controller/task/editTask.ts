import { z } from "zod";

import patchTask from "model/task/patchTask";

import ServerError from "error/ServerError";

import taskSchema from "schema/task";

import type { RequestHandler } from "express";
import type { APIResponse } from "api";
import NotFoundError from "error/user/NotFoundError";

export const EditTaskBody = z.object({
  id: taskSchema.id,
  title: taskSchema.title.optional(),
  startAt: taskSchema.date.optional(),
  due: taskSchema.date.optional(),
  done: z.boolean().optional(),
});

interface ResBody extends APIResponse {}

const editTask: RequestHandler<
  {},
  ResBody,
  z.infer<typeof EditTaskBody>
> = async function (req, res, next) {
  const userId = req.userId;
  if (userId === undefined) {
    return next(new ServerError("사용자의 id를 불러올 수 없어요."));
  }

  const { id, title, startAt, due, done } = req.body;

  const queryResult = await patchTask({
    id,
    patch: {
      title,
      startAt,
      due,
      done,
    },
  });

  if (queryResult[0].affectedRows === 0) {
    return next(new NotFoundError("할 일을 찾을 수 없어요."));
  }

  return res.status(200).json({
    message: "할 일을 수정했어요.",
  });
};

export default editTask;
