import userRouter from ".";

import StatusCode from "constant/statusCode";
import getUsers from "model/user/getUsers";

import type { APIResponse } from "api";
import type { User } from "user";
import type { PublicUserRow, UserRow } from "db";

interface RequestQuery {
  identifier: string;
}

interface ResponseBody {
  user: User | null;
}

userRouter.get<"/", {}, APIResponse<ResponseBody>, {}, RequestQuery>("/", async (req, res, next) => {
  const isIdentifierEmail = req.query.identifier.includes("@");
  let users: PublicUserRow[];

  if (isIdentifierEmail) {
    users = await getUsers({ email: req.query.identifier } as Partial<UserRow>);
  } else {
    users = await getUsers({ name: req.query.identifier } as Partial<UserRow>);
  }

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
