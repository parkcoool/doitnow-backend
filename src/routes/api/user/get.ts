import userRouter from ".";

import StatusCode from "constant/statusCode";
import getUsers from "model/user/getUsers";

import type { APIResponse } from "api";

interface RequestQuery {
  identifier: string;
}

interface ResponseBody {
  user: {
    id: number;
    email: string;
    name: string;
  } | null;
}

userRouter.get<"/", {}, APIResponse<ResponseBody>, {}, RequestQuery>("/", async (req, res, next) => {
  const isIdentifierEmail = /\S+@\S+\.\S+/.test(req.query.identifier);
  const userFilter = {
    [isIdentifierEmail ? "email" : "name"]: req.query.identifier,
  };

  const users = (await getUsers(userFilter))[0].map((user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
  }));

  if (users.length === 0) {
    return res.status(200).send({
      code: StatusCode.NOT_FOUND,
      message: "해당 사용자를 찾을 수 없습니다.",
      result: {
        user: null,
      },
    });
  }

  res.status(200).send({
    code: StatusCode.SUCCESS,
    message: "성공적으로 사용자 정보를 가져왔습니다.",
    result: {
      user: users[0],
    },
  });
});
