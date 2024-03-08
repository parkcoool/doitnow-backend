import express from "express";

/**
 * @path `/api/user`
 * @description 사용자 정보 관련 API입니다.
 */
const userRouter = express.Router();
export default userRouter;

import "./get";
