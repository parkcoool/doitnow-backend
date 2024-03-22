import express from "express";

import validateRequest from "middleware/validate/validateRequest";
import apiNotFoundErrorHandler from "middleware/error/apiNotFoundErrorHandler";

import sendEmail, { SendEmailBody } from "controller/auth/email/sendEmail";
import verifyEmail, { VerifyEmailBody } from "controller/auth/email/verifyEmail";
import login, { LoginBody } from "controller/auth/login";
import refreshToken, { RefreshTokenBody } from "controller/auth/refreshToken";

const authRouter = express.Router();

// 컨트롤러
authRouter.post("/email/send", validateRequest({ body: SendEmailBody }), sendEmail);
authRouter.post("/email/verify", validateRequest({ body: VerifyEmailBody }), verifyEmail);
authRouter.post("/login", validateRequest({ body: LoginBody }), login);
authRouter.post("/token", validateRequest({ body: RefreshTokenBody }), refreshToken);

// 404 핸들 미들웨어
authRouter.use(apiNotFoundErrorHandler);

export default authRouter;
