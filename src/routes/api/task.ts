import express from "express";

import validateRequest from "middleware/validate/validateRequest";
import requireUserToken from "middleware/token/requireUserToken";
import apiNotFoundErrorHandler from "middleware/error/apiNotFoundErrorHandler";

import getTaskCount, { GetTaskCountQuery } from "controller/task/getTaskCount";
import getTasks, { GetTasksQuery } from "controller/task/getTasks";
import createTask, { CreateTaskBody } from "controller/task/createTask";
import editTask, { EditTaskBody } from "controller/task/editTask";

const taskRouter = express.Router();

// 컨트롤러
taskRouter.get(
  "/count",
  requireUserToken,
  validateRequest({ query: GetTaskCountQuery }),
  getTaskCount
);
taskRouter.get("/", [
  requireUserToken,
  validateRequest({ query: GetTasksQuery }),
  getTasks,
]);
taskRouter.post(
  "/",
  requireUserToken,
  validateRequest({ body: CreateTaskBody }),
  createTask
);
taskRouter.patch(
  "/",
  requireUserToken,
  validateRequest({ body: EditTaskBody }),
  editTask
);

// 404 핸들 미들웨어
taskRouter.use(apiNotFoundErrorHandler);

export default taskRouter;
