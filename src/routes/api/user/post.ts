import { MysqlErrorKeys } from "mysql-error-keys";
import jwt, { JwtPayload } from "jsonwebtoken";

import userRouter from "./";

import StatusCode from "constant/statusCode";
import createUser from "model/user/createUser";

import type { APIResponse } from "api";
import type { QueryError } from "mysql2";

interface ReqeustBody {
  email: string;
  emailToken: string;
  password: string;
  name: string;
}

userRouter.post<"/", {}, APIResponse<undefined>, ReqeustBody>("/", async (req, res, next) => {
  const tokenPayload = jwt.verify(req.body.emailToken, process.env.JWT_SECRET!) as JwtPayload;

  if ((tokenPayload.email as string) !== req.body.email) {
    return res.status(200).send({
      code: StatusCode.INVALID_EMAIL_TOKEN,
      message: "이메일 인증 토큰이 유효하지 않습니다.",
      result: undefined,
    });
  }

  if (/\S+@\S+\.\S+/.test(req.body.email) === false) {
    return res.status(200).send({
      code: StatusCode.INVALID_EMAIL,
      message: "이메일 주소가 올바르지 않습니다.",
      result: undefined,
    });
  }

  if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,20}$/.test(req.body.password) === false) {
    return res.status(200).send({
      code: StatusCode.INVALID_PASSWORD,
      message: "비밀번호가 올바르지 않습니다.",
      result: undefined,
    });
  }

  if (/\W/.test(req.body.name) === true || req.body.name.length < 3 || req.body.name.length > 20) {
    return res.status(200).send({
      code: StatusCode.INVALID_NAME,
      message: "사용자명이 올바르지 않습니다.",
      result: undefined,
    });
  }

  try {
    await createUser(req.body.email, req.body.password, req.body.name);

    res.status(200).send({
      code: StatusCode.SUCCESS,
      message: "성공적으로 사용자가 생성되었습니다.",
      result: undefined,
    });
  } catch (e) {
    if (e instanceof Error) {
      const queryError = e as QueryError;

      // ER_DUP_ENTRY
      if (queryError.code === MysqlErrorKeys.ER_DUP_ENTRY) {
        return res.status(200).send({
          code: StatusCode.DUPLICATED_VALUES,
          message: "이메일 주소 또는 사용자명이 이미 사용 중입니다.",
          result: undefined,
        });
      }

      res.status(200).send({
        code: StatusCode.SERVER_ERROR,
        message: "서버에서 오류가 발생했습니다.",
        result: undefined,
      });
    }
  }
});
