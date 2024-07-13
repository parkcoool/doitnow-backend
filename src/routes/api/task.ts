import express from "express";

import validateRequest from "middleware/validate/validateRequest";
import requireUserToken from "middleware/token/requireUserToken";
import apiNotFoundErrorHandler from "middleware/error/apiNotFoundErrorHandler";

import getTaskCount, { GetTaskCountQuery } from "controller/task/getTaskCount";
import getTasks, { GetTasksQuery } from "controller/task/getTasks";

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

// 404 핸들 미들웨어
taskRouter.use(apiNotFoundErrorHandler);

export default taskRouter;
