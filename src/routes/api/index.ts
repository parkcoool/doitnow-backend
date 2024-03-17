import express from "express";

import authRouter from "./auth";
import userRouter from "./user";

import errorHandler from "middleware/error/errorHandler";
import userErrorHandler from "middleware/error/userErrorHandler";
import serverErrorHandler from "middleware/error/serverErrorHandler";
import notFoundHandler from "middleware/common/notFoundHandler";

const apiRouter = express.Router();

// 라우터
apiRouter.use("/auth", authRouter);
apiRouter.use("/user", userRouter);

// 404 핸들 미들웨어
apiRouter.use(notFoundHandler);

// 에러 핸들 미들웨어
apiRouter.use(userErrorHandler, serverErrorHandler, errorHandler);

export default apiRouter;
