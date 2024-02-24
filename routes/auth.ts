import express from "express";

import StatusCode from "../code";

import type { AuthProvider } from "auth";
import type { APIResponse } from "api";

interface PostBody {
  authProvider: AuthProvider;
  code?: string;
  identifier?: string;
  password?: string;
}

interface PostResponse {
  accessToken: {
    token: string;
    expiresAt: string;
  };
  refreshToken: {
    token: string;
    expiresAt: string;
  };
}

const router = express.Router();

router.use((req, res, next) => {
  next();
});

router.post<"/", {}, APIResponse<PostResponse | undefined>, PostBody>("/", (req, res) => {
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

export default router;
