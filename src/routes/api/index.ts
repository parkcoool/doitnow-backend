import express from "express";

import StatusCode from "constant/statusCode";

import authRouter from "./auth";
import userRouter from "./user";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/user", userRouter);

apiRouter.use((req, res) => {
  res.status(404).send({
    code: StatusCode.NOT_FOUND,
    message: "존재하지 않는 API에 대한 요청입니다.",
    result: null,
  });
});

export default apiRouter;
