import express from "express";

/**
 * @path `/api/auth/sendEmail`
 * @description 이메일 인증 코드 발송 API입니다.
 */
const sendEmailRouter = express.Router();

export default sendEmailRouter;

import "./post";
