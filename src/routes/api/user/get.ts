import userRouter from ".";

import StatusCode from "constant/statusCode";
import getUsers from "model/user/getUsers";

import type { APIResponse } from "api";
import type { UserFilter } from "model/user/getUsers";

interface RequestQuery {
  identifier?: string;
  id?: number;
}

interface ResponseBody {
  user: {
    id: number;
    email: string;
    name: string;
    bio: string | null;
    createdAt: string;
    profileImage: string | null;
  } | null;
}

userRouter.get<"/", {}, APIResponse<ResponseBody>, {}, RequestQuery>("/", async (req, res, next) => {
  const userFilter: Partial<UserFilter> = {};

  // 쿼리 파라미터에 identifier가 주어진 경우
  if (req.query.identifier) {
    const isIdentifierEmail = /\S+@\S+\.\S+/.test(req.query.identifier);
    if (isIdentifierEmail) userFilter.email = req.query.identifier;
    else userFilter.name = req.query.identifier;
  }

  // 쿼리 파라미터에 id가 주어진 경우
  else if (req.query.id) {
    userFilter.id = req.query.id;
  } else {
    return res.status(400).send({
      code: StatusCode.BAD_REQUEST,
      message: "identifier 혹은 id가 주어지지 않았습니다.",
      result: {
        user: null,
      },
    });
  }

  const users = (await getUsers(userFilter))[0].map((user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    bio: user.bio,
    createdAt: user.createdAt,
    profileImage: user.profileImage,
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
