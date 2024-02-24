import express from "express";

/**
 * @path `/api/auth`
 * @description 로그인, 회원가입, 비밀번호 찾기 등 인증 관련 API입니다.
 */
const router = express.Router();

router.use((req, res, next) => {
  next();
});

export default router;
