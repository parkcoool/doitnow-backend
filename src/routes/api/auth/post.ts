import authRouter from "./";

import StatusCode from "constant/statusCode";

import type { AuthProvider } from "auth";
import type { APIResponse } from "api";

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

authRouter.post<"/", {}, APIResponse<ResponseBody>, ReqeustBody>("/", (req, res, next) => {
  // ...

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
