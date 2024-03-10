import express from "express";

import sendEmailRouter from "./sendEmail";

/**
 * @path `/api/auth`
 * @description 로그인, 회원가입, 비밀번호 찾기 등 인증 관련 API입니다.
 */
const authRouter = express.Router();

authRouter.use("/sendEmail", sendEmailRouter);

export default authRouter;

import "./post";
