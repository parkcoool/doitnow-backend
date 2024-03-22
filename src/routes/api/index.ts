import express from "express";

import authRouter from "./auth";
import userRouter from "./user";

import errorHandler from "middleware/error/errorHandler";
import userErrorHandler from "middleware/error/userErrorHandler";
import serverErrorHandler from "middleware/error/serverErrorHandler";
import apiNotFoundErrorHandler from "middleware/error/apiNotFoundErrorHandler";
import zodErrorHandler from "middleware/error/zodErrorHandler";
import trimBodyString from "middleware/common/trimBodyString";

const apiRouter = express.Router();

// 라우터
apiRouter.use("/auth", trimBodyString, authRouter);
apiRouter.use("/user", trimBodyString, userRouter);

// 404 핸들 미들웨어
apiRouter.use(apiNotFoundErrorHandler);

// 에러 핸들 미들웨어
apiRouter.use(zodErrorHandler, userErrorHandler, serverErrorHandler, errorHandler);

export default apiRouter;
