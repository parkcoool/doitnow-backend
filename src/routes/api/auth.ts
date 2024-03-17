import express from "express";

import notFoundHandler from "middleware/common/notFoundHandler";

import sendEmail from "controller/auth/email/sendEmail";
import verifyEmail from "controller/auth/email/verifyEmail";
import login from "controller/auth/login";
import refreshToken from "controller/auth/refreshToken";

const authRouter = express.Router();

// 컨트롤러
authRouter.post("/email/send", sendEmail);
authRouter.post("/email/verify", verifyEmail);
authRouter.post("/login", login);
authRouter.post("/token", refreshToken);

// 404 핸들 미들웨어
authRouter.use(notFoundHandler);

export default authRouter;
