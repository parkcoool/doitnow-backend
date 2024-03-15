import tokenRouter from "./";

import jwt, { JwtPayload } from "jsonwebtoken";

import StatusCode from "constant/statusCode";

import type { APIResponse } from "api";
import type { Token } from "auth";
import getUsers from "model/user/getUsers";

interface ReqeustBody {
  refreshToken: string;
}

interface ResponseBody {
  token: {
    refreshToken: Token;
    accessToken: Token;
  } | null;
  id?: number;
  name?: string;
}

tokenRouter.post<"/", {}, APIResponse<ResponseBody>, ReqeustBody>("/", async (req, res, next) => {
  const { refreshToken } = req.body;
  const tokenPayload = jwt.verify(refreshToken, process.env.JWT_SECRET!) as JwtPayload;

  const users = (await getUsers({ id: tokenPayload.id }))[0];

  if (users.length !== 1) {
    return res.status(200).send({
      code: StatusCode.INVALID_REFRESH_TOKEN,
      message: "유효하지 않은 토큰입니다.",
      result: {
        token: null,
      },
    });
  }

  res.status(200).send({
    code: StatusCode.SUCCESS,
    message: "성공적으로 토큰을 갱신했습니다.",
    result: {
      token: {
        refreshToken: {
          token: jwt.sign({ id: tokenPayload.id }, process.env.JWT_SECRET!, { expiresIn: "14d" }),
          expiresIn: 14,
        },
        accessToken: {
          token: jwt.sign({ id: tokenPayload.id }, process.env.JWT_SECRET!, { expiresIn: "1h" }),
          expiresIn: 1 / 24,
        },
      },
      id: users[0].id,
      name: users[0].name,
    },
  });
});
