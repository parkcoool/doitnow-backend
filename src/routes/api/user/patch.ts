import jwt, { JwtPayload } from "jsonwebtoken";

import userRouter from "./";

import StatusCode from "constant/statusCode";
import patchUser from "model/user/patchUsers";
import getUsers from "model/user/getUsers";

import type { APIResponse } from "api";

interface ReqeustBody {
  emailToken?: string;
  id: number;
  user: Partial<{
    email: string;
    password: string;
    name: string;
  }>;
}

userRouter.patch<"/", {}, APIResponse<undefined>, ReqeustBody>("/", async (req, res, next) => {
  let salt: string | undefined = undefined;

  // 비밀번호 또는 이메일을 변경하는 경우, 이메일 인증 토큰이 필요하다.
  if (req.body.user.password !== undefined || req.body.user.email !== undefined) {
    // 이메일 인증 토큰이 주어지지 않은 경우
    if (req.body.emailToken === undefined) {
      return res.status(200).send({
        code: StatusCode.INVALID_EMAIL_TOKEN,
        message: "이메일 인증 토큰이 필요합니다.",
        result: undefined,
      });
    }

    const tokenPayload = jwt.verify(req.body.emailToken, process.env.JWT_SECRET!) as JwtPayload;
    const users = (await getUsers({ id: req.body.id }))[0];

    // 이메일 인증 토큰이 유효하지 않은 경우
    if (users[0].length === 0 || users[0].email !== tokenPayload.email) {
      return res.status(200).send({
        code: StatusCode.INVALID_EMAIL_TOKEN,
        message: "이메일 인증 토큰이 유효하지 않습니다.",
        result: undefined,
      });
    }

    // salt 저장
    salt = users[0].salt;
  }

  if (req.body.user.email && /\S+@\S+\.\S+/.test(req.body.user.email) === false) {
    return res.status(200).send({
      code: StatusCode.INVALID_EMAIL,
      message: "이메일 주소가 올바르지 않습니다.",
      result: undefined,
    });
  }

  if (
    req.body.user.password &&
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,20}$/.test(req.body.user.password) === false
  ) {
    return res.status(200).send({
      code: StatusCode.INVALID_PASSWORD,
      message: "비밀번호가 올바르지 않습니다.",
      result: undefined,
    });
  }

  if (
    req.body.user.name &&
    (/\W/.test(req.body.user.name) === true || req.body.user.name.length < 3 || req.body.user.name.length > 20)
  ) {
    return res.status(200).send({
      code: StatusCode.INVALID_NAME,
      message: "사용자명이 올바르지 않습니다.",
      result: undefined,
    });
  }

  try {
    const { password, ...patchWithoutPassword } = req.body.user;

    if (password === undefined || salt === undefined) throw new Error("이메일 인증 토큰이 주어지지 않았습니다.");
    const passwordPatch = req.body.user.password ? { password: { password, salt } } : {};

    await patchUser(req.body.id, { ...patchWithoutPassword, ...passwordPatch });

    res.status(200).send({
      code: StatusCode.SUCCESS,
      message: "성공적으로 사용자 정보를 수정했습니다.",
      result: undefined,
    });
  } catch (e) {
    if (e instanceof Error) {
      res.status(200).send({
        code: StatusCode.SERVER_ERROR,
        message: "서버에서 오류가 발생했습니다.",
        result: undefined,
      });
    }
  }
});
