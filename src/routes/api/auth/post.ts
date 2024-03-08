import authRouter from "./";

import StatusCode from "constant/statusCode";
import getUsers from "model/user/getUsers";

import type { APIResponse } from "api";
import type { AuthProvider } from "auth";
import type { PublicUserRow, UserRow } from "db";

interface ReqeustBody {
  authProvider: AuthProvider;
  code?: string;
  identifier?: string;
  password?: string;
}

interface ResponseBody {
  token: {
    accessToken: {
      token: string;
      expiresAt: string;
    };
    refreshToken: {
      token: string;
      expiresAt: string;
    };
  } | null;
}

authRouter.post<"/", {}, APIResponse<ResponseBody>, ReqeustBody>("/", async (req, res, next) => {
  const isIdentifierEmail = req.body.identifier?.includes("@");
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
        token: null,
      },
    });
  }

  res.status(200).send({
    code: StatusCode.SUCCESS,
    message: "성공적으로 로그인되었습니다.",
    result: {
      token: {
        accessToken: {
          token: "",
          expiresAt: "",
        },
        refreshToken: {
          token: "",
          expiresAt: "",
        },
      },
    },
  });
});
