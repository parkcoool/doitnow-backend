import jwt from "jsonwebtoken";

import getUserById from "model/user/getUserById";

import ServerError from "error/ServerError";
import InvalidValueError from "error/user/InvalidValueError";

import type { RequestHandler } from "express";

interface ReqBody {
  refreshToken: string;
}

interface ResBody {
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

  jwt.verify(refreshToken, process.env.JWT_SECRET!, async (error, decodedJwt) => {
    if (error || decodedJwt === undefined || typeof decodedJwt === "string") {
      return next(new InvalidValueError("token"));
    }

    const id: number = decodedJwt.id;

    const queryResult = await getUserById({ id });
    const users = queryResult[0];

    if (users.length === 0) {
      return next(new ServerError("사용자를 찾을 수 없어요."));
    }

    const newAccessToken = jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    const newRefreshToken = jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: "14d" });

    res.status(200).send({
      accessToken: {
        token: newAccessToken,
        expiresIn: 1 / 24,
      },
      refreshToken: {
        token: newRefreshToken,
        expiresIn: 14,
      },
    });
  });
};

export default refreshToken;
