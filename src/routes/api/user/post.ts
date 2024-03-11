import { MysqlErrorKeys } from "mysql-error-keys";

import userRouter from "./";

import StatusCode from "constant/statusCode";
import createUser from "model/user/createUser";

import type { APIResponse } from "api";
import type { QueryError } from "mysql2";

interface ReqeustBody {
  email: string;
  password: string;
  name: string;
}

userRouter.post<"/", {}, APIResponse<null>, ReqeustBody>("/", async (req, res, next) => {
  if (/\S+@\S+\.\S+/.test(req.body.email) === false) {
    return res.status(200).send({
      code: StatusCode.INVALID_EMAIL,
      message: "이메일 주소가 올바르지 않습니다.",
      result: null,
    });
  }

  if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,20}$/.test(req.body.password) === false) {
    return res.status(200).send({
      code: StatusCode.INVALID_PASSWORD,
      message: "비밀번호가 올바르지 않습니다.",
      result: null,
    });
  }

  if (/\W/.test(req.body.name) === true || req.body.name.length < 3 || req.body.name.length > 20) {
    return res.status(200).send({
      code: StatusCode.INVALID_NAME,
      message: "사용자명이 올바르지 않습니다.",
      result: null,
    });
  }

  try {
    await createUser(req.body.email, req.body.password, req.body.name);

    res.status(200).send({
      code: StatusCode.SUCCESS,
      message: "성공적으로 사용자가 생성되었습니다.",
      result: null,
    });
  } catch (e) {
    if (e instanceof Error) {
      const queryError = e as QueryError;

      // ER_DUP_ENTRY
      if (queryError.code === MysqlErrorKeys.ER_DUP_ENTRY) {
        return res.status(200).send({
          code: StatusCode.DUPLICATED_VALUES,
          message: "이메일 주소 또는 사용자명이 이미 사용 중입니다.",
          result: null,
        });
      }

      res.status(200).send({
        code: StatusCode.SERVER_ERROR,
        message: "서버에서 오류가 발생했습니다.",
        result: null,
      });
    }
  }
});
