import jwt from "jsonwebtoken";

import getUserById from "model/user/getUserById";

import InvalidValueError from "error/user/InvalidValueError";
import NotFoundError from "error/user/NotFoundError";

import type { RequestHandler } from "express";
import type { APIResponse } from "api";

interface ReqBody {
  refreshToken: string;
}

interface ResBody extends APIResponse {
  accessToken: {
    token: string;
    expiresIn: number;
  };
  refreshToken: {
    token: string;
    expiresIn: number;
  };
}

const refreshToken: RequestHandler<{}, ResBody, ReqBody> = async function (req, res, next) {
  const { refreshToken } = req.body;

  jwt.verify(refreshToken, process.env.JWT_SECRET_KEY!, async (error, decodedJwt) => {
    if (error || decodedJwt === undefined || typeof decodedJwt === "string") {
      return next(new InvalidValueError("token"));
    }

    const id: number = decodedJwt.id;

    const queryResult = await getUserById({ id });
    const users = queryResult[0];

    if (users.length === 0) {
      return next(new NotFoundError("사용자를 찾을 수 없어요."));
    }

    const newAccessToken = jwt.sign({ id }, process.env.JWT_SECRET_KEY!, { expiresIn: "1h" });
    const newRefreshToken = jwt.sign({ id }, process.env.JWT_SECRET_KEY!, { expiresIn: "14d" });

    res.status(200).send({
      accessToken: {
        token: newAccessToken,
        expiresIn: 1 / 24,
      },
      refreshToken: {
        token: newRefreshToken,
        expiresIn: 14,
      },
      message: "토큰이 갱신됐어요.",
    });
  });
};

export default refreshToken;
