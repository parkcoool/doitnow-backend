import router from "./";

import StatusCode from "../../../code";

import type { AuthProvider } from "auth";
import type { APIResponse } from "api";

interface ReqeustBody {
  authProvider: AuthProvider;
  code?: string;
  identifier?: string;
  password?: string;
}

interface ResponseBody {
  accessToken: {
    token: string;
    expiresAt: string;
  };
  refreshToken: {
    token: string;
    expiresAt: string;
  };
}

router.post<"/", {}, APIResponse<ResponseBody | undefined>, ReqeustBody>("/", (req, res) => {
  // ...

  res.status(200).send({
    code: StatusCode.SUCCESS,
    message: "성공적으로 로그인되었습니다.",
    result: {
      accessToken: {
        token: "",
        expiresAt: "",
      },
      refreshToken: {
        token: "",
        expiresAt: "",
      },
    },
  });
});
