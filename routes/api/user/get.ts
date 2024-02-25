import userRouter from ".";

import StatusCode from "../../../code";

import type { APIResponse } from "api";
import type { User } from "user";

interface ReqeustParam {
  identifier: string;
}

interface ResponseBody {
  user: User | null;
}

userRouter.get<"/", ReqeustParam, APIResponse<ResponseBody | undefined>>("/", (req, res, next) => {
  // ...

  res.status(200).send({
    code: StatusCode.SUCCESS,
    message: "성공적으로 사용자 정보를 가져왔습니다.",
    result: {
      user: {
        id: "1",
        name: "홍길동",
      },
    },
  });
});
